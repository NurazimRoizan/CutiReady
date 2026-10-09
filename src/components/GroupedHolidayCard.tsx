import { useState, useMemo } from 'react';
import { GroupedHoliday } from '../types';
import { BrutalistCard } from './BrutalistCard';
import { BrutalistBadge } from './BrutalistBadge';
import { BrutalistButton } from './BrutalistButton';
import { DayStripTile } from './DayStripTile';
import { generateBridgeICS, copyLeaveTextToClipboard } from '../utils/icsExport';
import { useLeaveStore } from '../store/useLeaveStore';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface GroupedHolidayCardProps {
  holiday: GroupedHoliday;
  isInitiallyExpanded?: boolean;
}

export function GroupedHolidayCard({
  holiday,
  isInitiallyExpanded = false,
}: GroupedHolidayCardProps) {
  const plannedLeaveDates = useLeaveStore((s) => s.plannedLeaveDates);
  const togglePlannedBridgeDates = useLeaveStore((s) => s.togglePlannedBridgeDates);
  const togglePlannedLeaveDate = useLeaveStore((s) => s.togglePlannedLeaveDate);

  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
  const [copied, setCopied] = useState(false);

  // Find if user already has a strategy in this holiday fully or partially locked
  const activePlannedStrategy = useMemo(() => {
    return holiday.strategies.find(
      (s) =>
        s.bridge.alDaysRequired > 0 &&
        s.bridge.annualLeaveDates.every((d) => plannedLeaveDates.includes(d))
    );
  }, [holiday.strategies, plannedLeaveDates]);

  // Default to the planned strategy if present, otherwise the recommended strategy, or the first one
  const defaultStrategyId = useMemo(() => {
    if (activePlannedStrategy) return activePlannedStrategy.id;
    const recommended = holiday.strategies.find((s) => s.isRecommended);
    return recommended ? recommended.id : holiday.strategies[0].id;
  }, [activePlannedStrategy, holiday.strategies]);

  const [selectedStrategyId, setSelectedStrategyId] = useState<string>(defaultStrategyId);

  // Current active strategy object
  const activeStrategy = useMemo(() => {
    return (
      holiday.strategies.find((s) => s.id === selectedStrategyId) ||
      holiday.strategies[0]
    );
  }, [holiday.strategies, selectedStrategyId]);

  const activeBridge = activeStrategy.bridge;

  // Check if current active strategy is fully planned
  const isStrategyFullyPlanned =
    activeBridge.alDaysRequired > 0 &&
    activeBridge.annualLeaveDates.every((d) => plannedLeaveDates.includes(d));

  const isStrategyPartiallyPlanned =
    activeBridge.alDaysRequired > 0 &&
    !isStrategyFullyPlanned &&
    activeBridge.annualLeaveDates.some((d) => plannedLeaveDates.includes(d));

  const handleTogglePlan = () => {
    if (activeBridge.alDaysRequired > 0) {
      togglePlannedBridgeDates(activeBridge.annualLeaveDates);
    }
  };

  const handleCopy = async () => {
    try {
      await copyLeaveTextToClipboard(activeBridge);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleExportICS = () => {
    generateBridgeICS(activeBridge);
  };

  return (
    <BrutalistCard
      headerColor={activePlannedStrategy ? 'var(--accent-green)' : 'var(--accent-yellow)'}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
          <Calendar size={14} strokeWidth={2.5} />
          <span>{holiday.title}</span>
        </div>
      }
      subtitle={`${holiday.holidayDatesFormatted} • ${holiday.quarter}`}
      headerAction={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {activePlannedStrategy && (
            <BrutalistBadge color="var(--bg-primary)">
              🔒 DAH LOCK
            </BrutalistBadge>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Tutup butiran cuti' : 'Buka pilihan strategi'}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1.5px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.2rem 0.45rem',
              fontSize: '0.68rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '1px 1px 0px var(--border-color)',
              color: 'var(--text-color)',
            }}
          >
            <span>{holiday.strategies.length} STRATEGI</span>
            {isExpanded ? <ChevronUp size={12} strokeWidth={3} /> : <ChevronDown size={12} strokeWidth={3} />}
          </button>
        </div>
      }
      style={{ marginBottom: '1.15rem' }}
    >
      {/* 1. Collapsed State: Fast Skim Mode */}
      {!isExpanded ? (
        <div
          onClick={() => setIsExpanded(true)}
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div
              style={{
                fontSize: '0.88rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.2px',
                color: 'var(--text-color)',
              }}
            >
              {holiday.strategies.length > 1
                ? `${holiday.strategies.length} Pilihan Strategi • Sehingga ${holiday.maxDaysOff} Hari Lepak`
                : `${holiday.maxDaysOff} Hari Lepak • ${activeStrategy.label}`}
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
              }}
            >
              {activePlannedStrategy
                ? `🔒 Sedang lock: ${activePlannedStrategy.label}`
                : activeStrategy.description}
            </div>
          </div>

          <BrutalistButton
            size="sm"
            color="var(--accent-yellow)"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 900,
            }}
          >
            PILIH STRATEGI ▾
          </BrutalistButton>
        </div>
      ) : (
        /* 2. Expanded State: Full Strategy Switcher & Interactive Day Strip */
        <div>
          {/* Strategy Selector Pills Bar */}
          {holiday.strategies.length > 1 && (
            <div style={{ marginBottom: '0.85rem' }}>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  color: 'var(--text-muted)',
                  marginBottom: '0.35rem',
                }}
              >
                PILIH CARA CUTI (STRATEGI):
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '0.35rem',
                  flexWrap: 'wrap',
                }}
              >
                {holiday.strategies.map((strat) => {
                  const isSelected = strat.id === activeStrategy.id;
                  const isStratPlanned =
                    strat.bridge.alDaysRequired > 0 &&
                    strat.bridge.annualLeaveDates.every((d) => plannedLeaveDates.includes(d));

                  return (
                    <button
                      key={strat.id}
                      type="button"
                      onClick={() => setSelectedStrategyId(strat.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        backgroundColor: isSelected
                          ? 'var(--accent-yellow)'
                          : isStratPlanned
                          ? 'var(--accent-green)'
                          : 'var(--bg-primary)',
                        color: 'var(--text-color)',
                        border: isSelected
                          ? '2.5px solid var(--border-color)'
                          : '1.5px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        padding: '0.3rem 0.55rem',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        boxShadow: isSelected
                          ? '2px 2px 0px var(--border-color)'
                          : '1px 1px 0px var(--border-color)',
                        transition: 'transform 0.08s ease, box-shadow 0.08s ease',
                      }}
                    >
                      <span>{strat.label}</span>
                      {strat.isRecommended && !isStratPlanned && (
                        <span
                          style={{
                            fontSize: '0.58rem',
                            backgroundColor: 'var(--accent-pink)',
                            color: 'var(--accent-pink-text)',
                            padding: '0.1rem 0.3rem',
                            borderRadius: 'var(--border-radius-pill)',
                            fontWeight: 800,
                            lineHeight: 1,
                          }}
                        >
                          DISYORKAN
                        </span>
                      )}
                      {isStratPlanned && <span>🔒</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strategy Details Sub-Header */}
          <div
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1.5px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.55rem 0.65rem',
              marginBottom: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.45rem',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                }}
              >
                {activeBridge.startDate} – {activeBridge.endDate}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                }}
              >
                {activeStrategy.description}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              <BrutalistBadge color="var(--bg-secondary)">
                {activeBridge.totalDaysOff} HARI OFF
              </BrutalistBadge>

              {activeBridge.alDaysRequired === 0 ? (
                <BrutalistBadge color="var(--accent-cyan)">
                  ⚡ 0 AL • FREE
                </BrutalistBadge>
              ) : activeBridge.roiMultiplier >= 4 ? (
                <BrutalistBadge color="var(--accent-green)">
                  🔥 {activeBridge.roiMultiplier}x ROI
                </BrutalistBadge>
              ) : (
                <BrutalistBadge color="var(--accent-pink)">
                  {activeBridge.alDaysRequired} AL ({activeBridge.roiMultiplier}x)
                </BrutalistBadge>
              )}
            </div>
          </div>

          {/* Visual Day Strip */}
          <div style={{ marginBottom: '0.85rem' }}>
            <div
              style={{
                display: 'flex',
                gap: '0.35rem',
                overflowX: 'auto',
                paddingBottom: '0.4rem',
                paddingTop: '0.1rem',
                scrollbarWidth: 'thin',
              }}
            >
              {activeBridge.days.map((day) => {
                const isDayPlanned = plannedLeaveDates.includes(day.date);
                return (
                  <DayStripTile
                    key={day.date}
                    day={day}
                    isPlanned={isDayPlanned}
                    onTogglePlanned={() => togglePlannedLeaveDate(day.date)}
                  />
                );
              })}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                activeBridge.alDaysRequired > 0
                  ? 'repeat(3, minmax(0, 1fr))'
                  : 'repeat(2, minmax(0, 1fr))',
              gap: '0.35rem',
              paddingTop: '0.65rem',
              borderTop: '1px solid var(--border-subtle)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {activeBridge.alDaysRequired > 0 && (
              <BrutalistButton
                size="sm"
                onClick={handleTogglePlan}
                color={
                  isStrategyFullyPlanned
                    ? 'var(--accent-green)'
                    : isStrategyPartiallyPlanned
                    ? 'var(--accent-orange)'
                    : 'var(--accent-yellow)'
                }
                style={{
                  padding: '0.35rem 0.15rem',
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1.15,
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.74rem', fontWeight: 900 }}>
                    {isStrategyFullyPlanned
                      ? 'DAH LOCK'
                      : isStrategyPartiallyPlanned
                      ? '+ SAMBUNG'
                      : '+ LOCK'}
                  </span>
                  <span style={{ fontSize: '0.66rem', fontWeight: 800 }}>
                    {isStrategyFullyPlanned
                      ? `(${activeBridge.alDaysRequired}H AL)`
                      : 'STRATEGI'}
                  </span>
                </div>
              </BrutalistButton>
            )}

            <BrutalistButton
              size="sm"
              onClick={handleExportICS}
              color="var(--bg-primary)"
              style={{
                padding: '0.35rem 0.15rem',
                width: '100%',
                minWidth: 0,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1.15,
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '0.74rem', fontWeight: 900 }}>EXPORT</span>
                <span style={{ fontSize: '0.66rem', fontWeight: 800 }}>.ICS</span>
              </div>
            </BrutalistButton>

            <BrutalistButton
              size="sm"
              onClick={handleCopy}
              color={copied ? 'var(--accent-green)' : 'var(--bg-secondary)'}
              style={{
                padding: '0.35rem 0.15rem',
                width: '100%',
                minWidth: 0,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1.15,
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '0.74rem', fontWeight: 900 }}>
                  {copied ? 'DISALIN!' : 'SALIN'}
                </span>
                <span style={{ fontSize: '0.66rem', fontWeight: 800 }}>TEKS</span>
              </div>
            </BrutalistButton>
          </div>
        </div>
      )}
    </BrutalistCard>
  );
}
