import { useLeaveStore } from '../store/useLeaveStore';
import { BrutalistBadge } from './BrutalistBadge';
import { BrutalistSelect } from './BrutalistSelect';
import { MalaysianState, STATE_NAMES } from '../types';
import { Palmtree, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenHolidayDrawer: () => void;
}

export function Header({ onOpenHolidayDrawer }: HeaderProps) {
  const {
    state,
    setState,
    weekendType,
    annualLeaveBalance,
    plannedLeaveDates,
    observedHolidayIds,
    resetToDefaults,
  } = useLeaveStore();

  const remainingAl = Math.max(0, annualLeaveBalance - plannedLeaveDates.length);

  const stateOptions = (Object.keys(STATE_NAMES) as MalaysianState[]).map((key) => ({
    value: key,
    label: STATE_NAMES[key],
    badge: key === 'KEDAH' || key === 'KELANTAN' || key === 'TERENGGANU' ? 'Fri-Sat' : 'Sat-Sun',
  }));

  return (
    <header style={{ marginBottom: '1.25rem' }}>
      {/* Top Banner with Brand and Quick Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              backgroundColor: 'var(--accent-yellow)',
              border: 'var(--border-width) solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.35rem',
              boxShadow: '2px 2px 0px var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Palmtree size={24} strokeWidth={2.5} color="var(--border-color)" />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.5px',
                lineHeight: 1,
                margin: 0,
              }}
            >
              CUTI READY
            </h1>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-muted)',
              }}
            >
              MALAYSIAN LEAVE ARBITRAGE • 2026
            </span>
          </div>
        </div>

        <button
          onClick={resetToDefaults}
          title="Reset preferences to default"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '2px solid var(--border-color)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.4rem',
            cursor: 'pointer',
            boxShadow: '2px 2px 0px var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RefreshCw size={15} color="var(--border-color)" />
        </button>
      </div>

      {/* State & Leave Status Pills Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <BrutalistBadge
          color="var(--accent-yellow)"
          style={{ cursor: 'pointer' }}
          onClick={onOpenHolidayDrawer}
        >
          {observedHolidayIds.length} HOLIDAYS OBSERVED
        </BrutalistBadge>

        <BrutalistBadge
          color={remainingAl > 3 ? 'var(--accent-cyan)' : 'var(--accent-pink)'}
        >
          {remainingAl} / {annualLeaveBalance} AL REMAINING
        </BrutalistBadge>

        <BrutalistBadge color="var(--weekend-bg)">
          {weekendType === 'SAT_SUN' ? 'SAT–SUN WEEKEND' : 'FRI–SAT WEEKEND'}
        </BrutalistBadge>
      </div>

      {/* State Dropdown Selector */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: 'var(--border-width) solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          padding: '0.75rem',
          boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
        }}
      >
        <BrutalistSelect
          label="Select Working State / Territory"
          value={state}
          onChange={(val) => setState(val as MalaysianState)}
          options={stateOptions}
          helperText={`Rest days automatically configured for ${STATE_NAMES[state]}: ${
            weekendType === 'SAT_SUN' ? 'Saturday & Sunday' : 'Friday & Saturday'
          }`}
        />
      </div>
    </header>
  );
}
