import { useState } from 'react';
import { useLeaveStore } from '../store/useLeaveStore';
import { DEFAULT_HOLIDAYS_2026 } from '../data/holidays';
import { BrutalistButton } from './BrutalistButton';
import { BrutalistBadge } from './BrutalistBadge';
import { format, parseISO } from 'date-fns';
import { X, Check, Lock, Info, Sparkles } from 'lucide-react';

interface HolidayConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HolidayConfigDrawer({ isOpen, onClose }: HolidayConfigDrawerProps) {
  const {
    state,
    observedHolidayIds,
    toggleHoliday,
    applyPreset,
    activePreset,
    allowSaturdayReplacements,
    toggleSaturdayReplacements,
    weekendType,
  } = useLeaveStore();

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'COMPULSORY' | 'FEDERAL' | 'STATE'>('ALL');

  if (!isOpen) return null;

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

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '88vh',
          backgroundColor: 'var(--bg-secondary)',
          border: 'var(--border-width-thick) solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '6px 6px 0px var(--border-color)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: 'var(--accent-yellow)',
            color: 'var(--accent-yellow-text)',
            borderBottom: 'var(--border-width) solid var(--border-color)',
            padding: '0.85rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.05rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                margin: 0,
                letterSpacing: '0.5px',
              }}
            >
              COMPANY HOLIDAY POLICY
            </h2>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                opacity: 0.85,
              }}
            >
              Observing {observedCount} / {applicableHolidays.length} Holidays in {state}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.35rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '2px 2px 0px var(--border-color)',
            }}
          >
            <X size={18} strokeWidth={3} color="var(--border-color)" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            padding: '1rem',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {/* Statutory EA 1955 Guidance Banner */}
          <div
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '0.65rem 0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-start',
            }}
          >
            <Info size={16} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.4 }}>
              <strong>Employment Act 1955 (Section 60D):</strong> Private employers must grant at least 11 paid gazetted holidays (5 compulsory + 6 chosen by employer).
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div style={{ marginBottom: '1rem' }}>
            <span
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '0.4rem',
              }}
            >
              Quick Presets:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
              <BrutalistButton
                size="sm"
                color={activePreset === 'MINIMUM_11' ? 'var(--accent-yellow)' : 'var(--bg-primary)'}
                onClick={() => applyPreset('MINIMUM_11')}
              >
                EA 11 DAYS
              </BrutalistButton>
              <BrutalistButton
                size="sm"
                color={activePreset === 'CORPORATE_15' ? 'var(--accent-yellow)' : 'var(--bg-primary)'}
                onClick={() => applyPreset('CORPORATE_15')}
              >
                CORP 15D
              </BrutalistButton>
              <BrutalistButton
                size="sm"
                color={activePreset === 'ALL' ? 'var(--accent-yellow)' : 'var(--bg-primary)'}
                onClick={() => applyPreset('ALL')}
              >
                ALL ({applicableHolidays.length})
              </BrutalistButton>
            </div>
          </div>

          {/* Saturday Replacement Toggle */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '0.75rem',
              boxShadow: '2px 2px 0px var(--border-color)',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                {weekendType === 'SAT_SUN' ? 'Saturday' : 'Friday'} Replacement (Cuti Ganti)
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Roll off-day clashes to next working day (company policy option)
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleSaturdayReplacements(!allowSaturdayReplacements)}
              style={{
                backgroundColor: allowSaturdayReplacements ? 'var(--accent-green)' : 'var(--border-subtle)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-pill)',
                width: '46px',
                height: '26px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: allowSaturdayReplacements ? '22px' : '2px',
                  transition: 'left 0.15s ease',
                }}
              />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.75rem', overflowX: 'auto' }}>
            <BrutalistBadge
              color={categoryFilter === 'ALL' ? 'var(--accent-yellow)' : 'var(--bg-primary)'}
              style={{ cursor: 'pointer' }}
              onClick={() => setCategoryFilter('ALL')}
            >
              ALL ({applicableHolidays.length})
            </BrutalistBadge>
            <BrutalistBadge
              color={categoryFilter === 'COMPULSORY' ? 'var(--accent-pink)' : 'var(--bg-primary)'}
              style={{ cursor: 'pointer' }}
              onClick={() => setCategoryFilter('COMPULSORY')}
            >
              EA 1955 ({compulsoryHolidays.length})
            </BrutalistBadge>
            <BrutalistBadge
              color={categoryFilter === 'FEDERAL' ? 'var(--accent-cyan)' : 'var(--bg-primary)'}
              style={{ cursor: 'pointer' }}
              onClick={() => setCategoryFilter('FEDERAL')}
            >
              FEDERAL ({federalHolidays.length})
            </BrutalistBadge>
            <BrutalistBadge
              color={categoryFilter === 'STATE' ? 'var(--accent-green)' : 'var(--bg-primary)'}
              style={{ cursor: 'pointer' }}
              onClick={() => setCategoryFilter('STATE')}
            >
              STATE ({stateHolidays.length})
            </BrutalistBadge>
          </div>

          {/* Holiday List Checkboxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {filteredHolidays.map((holiday) => {
              const isObserved = observedHolidayIds.includes(holiday.id);
              const dateFormatted = format(parseISO(holiday.date), 'EEE, d MMM yyyy');

              return (
                <div
                  key={holiday.id}
                  onClick={() => toggleHoliday(holiday.id)}
                  style={{
                    backgroundColor: isObserved ? 'var(--bg-secondary)' : 'var(--workday-bg)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.6rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    opacity: isObserved ? 1 : 0.6,
                    boxShadow: isObserved ? '2px 2px 0px var(--border-color)' : 'none',
                    transition: 'all 0.08s ease',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                        }}
                      >
                        {holiday.name}
                      </span>
                      {holiday.isCompulsoryEA1955 && (
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 900,
                            backgroundColor: 'var(--accent-pink)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--border-radius-pill)',
                            padding: '0.05rem 0.35rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                          }}
                        >
                          <Lock size={9} strokeWidth={3} />
                          EA COMPULSORY
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        marginTop: '0.1rem',
                      }}
                    >
                      {holiday.nameMs} • <strong>{dateFormatted}</strong>
                    </div>
                  </div>

                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: '2px solid var(--border-color)',
                      backgroundColor: isObserved ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isObserved && <Check size={16} strokeWidth={3} color="var(--border-color)" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderTop: 'var(--border-width) solid var(--border-color)',
            padding: '0.75rem 1rem',
          }}
        >
          <BrutalistButton onClick={onClose} style={{ width: '100%' }}>
            <Sparkles size={16} strokeWidth={2.5} />
            <span>SAVE POLICY & UPDATE BRIDGES</span>
          </BrutalistButton>
        </div>
      </div>
    </div>
  );
}
