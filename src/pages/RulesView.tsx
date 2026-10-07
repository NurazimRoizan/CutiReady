import { useState } from 'react';
import { useLeaveStore } from '../store/useLeaveStore';
import { DEFAULT_HOLIDAYS_2026 } from '../data/holidays';
import { MalaysianState, STATE_NAMES } from '../types';
import { BrutalistBadge } from '../components/BrutalistBadge';
import { BrutalistCard } from '../components/BrutalistCard';
import { format, parseISO } from 'date-fns';
import {
  Settings,
  Building,
  Sparkles,
  Globe,
  Lock,
  Check,
} from 'lucide-react';

export function RulesView() {
  const {
    state,
    setState,
    weekendType,
    observedHolidayIds,
    toggleHoliday,
    applyPreset,
    activePreset,
    allowSaturdayReplacements,
    toggleSaturdayReplacements,
    annualLeaveBalance,
    setAlBalance,
    maxAlPerBridge,
    setMaxAlPerBridge,
  } = useLeaveStore();

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'COMPULSORY' | 'FEDERAL' | 'STATE'>('ALL');

  const stateOptions = (Object.keys(STATE_NAMES) as MalaysianState[]).map((key) => ({
    value: key,
    label: STATE_NAMES[key],
    badge: key === 'KEDAH' || key === 'KELANTAN' || key === 'TERENGGANU' ? 'Fri-Sat' : 'Sat-Sun',
  }));

  // Filter holidays applicable to this state
  const applicableHolidays = DEFAULT_HOLIDAYS_2026.filter(
    (h) => h.statesObserved === 'ALL' || h.statesObserved.includes(state)
  );

  const observedCount = applicableHolidays.filter((h) =>
    observedHolidayIds.includes(h.id)
  ).length;

  const compulsoryHolidays = applicableHolidays.filter((h) => h.isCompulsoryEA1955);
  const federalHolidays = applicableHolidays.filter((h) => !h.isCompulsoryEA1955 && h.category === 'FEDERAL');
  const stateHolidays = applicableHolidays.filter((h) => !h.isCompulsoryEA1955 && h.category === 'STATE');

  const filteredHolidays =
    categoryFilter === 'ALL'
      ? applicableHolidays
      : categoryFilter === 'COMPULSORY'
      ? compulsoryHolidays
      : categoryFilter === 'FEDERAL'
      ? federalHolidays
      : stateHolidays;

  const presets = [
    {
      id: 'MINIMUM_11' as const,
      label: 'EA 1955 (11D)',
      icon: Sparkles,
      desc: 'Legal minimum: 5 compulsory + 6 chosen',
    },
    {
      id: 'CORPORATE_15' as const,
      label: 'Corp (15D)',
      icon: Building,
      desc: 'Standard private sector package',
    },
    {
      id: 'ALL' as const,
      label: 'All Gazetted',
      icon: Globe,
      desc: 'All federal & state public holidays',
    },
  ];

  return (
    <div>
      {/* 1. View Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Settings size={22} strokeWidth={2.5} color="var(--text-color)" />
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.5px',
              margin: 0,
            }}
          >
            Company Rules & Holidays
          </h2>
        </div>

        <BrutalistBadge color="var(--accent-yellow)">
          {observedCount} OBSERVED
        </BrutalistBadge>
      </div>

      {/* 2. State & Weekend Mapping Card */}
      <BrutalistCard headerColor="var(--accent-cyan)" title="1. WORK STATE & REST DAYS">
        <p
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            margin: '0 0 0.65rem 0',
          }}
        >
          Public holidays and official rest days automatically adjust based on your state.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <select
              value={state}
              onChange={(e) => setState(e.target.value as MalaysianState)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-primary)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '0.5rem 1.8rem 0.5rem 0.65rem',
                fontSize: '0.82rem',
                fontWeight: 900,
                color: 'var(--text-color)',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
                textTransform: 'uppercase',
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
                right: '0.6rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                fontSize: '0.65rem',
                fontWeight: 900,
              }}
            >
              ▼
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--weekend-bg)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.5rem 0.6rem',
              textAlign: 'center',
              fontSize: '0.74rem',
              fontWeight: 900,
              textTransform: 'uppercase',
            }}
          >
            {weekendType === 'SAT_SUN' ? 'SAT–SUN WEEKEND' : 'FRI–SAT WEEKEND'}
          </div>
        </div>
      </BrutalistCard>

      {/* 3. Statutory EA 1955 Presets */}
      <BrutalistCard headerColor="var(--accent-yellow)" title="2. STATUTORY HOLIDAY PRESET">
        <p
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            margin: '0 0 0.65rem 0',
          }}
        >
          Under <strong>Employment Act 1955 (Section 60D)</strong>, private employers are legally mandated to grant 11 public holidays. Select your tier:
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.4rem',
            marginBottom: '0.75rem',
          }}
        >
          {presets.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  backgroundColor: isSelected ? 'var(--accent-yellow)' : 'var(--bg-primary)',
                  color: 'var(--text-color)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.55rem 0.25rem',
                  cursor: 'pointer',
                  boxShadow: isSelected
                    ? '2px 2px 0px var(--border-color)'
                    : '1px 1px 0px var(--border-color)',
                  transition: 'all 0.08s ease',
                  userSelect: 'none',
                }}
              >
                <p.icon size={16} strokeWidth={2.5} />
                <span style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center' }}>
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Saturday Replacement Toggle */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
              Observe Saturday Cuti Ganti
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Replace Saturday holiday with next Monday off
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleSaturdayReplacements(!allowSaturdayReplacements)}
            style={{
              backgroundColor: allowSaturdayReplacements ? 'var(--accent-cyan)' : 'var(--bg-primary)',
              color: 'var(--text-color)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.35rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '1px 1px 0px var(--border-color)',
            }}
          >
            {allowSaturdayReplacements ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
      </BrutalistCard>

      {/* 4. Leave Quota & Calculation Settings */}
      <BrutalistCard headerColor="var(--accent-pink)" title="3. ANNUAL LEAVE BALANCE & THRESHOLD">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '0.85rem',
            alignItems: 'center',
          }}
        >
          {/* Total Quota */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '0.35rem',
              }}
            >
              Total AL Quota:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <button
                type="button"
                onClick={() => setAlBalance(Math.max(1, annualLeaveBalance - 1))}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontWeight: 900,
                  width: '32px',
                  height: '32px',
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
                  fontSize: '0.95rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.3rem',
                }}
              >
                {annualLeaveBalance} DAYS
              </div>
              <button
                type="button"
                onClick={() => setAlBalance(annualLeaveBalance + 1)}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontWeight: 900,
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Max AL per bridge */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}
              >
                Max AL / Break:
              </label>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  backgroundColor: 'var(--accent-yellow)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-pill)',
                  padding: '0.05rem 0.35rem',
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
        </div>
      </BrutalistCard>

      {/* 5. Granular Observed Holidays Checklist */}
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem',
          }}
        >
          <h3
            style={{
              fontSize: '0.95rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: 0,
            }}
          >
            Observed Holidays Checklist ({observedCount} / {applicableHolidays.length})
          </h3>
        </div>

        {/* Category Filters */}
        <div
          style={{
            display: 'flex',
            gap: '0.3rem',
            marginBottom: '0.75rem',
            overflowX: 'auto',
            paddingBottom: '0.2rem',
          }}
        >
          {(
            [
              { id: 'ALL', label: `All (${applicableHolidays.length})` },
              { id: 'COMPULSORY', label: `EA Mandated (${compulsoryHolidays.length})` },
              { id: 'FEDERAL', label: `Federal (${federalHolidays.length})` },
              { id: 'STATE', label: `State (${stateHolidays.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id)}
              style={{
                backgroundColor: categoryFilter === tab.id ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-pill)',
                padding: '0.3rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: categoryFilter === tab.id ? '2px 2px 0px var(--border-color)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List of Holidays */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredHolidays.map((holiday) => {
            const isObserved = observedHolidayIds.includes(holiday.id);
            const isCompulsory = holiday.isCompulsoryEA1955;
            const formattedDate = format(parseISO(holiday.date), 'd MMM (EEE)');

            return (
              <div
                key={holiday.id}
                onClick={() => {
                  if (!isCompulsory) {
                    toggleHoliday(holiday.id);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: isObserved ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                  opacity: isObserved ? 1 : 0.6,
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.65rem 0.75rem',
                  cursor: isCompulsory ? 'default' : 'pointer',
                  boxShadow: isObserved ? '2px 2px 0px var(--border-color)' : 'none',
                  transition: 'all 0.08s ease',
                }}
              >
                {/* Checkbox Icon */}
                <div style={{ flexShrink: 0 }}>
                  {isCompulsory ? (
                    <div
                      title="Compulsory under Employment Act 1955 (Cannot be untoggled)"
                      style={{
                        backgroundColor: 'var(--accent-yellow)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '3px',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Lock size={14} strokeWidth={2.5} color="var(--border-color)" />
                    </div>
                  ) : isObserved ? (
                    <div
                      style={{
                        backgroundColor: 'var(--accent-cyan)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '3px',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check size={14} strokeWidth={3} color="var(--border-color)" />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '3px',
                        backgroundColor: 'var(--bg-secondary)',
                      }}
                    />
                  )}
                </div>

                {/* Holiday Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      flexWrap: 'wrap',
                      marginBottom: '0.15rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 900,
                        color: 'var(--text-color)',
                      }}
                    >
                      {holiday.name}
                    </span>
                    {isCompulsory && (
                      <BrutalistBadge
                        color="var(--accent-yellow)"
                        style={{ fontSize: '0.62rem', padding: '0.05rem 0.35rem' }}
                      >
                        EA 1955 MANDATED
                      </BrutalistBadge>
                    )}
                    {holiday.category === 'STATE' && (
                      <BrutalistBadge
                        color="var(--accent-purple)"
                        style={{ fontSize: '0.62rem', padding: '0.05rem 0.35rem' }}
                      >
                        STATE
                      </BrutalistBadge>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      display: 'flex',
                      gap: '0.4rem',
                    }}
                  >
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span>{holiday.nameMs}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
