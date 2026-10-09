import { addDays, format, parseISO, getDay } from 'date-fns';
import {
  CalendarDay,
  BridgeOpportunity,
  MalaysianState,
  WeekendType,
  HolidayDefinition,
  GroupedHoliday,
  HolidayStrategy,
  StrategyType,
  Quarter,
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

/**
 * Clusters calendar days and bridge opportunities by holiday events so that each
 * major holiday appears only once in the master list, with its strategy variations
 * selectable via tactile strategy pills.
 */
export function groupBridgesByHoliday(
  bridges: BridgeOpportunity[],
  calendar: CalendarDay[]
): GroupedHoliday[] {
  // 1. Identify all contiguous non-workday clusters in calendar that contain public/replacement holidays
  interface ClusterMeta {
    id: string;
    title: string;
    holidayDates: string[];
    primaryDate: string;
    quarter: Quarter;
  }

  const clusters: ClusterMeta[] = [];
  let i = 0;
  while (i < calendar.length) {
    if (calendar[i].type !== 'WORKDAY') {
      const startIdx = i;
      while (i < calendar.length && calendar[i].type !== 'WORKDAY') {
        i++;
      }
      const slice = calendar.slice(startIdx, i);
      const phDays = slice.filter(
        (d) => d.type === 'PUBLIC_HOLIDAY' || d.type === 'REPLACEMENT_HOLIDAY'
      );

      if (phDays.length > 0) {
        const dates = phDays.map((d) => d.date);
        const primaryDate = dates[0];
        const month = parseInt(primaryDate.split('-')[1], 10);
        const quarter: Quarter = month <= 3 ? 'Q1' : month <= 6 ? 'Q2' : month <= 9 ? 'Q3' : 'Q4';

        // Derive clean title from holiday names in this cluster
        const rawNames = phDays
          .map((d) => d.holidayName?.replace('Replacement: ', '').trim())
          .filter(Boolean) as string[];

        // Normalize repetitive suffixes like "Day 1", "Day 2", "Hari Pertama", etc.
        const cleanedNames = Array.from(
          new Set(
            rawNames.map((name) =>
              name.replace(/ (Day \d|Hari Pertama|Hari Kedua|Hari Ketiga)/i, '').trim()
            )
          )
        );

        const title = cleanedNames.join(' + ') || 'Cuti Umum';

        clusters.push({
          id: `cluster-${primaryDate}`,
          title,
          holidayDates: dates,
          primaryDate,
          quarter,
        });
      }
    } else {
      i++;
    }
  }

  // 2. Map each bridge to its matching cluster
  const clusterMap = new Map<string, BridgeOpportunity[]>();
  clusters.forEach((c) => clusterMap.set(c.id, []));

  bridges.forEach((bridge) => {
    const bridgePhDates = new Set(
      bridge.days
        .filter((d) => d.type === 'PUBLIC_HOLIDAY' || d.type === 'REPLACEMENT_HOLIDAY')
        .map((d) => d.date)
    );

    // Find the cluster that contains any of these holiday dates
    const matched = clusters.find((c) => c.holidayDates.some((d) => bridgePhDates.has(d)));
    if (matched) {
      clusterMap.get(matched.id)?.push(bridge);
    }
  });

  // 3. For each cluster with at least 1 bridge opportunity, build the GroupedHoliday with classified strategies
  const groupedHolidays: GroupedHoliday[] = [];

  const DAY_NAMES_MS = ['Ahad', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];

  clusters.forEach((cluster) => {
    const matchedBridges = clusterMap.get(cluster.id) || [];
    if (matchedBridges.length === 0) return;

    const firstPhDate = cluster.holidayDates[0];
    const lastPhDate = cluster.holidayDates[cluster.holidayDates.length - 1];

    // Build classified strategies
    const strategies: HolidayStrategy[] = matchedBridges.map((bridge) => {
      let type: StrategyType = 'MIDWEEK';
      let label = '';
      let shortTag = '';
      let description = '';

      if (bridge.alDaysRequired === 0) {
        type = 'ZERO_AL';
        label = `0 AL (${bridge.totalDaysOff}H)`;
        shortTag = `${bridge.totalDaysOff}H OFF`;
        description = `Cuti Semulajadi tanpa tolak baki AL (${bridge.totalDaysOff} hari rehat)`;
      } else {
        const alDates = bridge.annualLeaveDates;
        const allBefore = alDates.length > 0 && alDates.every((d) => d < firstPhDate);
        const allAfter = alDates.length > 0 && alDates.every((d) => d > lastPhDate);
        const isCombo =
          alDates.length > 0 &&
          alDates.some((d) => d < firstPhDate) &&
          alDates.some((d) => d > lastPhDate);

        if (allBefore) {
          type = 'BEFORE';
          label = `SEBELUM (${bridge.alDaysRequired} AL)`;
          shortTag = `${bridge.alDaysRequired} AL • ${bridge.totalDaysOff}H`;
          description = `Ambil ${bridge.alDaysRequired} hari AL sebelum cuti (${bridge.totalDaysOff} hari rehat)`;
        } else if (allAfter) {
          type = 'AFTER';
          label = `SELEPAS (${bridge.alDaysRequired} AL)`;
          shortTag = `${bridge.alDaysRequired} AL • ${bridge.totalDaysOff}H`;
          description = `Ambil ${bridge.alDaysRequired} hari AL selepas cuti (${bridge.totalDaysOff} hari rehat)`;
        } else if (isCombo) {
          type = 'COMBO';
          label = `COMBO (${bridge.alDaysRequired} AL)`;
          shortTag = `${bridge.alDaysRequired} AL • ${bridge.totalDaysOff}H`;
          description = `Sambung cuti sebelum & selepas untuk ${bridge.totalDaysOff} hari rehat berturut-turut!`;
        } else {
          type = 'MIDWEEK';
          label = `JAMBATAN (${bridge.alDaysRequired} AL)`;
          shortTag = `${bridge.alDaysRequired} AL • ${bridge.totalDaysOff}H`;
          description = `Jambatan cuti tengah minggu (${bridge.totalDaysOff} hari rehat)`;
        }
      }

      return {
        id: bridge.id,
        type,
        label,
        shortTag,
        description,
        isRecommended: false,
        bridge,
      };
    });

    // Smart curation: Deduplicate redundant variations within each category
    // (e.g. keep only the best/most meaningful BEFORE, AFTER, COMBO options instead of 10+ permutations)
    const curatedStrategies: HolidayStrategy[] = [];

    // 1. Zero AL option (if any, keep the one with most days off)
    const zeroAlList = strategies.filter((s) => s.type === 'ZERO_AL');
    if (zeroAlList.length > 0) {
      curatedStrategies.push(zeroAlList[0]);
    }

    // 2. Before options (keep at most 2: lowest AL and highest days off)
    const beforeList = strategies.filter((s) => s.type === 'BEFORE');
    if (beforeList.length > 0) {
      curatedStrategies.push(beforeList[0]);
      const maxDaysBefore = beforeList.reduce((max, s) =>
        s.bridge.totalDaysOff > max.bridge.totalDaysOff ? s : max
      );
      if (maxDaysBefore.id !== beforeList[0].id) {
        curatedStrategies.push(maxDaysBefore);
      }
    }

    // 3. After options (keep at most 2: lowest AL and highest days off)
    const afterList = strategies.filter((s) => s.type === 'AFTER');
    if (afterList.length > 0) {
      curatedStrategies.push(afterList[0]);
      const maxDaysAfter = afterList.reduce((max, s) =>
        s.bridge.totalDaysOff > max.bridge.totalDaysOff ? s : max
      );
      if (maxDaysAfter.id !== afterList[0].id) {
        curatedStrategies.push(maxDaysAfter);
      }
    }

    // 4. Combo option (keep the single best combo: max total days off)
    const comboList = strategies.filter((s) => s.type === 'COMBO');
    if (comboList.length > 0) {
      const bestCombo = comboList.reduce((best, s) => {
        if (s.bridge.totalDaysOff !== best.bridge.totalDaysOff) {
          return s.bridge.totalDaysOff > best.bridge.totalDaysOff ? s : best;
        }
        return s.bridge.roiMultiplier > best.bridge.roiMultiplier ? s : best;
      });
      curatedStrategies.push(bestCombo);
    }

    // 5. Midweek option (if no before/after/combo, or if standalone)
    const midweekList = strategies.filter((s) => s.type === 'MIDWEEK');
    if (curatedStrategies.length === 0 && midweekList.length > 0) {
      curatedStrategies.push(midweekList[0]);
      const maxMidweek = midweekList.reduce((max, s) =>
        s.bridge.totalDaysOff > max.bridge.totalDaysOff ? s : max
      );
      if (maxMidweek.id !== midweekList[0].id) {
        curatedStrategies.push(maxMidweek);
      }
    }

    const finalStrategies = curatedStrategies.length > 0 ? curatedStrategies : strategies.slice(0, 4);

    // Sort strategies: 0 AL first, then fewest AL required, then max days off descending
    finalStrategies.sort((a, b) => {
      if (a.type === 'ZERO_AL' && b.type !== 'ZERO_AL') return -1;
      if (b.type === 'ZERO_AL' && a.type !== 'ZERO_AL') return 1;
      if (a.bridge.alDaysRequired !== b.bridge.alDaysRequired) {
        return a.bridge.alDaysRequired - b.bridge.alDaysRequired;
      }
      return b.bridge.totalDaysOff - a.bridge.totalDaysOff;
    });

    // Mark the best recommended strategy (0 AL baseline or highest ROI multiplier)
    let bestStrategy = finalStrategies[0];
    let maxScore = -1;
    finalStrategies.forEach((s) => {
      const score =
        s.type === 'ZERO_AL'
          ? 1000 + s.bridge.totalDaysOff
          : s.bridge.roiMultiplier * 10 + s.bridge.totalDaysOff;
      if (score > maxScore) {
        maxScore = score;
        bestStrategy = s;
      }
    });
    bestStrategy.isRecommended = true;

    // Format dates cleanly with Malay day names
    const startParsed = parseISO(firstPhDate);
    const endParsed = parseISO(lastPhDate);
    const startDow = DAY_NAMES_MS[getDay(startParsed)];
    const endDow = DAY_NAMES_MS[getDay(endParsed)];

    let holidayDatesFormatted = '';
    let holidayDaysFormatted = '';
    if (firstPhDate === lastPhDate) {
      holidayDatesFormatted = format(startParsed, 'd MMM yyyy');
      holidayDaysFormatted = startDow;
    } else {
      holidayDatesFormatted = `${format(startParsed, 'd')} – ${format(endParsed, 'd MMM yyyy')}`;
      holidayDaysFormatted = `${startDow} – ${endDow}`;
    }

    const maxDaysOff = Math.max(...finalStrategies.map((s) => s.bridge.totalDaysOff));
    const minAlRequired = Math.min(...finalStrategies.map((s) => s.bridge.alDaysRequired));
    const bestRoi = Math.max(...finalStrategies.map((s) => s.bridge.roiMultiplier));

    // End date of the furthest bridge in this cluster (for past-holiday checking)
    const latestEndDate = matchedBridges.reduce((latest, b) => {
      return b.endDate > latest ? b.endDate : latest;
    }, lastPhDate);

    groupedHolidays.push({
      id: cluster.id,
      title: cluster.title,
      holidayDatesFormatted,
      holidayDaysFormatted,
      holidayDates: cluster.holidayDates,
      primaryDate: cluster.primaryDate,
      endDate: latestEndDate,
      quarter: cluster.quarter,
      strategies: finalStrategies,
      maxDaysOff,
      minAlRequired,
      bestRoi,
    });
  });

  return groupedHolidays;
}
