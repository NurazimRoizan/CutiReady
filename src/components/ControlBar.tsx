import { useLeaveStore } from '../store/useLeaveStore';
import { BrutalistButton } from './BrutalistButton';
import { Settings, Sparkles, Building, Globe } from 'lucide-react';

interface ControlBarProps {
  onOpenHolidayDrawer: () => void;
}

export function ControlBar({ onOpenHolidayDrawer }: ControlBarProps) {
  const {
    activePreset,
    applyPreset,
    maxAlPerBridge,
    setMaxAlPerBridge,
    annualLeaveBalance,
    setAlBalance,
  } = useLeaveStore();

  const presets = [
    {
      id: 'MINIMUM_11' as const,
      label: 'EA 1955 (11D)',
      icon: Sparkles,
      tooltip: 'Employment Act statutory minimum: 5 compulsory + 6 chosen',
    },
    {
      id: 'CORPORATE_15' as const,
      label: 'Corp (15D)',
      icon: Building,
      tooltip: 'Standard private sector package: 15 observed holidays',
    },
    {
      id: 'ALL' as const,
      label: 'All Gazetted',
      icon: Globe,
      tooltip: 'All state and federal gazetted public holidays',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: 'var(--border-width) solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: '0.85rem',
        boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
        marginBottom: '1rem',
      }}
    >
      {/* 1. Preset Selector Buttons */}
      <div style={{ marginBottom: '0.85rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.35rem',
          }}
        >
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--text-color)',
            }}
          >
            Statutory Holiday Preset:
          </label>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            {activePreset === 'CUSTOM' ? 'Custom Tuned' : activePreset}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.4rem',
          }}
        >
          {presets.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                title={p.tooltip}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                  backgroundColor: isSelected
                    ? 'var(--accent-yellow)'
                    : 'var(--bg-primary)',
                  color: 'var(--text-color)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem 0.2rem',
                  fontSize: '0.74rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: isSelected
                    ? '2px 2px 0px var(--border-color)'
                    : '1px 1px 0px var(--border-color)',
                  transition: 'all 0.08s ease',
                  userSelect: 'none',
                }}
              >
                <p.icon size={13} strokeWidth={2.5} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Max AL per Bridge & Total Balance Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '0.65rem',
          alignItems: 'center',
          marginBottom: '0.85rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        {/* Max AL per bridge slider */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.25rem',
            }}
          >
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Max AL / Bridge:
            </label>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 900,
                backgroundColor: 'var(--accent-cyan)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-pill)',
                padding: '0.05rem 0.4rem',
              }}
            >
              {maxAlPerBridge} {maxAlPerBridge === 1 ? 'DAY' : 'DAYS'}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={maxAlPerBridge}
            onChange={(e) => setMaxAlPerBridge(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--text-color)',
              cursor: 'pointer',
            }}
          />
        </div>

        {/* Total Annual Leave Quota */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.25rem',
            }}
          >
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Total AL Quota:
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <button
              type="button"
              onClick={() => setAlBalance(Math.max(1, annualLeaveBalance - 1))}
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                fontWeight: 900,
                width: '28px',
                height: '28px',
                cursor: 'pointer',
              }}
            >
              -
            </button>
            <div
              style={{
                flex: 1,
                textAlign: 'center',
                fontWeight: 900,
                fontSize: '0.9rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '0.2rem',
              }}
            >
              {annualLeaveBalance}
            </div>
            <button
              type="button"
              onClick={() => setAlBalance(annualLeaveBalance + 1)}
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                fontWeight: 900,
                width: '28px',
                height: '28px',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 3. Button to Open Slide-Over Drawer */}
      <BrutalistButton
        onClick={onOpenHolidayDrawer}
        color="var(--accent-pink)"
        size="sm"
        style={{ width: '100%' }}
      >
        <Settings size={15} strokeWidth={2.5} />
        <span>Configure Observed Holidays & Cuti Ganti</span>
      </BrutalistButton>
    </div>
  );
}
