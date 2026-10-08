export type MalaysianState =
  | 'JOHOR'
  | 'KEDAH'
  | 'KELANTAN'
  | 'MELAKA'
  | 'NEGERI_SEMBILAN'
  | 'PAHANG'
  | 'PENANG'
  | 'PERAK'
  | 'PERLIS'
  | 'SABAH'
  | 'SARAWAK'
  | 'SELANGOR'
  | 'TERENGGANU'
  | 'KUALA_LUMPUR'
  | 'LABUAN'
  | 'PUTRAJAYA';

export type WeekendType = 'SAT_SUN' | 'FRI_SAT';

export const STATE_WEEKEND_MAP: Record<MalaysianState, WeekendType> = {
  JOHOR: 'SAT_SUN',
  KEDAH: 'FRI_SAT',
  KELANTAN: 'FRI_SAT',
  TERENGGANU: 'FRI_SAT',
  KUALA_LUMPUR: 'SAT_SUN',
  SELANGOR: 'SAT_SUN',
  PENANG: 'SAT_SUN',
  PERAK: 'SAT_SUN',
  PAHANG: 'SAT_SUN',
  NEGERI_SEMBILAN: 'SAT_SUN',
  MELAKA: 'SAT_SUN',
  PERLIS: 'SAT_SUN',
  SABAH: 'SAT_SUN',
  SARAWAK: 'SAT_SUN',
  LABUAN: 'SAT_SUN',
  PUTRAJAYA: 'SAT_SUN',
};

export const STATE_NAMES: Record<MalaysianState, string> = {
  KUALA_LUMPUR: 'Kuala Lumpur',
  SELANGOR: 'Selangor',
  JOHOR: 'Johor',
  PENANG: 'Penang',
  PERAK: 'Perak',
  KEDAH: 'Kedah',
  KELANTAN: 'Kelantan',
  TERENGGANU: 'Terengganu',
  PAHANG: 'Pahang',
  NEGERI_SEMBILAN: 'Negeri Sembilan',
  MELAKA: 'Melaka',
  PERLIS: 'Perlis',
  SABAH: 'Sabah',
  SARAWAK: 'Sarawak',
  LABUAN: 'Labuan',
  PUTRAJAYA: 'Putrajaya',
};

export type HolidayCategory = 'FEDERAL' | 'STATE';

export interface HolidayDefinition {
  id: string;
  name: string;
  nameMs: string;
  date: string; // YYYY-MM-DD
  category: HolidayCategory;
  isCompulsoryEA1955: boolean;
  statesObserved: MalaysianState[] | 'ALL';
}

export type DayType =
  | 'WORKDAY'
  | 'WEEKEND'
  | 'PUBLIC_HOLIDAY'
  | 'REPLACEMENT_HOLIDAY'
  | 'ANNUAL_LEAVE';

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  type: DayType;
  holidayName?: string;
  holidayId?: string;
  isPlannedAl?: boolean;
}

export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface BridgeOpportunity {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDaysOff: number;
  alDaysRequired: number;
  roiMultiplier: number; // totalDaysOff / alDaysRequired (or high score if 0 AL)
  annualLeaveDates: string[]; // YYYY-MM-DD
  days: CalendarDay[];
  quarter: Quarter;
}

export type LeavePreset = 'MINIMUM_11' | 'CORPORATE_15' | 'ALL' | 'CUSTOM';

export type FilterTabType = 'ALL' | 'HIGH_ROI' | 'ZERO_AL' | 'Q1' | 'Q2' | 'Q3' | 'Q4';

export type AppTab = 'BRIDGES' | 'PLAN' | 'RULES';

export interface UserPreferences {
  selectedYear: number;
  state: MalaysianState;
  weekendType: WeekendType;
  annualLeaveBalance: number;
  maxAlPerBridge: number; // Slider: 1 to 5 days
  observedHolidayIds: string[];
  allowSaturdayReplacements: boolean;
  plannedLeaveDates: string[]; // User's locked-in AL choices
  hidePastHolidays?: boolean;
}
