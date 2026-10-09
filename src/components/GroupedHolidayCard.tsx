import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
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

  // Format bridge date range nicely: "07 – 15 Nov 2026"
  const bridgeDateRangeFormatted = useMemo(() => {
    const start = parseISO(activeBridge.startDate);
    const end = parseISO(activeBridge.endDate);
    const startMonth = format(start, 'MMM');
    const endMonth = format(end, 'MMM');
    const startYear = format(start, 'yyyy');
    const endYear = format(end, 'yyyy');

    if (startMonth === endMonth && startYear === endYear) {
      return `${format(start, 'dd')} – ${format(end, 'dd')} ${endMonth} ${endYear}`;
    }
    return `${format(start, 'dd MMM')} – ${format(end, 'dd MMM')} ${endYear}`;
  }, [activeBridge.startDate, activeBridge.endDate]);

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
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.15rem',
            cursor: 'pointer',
            minWidth: 0,
            width: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Row 1: Holiday Title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.92rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.2px',
              lineHeight: 1.2,
              color: 'var(--text-color)',
              minWidth: 0,
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <Calendar size={14} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <span
              style={{
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
                flex: 1,
              }}
            >
              {holiday.title}
            </span>
          </div>

          {/* Row 2: Date (e.g. 8 - 9 Nov 2026) */}
          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.2px',
              lineHeight: 1.15,
              color: 'var(--text-color)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {holiday.holidayDatesFormatted}
          </div>

          {/* Row 3: Day Names & Quarter (e.g. Ahad - Isnin • Q4) */}
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.2px',
              lineHeight: 1.15,
              color: 'var(--text-color)',
              opacity: 0.85,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {holiday.holidayDaysFormatted} • {holiday.quarter}
          </div>
        </div>
      }
      headerAction={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0, marginLeft: '0.35rem' }}>
          {activePlannedStrategy && (
            <BrutalistBadge color="var(--bg-primary)">
              LOCK
            </BrutalistBadge>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Close detail' : 'Tengok cara cuti'}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.25rem 0.5rem',
              fontSize: '0.68rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              boxShadow: '1.5px 1.5px 0px var(--border-color)',
              color: 'var(--text-color)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <span>{holiday.strategies.length} CARA</span>
            {isExpanded ? (
              <ChevronUp size={13} strokeWidth={3} />
            ) : (
              <ChevronDown size={13} strokeWidth={3} />
            )}
          </button>
        </div>
      }
      style={{ marginBottom: '1.15rem' }}
    >
      {/* 1. Collapsed State: Fast-Skim Mobile Summary */}
      {!isExpanded ? (
        <div
          onClick={() => setIsExpanded(true)}
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.55rem',
          }}
        >
          {/* Top highlight row: Max days off & ROI badge */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <span
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: 'var(--text-color)',
                  lineHeight: 1,
                  letterSpacing: '-0.3px',
                }}
              >
                {holiday.maxDaysOff} HARI OFF
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }}
              >
                ({holiday.bestRoi >= 10 ? 'FREE CUTI' : `${holiday.bestRoi}x ROI`})
              </span>
            </div>

            <BrutalistBadge color={activePlannedStrategy ? 'var(--accent-green)' : 'var(--bg-primary)'}>
              {activePlannedStrategy ? 'DAH LOCK' : `${holiday.strategies.length} PILIHAN`}
            </BrutalistBadge>
          </div>

          {/* Strategy Chips Preview - Concise & Emoji-Free */}
          <div
            style={{
              display: 'flex',
              gap: '0.3rem',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {holiday.strategies.map((strat) => {
              const isStratPlanned =
                strat.bridge.alDaysRequired > 0 &&
                strat.bridge.annualLeaveDates.every((d) => plannedLeaveDates.includes(d));

              return (
                <span
                  key={strat.id}
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.45rem',
                    borderRadius: 'var(--border-radius-sm)',
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: isStratPlanned
                      ? 'var(--accent-green)'
                      : strat.type === 'ZERO_AL'
                      ? 'var(--accent-cyan)'
                      : 'var(--bg-primary)',
                    color: 'var(--text-color)',
                    boxShadow: '1px 1px 0px var(--border-color)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  {isStratPlanned && '✓ '}
                  {strat.label}
                </span>
              );
            })}
          </div>

          {/* Full-width tactile action button */}
          <div
            style={{
              backgroundColor: 'var(--accent-yellow)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.45rem',
              boxShadow: '2px 2px 0px var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              color: 'var(--accent-yellow-text)',
              marginTop: '0.15rem',
              userSelect: 'none',
            }}
          >
            <span>PILIH CARA CUTI</span>
            <ChevronDown size={14} strokeWidth={3} />
          </div>
        </div>
      ) : (
        /* 2. Expanded State: Full Strategy Switcher & Interactive Day Strip */
        <div>
          {/* Strategy Selector Horizontal Grid/Row (Concise badges that fit horizontally) */}
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
                CARA HACK CUTI NI:
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    holiday.strategies.length === 2
                      ? 'repeat(2, minmax(0, 1fr))'
                      : holiday.strategies.length === 3
                      ? 'repeat(3, minmax(0, 1fr))'
                      : 'repeat(2, minmax(0, 1fr))',
                  gap: '0.35rem',
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
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
                        padding: '0.4rem 0.25rem',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        cursor: 'pointer',
                        boxShadow: isSelected
                          ? '2px 2px 0px var(--border-color)'
                          : '1px 1px 0px var(--border-color)',
                        transition: 'transform 0.08s ease, box-shadow 0.08s ease',
                      }}
                    >
                      <span>{strat.label}</span>
                      {isStratPlanned && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strategy Details Sub-Header with Readable Date Format ("07 – 15 Nov 2026") */}
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
                  fontSize: '0.94rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                }}
              >
                {bridgeDateRangeFormatted}
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
                  0 AL • FREE
                </BrutalistBadge>
              ) : activeBridge.roiMultiplier >= 4 ? (
                <BrutalistBadge color="var(--accent-green)">
                  {activeBridge.roiMultiplier}x ROI
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
                  {copied ? 'DAH COPY!' : 'COPY'}
                </span>
                <span style={{ fontSize: '0.66rem', fontWeight: 800 }}>AYAT</span>
              </div>
            </BrutalistButton>
          </div>

          {/* Close Details Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            style={{
              marginTop: '0.65rem',
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              border: '1.5px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.35rem',
              fontSize: '0.68rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              boxShadow: '1px 1px 0px var(--border-color)',
              color: 'var(--text-muted)',
            }}
          >
            <span>CLOSE DETAIL</span>
            <ChevronUp size={12} strokeWidth={3} />
          </button>
        </div>
      )}
    </BrutalistCard>
  );
}
