import { useLeaveStore } from '../store/useLeaveStore';
import { MalaysianState, STATE_NAMES } from '../types';
import { RefreshCw, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenHelp?: () => void;
}

export function Header({ onOpenHelp }: HeaderProps) {
  const { state, setState, resetToDefaults } = useLeaveStore();

  const stateOptions = (Object.keys(STATE_NAMES) as MalaysianState[]).map((key) => ({
    value: key,
    label: STATE_NAMES[key],
    badge: key === 'KEDAH' || key === 'KELANTAN' || key === 'TERENGGANU' ? 'Fri-Sat' : 'Sat-Sun',
  }));

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.25rem',
        width: '100%',
      }}
    >
      {/* Brand on Left (Two stacked rows, no icon, no subtitle) */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1
          style={{
            fontSize: '1.2rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
            lineHeight: 0.95,
            margin: 0,
            color: 'var(--text-color)',
            whiteSpace: 'nowrap',
          }}
        >
          CUTI
        </h1>
        <h1
          style={{
            fontSize: '1.2rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
            lineHeight: 0.95,
            margin: 0,
            color: 'var(--text-color)',
            whiteSpace: 'nowrap',
          }}
        >
          READY
        </h1>
      </div>

      {/* State Selector & Reset Button on Top Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <select
            value={state}
            onChange={(e) => setState(e.target.value as MalaysianState)}
            title="Select working state / territory"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.4rem 1.6rem 0.4rem 0.6rem',
              fontSize: '0.76rem',
              fontWeight: 900,
              color: 'var(--text-color)',
              boxShadow: '2px 2px 0px var(--border-color)',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              textTransform: 'uppercase',
              maxWidth: '160px',
            }}
          >
            {stateOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.badge})
              </option>
            ))}
          </select>
          <span
            style={{
              position: 'absolute',
              right: '0.55rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fontSize: '0.65rem',
              fontWeight: 900,
              color: 'var(--text-color)',
            }}
          >
            ▼
          </span>
        </div>

        <button
          onClick={resetToDefaults}
          title="Reset preferences to default"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '2px solid var(--border-color)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.42rem',
            cursor: 'pointer',
            boxShadow: '2px 2px 0px var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <RefreshCw size={14} color="var(--border-color)" />
        </button>

        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            title="How leave arbitrage works"
            style={{
              backgroundColor: 'var(--accent-yellow)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.42rem',
              cursor: 'pointer',
              boxShadow: '2px 2px 0px var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <HelpCircle size={14} color="var(--border-color)" />
          </button>
        )}
      </div>
    </header>
  );
}
