import { useLeaveStore } from '../store/useLeaveStore';
import { MalaysianState, STATE_NAMES } from '../types';
import { Palmtree, RefreshCw } from 'lucide-react';

export function Header() {
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
      {/* Brand on Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
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
            flexShrink: 0,
          }}
        >
          <Palmtree size={22} strokeWidth={2.5} color="var(--border-color)" />
        </div>
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.5px',
              lineHeight: 1,
              margin: 0,
              color: 'var(--text-color)',
              whiteSpace: 'nowrap',
            }}
          >
            CUTI READY
          </h1>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
            }}
          >
            MALAYSIA • 2026
          </span>
        </div>
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
      </div>
    </header>
  );
}
