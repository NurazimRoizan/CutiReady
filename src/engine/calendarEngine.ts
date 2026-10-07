import { addDays, format, parseISO, getDay } from 'date-fns';
import {
  CalendarDay,
  BridgeOpportunity,
  MalaysianState,
  WeekendType,
  HolidayDefinition,
} from '../types';
import { DEFAULT_HOLIDAYS_2026 } from '../data/holidays';

/**
 * Builds the normalized 365/366 day calendar for the given year and state,
 * applying Malaysian Employment Act 1955 replacement rules (Cuti Ganti).
 */
export function buildNormalizedCalendar(
  year: number,
  state: MalaysianState,
  weekendType: WeekendType,
  observedHolidayIds: string[],
  allowSaturdayReplacements: boolean,
  plannedLeaveDates: string[] = []
): CalendarDay[] {
  const startDate = parseISO(`${year}-01-01`);
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInYear = isLeapYear ? 366 : 365;
  const calendar: CalendarDay[] = [];

  // Filter active holidays observed by the company in this state
  const activeHolidays = DEFAULT_HOLIDAYS_2026.filter(
    (h) =>
      observedHolidayIds.includes(h.id) &&
      (h.statesObserved === 'ALL' || h.statesObserved.includes(state))
  );

  const holidayDateMap = new Map<string, HolidayDefinition>();
  activeHolidays.forEach((h) => holidayDateMap.set(h.date, h));

  // 1. Initial Pass: Identify base Workdays, Weekends, and Public Holidays
  for (let i = 0; i < daysInYear; i++) {
    const currentDate = addDays(startDate, i);
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dow = getDay(currentDate);

    const isWeekend =
      weekendType === 'SAT_SUN'
        ? dow === 0 || dow === 6
        : dow === 5 || dow === 6;

    const matchedHoliday = holidayDateMap.get(dateStr);
    const isPlanned = plannedLeaveDates.includes(dateStr);

    calendar.push({
      date: dateStr,
      dayOfWeek: dow,
      type: matchedHoliday ? 'PUBLIC_HOLIDAY' : isWeekend ? 'WEEKEND' : 'WORKDAY',
      holidayName: matchedHoliday?.name,
      holidayId: matchedHoliday?.id,
      isPlannedAl: isPlanned,
    });
  }

  // 2. Replacement Holiday Pass (Cuti Ganti)
  // Under EA 1955 s60D:
  // - If a Public Holiday falls on a Rest Day (Sunday for SAT_SUN, Saturday for FRI_SAT),
  //   the next working day becomes a paid replacement holiday.
  // - If two consecutive holidays clash (e.g. Sun & Mon), Sunday rolls to Tuesday.
  // - If allowSaturdayReplacements is enabled for SAT_SUN, Saturday holidays also roll to next workday.
  for (let i = 0; i < calendar.length; i++) {
    const day = calendar[i];
    if (day.type !== 'PUBLIC_HOLIDAY') continue;

    const isRestDayClash =
      weekendType === 'SAT_SUN'
        ? day.dayOfWeek === 0 // Sunday
        : day.dayOfWeek === 6; // Saturday

    const isOffDayClash =
      weekendType === 'SAT_SUN'
        ? day.dayOfWeek === 6 && allowSaturdayReplacements // Saturday
        : day.dayOfWeek === 5 && allowSaturdayReplacements; // Friday

    if (isRestDayClash || isOffDayClash) {
      let targetIdx = i + 1;
      while (targetIdx < calendar.length) {
        if (calendar[targetIdx].type === 'WORKDAY') {
          calendar[targetIdx].type = 'REPLACEMENT_HOLIDAY';
          calendar[targetIdx].holidayName = `Replacement: ${day.holidayName}`;
          break;
        }
        targetIdx++;
      }
    }
  }

  return calendar;
}

/**
 * Searches for all viable long weekend bridge opportunities across the calendar year
 * constrained by the max Annual Leave (AL) days permitted per bridge.
 */
export function findBridgeOpportunities(
  calendar: CalendarDay[],
  maxAlPerBridge: number = 3
): BridgeOpportunity[] {
  const opportunities: BridgeOpportunity[] = [];
  const n = calendar.length;

  for (let start = 0; start < n; start++) {
    // A bridge can either start on a holiday/weekend or on a workday right before a break
    // If it starts on a workday, it shouldn't be preceded by another workday in this evaluation
    if (calendar[start].type === 'WORKDAY' && start > 0 && calendar[start - 1].type === 'WORKDAY') {
      continue;
    }

    const currentAlDates: string[] = [];
    let phCount = 0;

    for (let end = start; end < n; end++) {
      const current = calendar[end];

      if (current.type === 'WORKDAY') {
        currentAlDates.push(current.date);
      } else if (current.type === 'PUBLIC_HOLIDAY' || current.type === 'REPLACEMENT_HOLIDAY') {
        phCount++;
      }

      if (currentAlDates.length > maxAlPerBridge) break;

      const nextDay = end + 1 < n ? calendar[end + 1] : null;
      // Window ends when the next day is a regular unbridged workday, or at calendar boundary
      const isWindowBoundary = !nextDay || nextDay.type === 'WORKDAY';

      // We only consider windows that contain at least one Public Holiday or Replacement Holiday
      // and do not end on a loose workday with no subsequent benefit
      if (isWindowBoundary && phCount > 0) {
        const totalDaysOff = end - start + 1;
        const alUsed = currentAlDates.length;

        // Long weekend definition: 3 or more contiguous days off
        if (totalDaysOff >= 3) {
          const roi = alUsed === 0 ? totalDaysOff * 10 : Number((totalDaysOff / alUsed).toFixed(2));
          const windowSlice = calendar.slice(start, end + 1);
          const month = parseInt(windowSlice[0].date.split('-')[1], 10);
          const quarter = month <= 3 ? 'Q1' : month <= 6 ? 'Q2' : month <= 9 ? 'Q3' : 'Q4';

          opportunities.push({
            id: `bridge-${windowSlice[0].date}-${windowSlice[windowSlice.length - 1].date}`,
            title: deriveBridgeTitle(windowSlice),
            startDate: windowSlice[0].date,
            endDate: windowSlice[windowSlice.length - 1].date,
            totalDaysOff,
            alDaysRequired: alUsed,
            roiMultiplier: roi,
            annualLeaveDates: [...currentAlDates],
            days: windowSlice,
            quarter,
          });
        }
      }
    }
  }

  return deduplicateAndFilterBridges(opportunities);
}

function deriveBridgeTitle(days: CalendarDay[]): string {
  const holidays = days
    .filter((d) => d.type === 'PUBLIC_HOLIDAY' || d.type === 'REPLACEMENT_HOLIDAY')
    .map((d) => d.holidayName?.replace('Replacement: ', ''))
    .filter(Boolean);

  const uniqueHolidays = Array.from(new Set(holidays));
  return uniqueHolidays.length > 0
    ? `${uniqueHolidays.join(' + ')} Long Weekend`
    : 'Long Weekend';
}

function deduplicateAndFilterBridges(bridges: BridgeOpportunity[]): BridgeOpportunity[] {
  // Sort first by total days off (descending), then fewest AL days required (ascending), then by start date
  return bridges
    .sort((a, b) => {
      if (b.totalDaysOff !== a.totalDaysOff) return b.totalDaysOff - a.totalDaysOff;
      if (a.alDaysRequired !== b.alDaysRequired) return a.alDaysRequired - b.alDaysRequired;
      return a.startDate.localeCompare(b.startDate);
    })
    .filter(
      (bridge, index, self) =>
        index ===
        self.findIndex((b) => b.startDate === bridge.startDate && b.endDate === bridge.endDate)
    )
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}
