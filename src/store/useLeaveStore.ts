import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MalaysianState,
  WeekendType,
  UserPreferences,
  LeavePreset,
  STATE_WEEKEND_MAP,
} from '../types';
import { DEFAULT_HOLIDAYS_2026 } from '../data/holidays';

interface LeaveStore extends UserPreferences {
  activePreset: LeavePreset;
  setState: (state: MalaysianState) => void;
  setWeekendType: (type: WeekendType) => void;
  setAlBalance: (balance: number) => void;
  setMaxAlPerBridge: (max: number) => void;
  toggleHoliday: (id: string) => void;
  applyPreset: (preset: 'MINIMUM_11' | 'CORPORATE_15' | 'ALL') => void;
  toggleSaturdayReplacements: (enabled: boolean) => void;
  togglePlannedLeaveDate: (date: string) => void;
  togglePlannedBridgeDates: (dates: string[]) => void;
  clearAllPlannedLeave: () => void;
  hidePastHolidays: boolean;
  toggleHidePastHolidays: () => void;
  setHidePastHolidays: (hide: boolean) => void;
  resetToDefaults: () => void;
}

export const useLeaveStore = create<LeaveStore>()(
  persist(
    (set, get) => ({
      selectedYear: 2026,
      state: 'KUALA_LUMPUR',
      weekendType: 'SAT_SUN',
      annualLeaveBalance: 14,
      maxAlPerBridge: 2,
      allowSaturdayReplacements: false,
      plannedLeaveDates: [],
      observedHolidayIds: DEFAULT_HOLIDAYS_2026.map((h) => h.id),
      activePreset: 'ALL',
      hidePastHolidays: true,

      toggleHidePastHolidays: () =>
        set((state) => ({ hidePastHolidays: !state.hidePastHolidays })),

      setHidePastHolidays: (hidePastHolidays) => set({ hidePastHolidays }),

      setState: (state) => {
        set({
          state,
          weekendType: STATE_WEEKEND_MAP[state] ?? 'SAT_SUN',
        });
      },

      setWeekendType: (weekendType) => set({ weekendType }),

      setAlBalance: (annualLeaveBalance) => set({ annualLeaveBalance }),

      setMaxAlPerBridge: (maxAlPerBridge) => set({ maxAlPerBridge }),

      toggleHoliday: (id) => {
        const { observedHolidayIds } = get();
        const updated = observedHolidayIds.includes(id)
          ? observedHolidayIds.filter((hId) => hId !== id)
          : [...observedHolidayIds, id];
        set({
          observedHolidayIds: updated,
          activePreset: 'CUSTOM',
        });
      },

      applyPreset: (preset) => {
        const state = get().state;

        if (preset === 'ALL') {
          set({
            observedHolidayIds: DEFAULT_HOLIDAYS_2026.map((h) => h.id),
            activePreset: 'ALL',
          });
        } else if (preset === 'MINIMUM_11') {
          // Statutory EA 1955: 5 compulsory gazetted + 6 employer-nominated
          const comp = DEFAULT_HOLIDAYS_2026
            .filter(
              (h) =>
                h.isCompulsoryEA1955 &&
                (h.statesObserved === 'ALL' || h.statesObserved.includes(state))
            )
            .map((h) => h.id);

          const nonComp = DEFAULT_HOLIDAYS_2026
            .filter(
              (h) =>
                !h.isCompulsoryEA1955 &&
                (h.statesObserved === 'ALL' || h.statesObserved.includes(state))
            )
            .slice(0, 6)
            .map((h) => h.id);

          set({
            observedHolidayIds: [...comp, ...nonComp],
            activePreset: 'MINIMUM_11',
          });
        } else if (preset === 'CORPORATE_15') {
          const filtered = DEFAULT_HOLIDAYS_2026
            .filter((h) => h.statesObserved === 'ALL' || h.statesObserved.includes(state))
            .slice(0, 15)
            .map((h) => h.id);

          set({
            observedHolidayIds: filtered,
            activePreset: 'CORPORATE_15',
          });
        }
      },

      toggleSaturdayReplacements: (allowSaturdayReplacements) =>
        set({ allowSaturdayReplacements }),

      togglePlannedLeaveDate: (date) => {
        const { plannedLeaveDates } = get();
        set({
          plannedLeaveDates: plannedLeaveDates.includes(date)
            ? plannedLeaveDates.filter((d) => d !== date)
            : [...plannedLeaveDates, date],
        });
      },

      togglePlannedBridgeDates: (dates) => {
        const { plannedLeaveDates } = get();
        // If all dates in bridge are already planned, remove them; otherwise add them all
        const allIncluded = dates.every((d) => plannedLeaveDates.includes(d));
        if (allIncluded) {
          set({
            plannedLeaveDates: plannedLeaveDates.filter((d) => !dates.includes(d)),
          });
        } else {
          const setDates = new Set([...plannedLeaveDates, ...dates]);
          set({
            plannedLeaveDates: Array.from(setDates),
          });
        }
      },

      clearAllPlannedLeave: () => set({ plannedLeaveDates: [] }),

      resetToDefaults: () => {
        set({
          selectedYear: 2026,
          state: 'KUALA_LUMPUR',
          weekendType: 'SAT_SUN',
          annualLeaveBalance: 14,
          maxAlPerBridge: 2,
          allowSaturdayReplacements: false,
          plannedLeaveDates: [],
          observedHolidayIds: DEFAULT_HOLIDAYS_2026.map((h) => h.id),
          activePreset: 'ALL',
          hidePastHolidays: true,
        });
      },
    }),
    {
      name: 'cutiready-storage',
    }
  )
);
