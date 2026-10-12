import { useState, memo } from 'react';
import { format, parseISO } from 'date-fns';
import { BridgeOpportunity } from '../types';
import { BrutalistCard } from './BrutalistCard';
import { BrutalistBadge } from './BrutalistBadge';
import { BrutalistButton } from './BrutalistButton';
import { DayStripTile } from './DayStripTile';
import { generateBridgeICS, copyLeaveTextToClipboard } from '../utils/icsExport';
import { useLeaveStore } from '../store/useLeaveStore';
import { Zap } from 'lucide-react';

interface BridgeCardProps {
  bridge: BridgeOpportunity;
}

function BridgeCardComponent({ bridge }: BridgeCardProps) {
  const plannedLeaveDates = useLeaveStore((s) => s.plannedLeaveDates);
  const togglePlannedBridgeDates = useLeaveStore((s) => s.togglePlannedBridgeDates);
  const togglePlannedLeaveDate = useLeaveStore((s) => s.togglePlannedLeaveDate);
  const language = useLeaveStore((s) => s.language);
  const isEn = language === 'en';

  const [copied, setCopied] = useState(false);

  const startFormatted = format(parseISO(bridge.startDate), 'd MMM');
  const endFormatted = format(parseISO(bridge.endDate), 'd MMM yyyy');

  // Check if all AL days for this bridge are already planned
  const isFullyPlanned =
    bridge.alDaysRequired > 0 &&
    bridge.annualLeaveDates.every((d) => plannedLeaveDates.includes(d));

  const isPartiallyPlanned =
    bridge.alDaysRequired > 0 &&
    !isFullyPlanned &&
    bridge.annualLeaveDates.some((d) => plannedLeaveDates.includes(d));

  const handleCopy = async () => {
    try {
      await copyLeaveTextToClipboard(bridge, language);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleTogglePlan = () => {
    if (bridge.alDaysRequired > 0) {
      togglePlannedBridgeDates(bridge.annualLeaveDates);
    }
  };

  // Consistent signature yellow header banner to avoid clashing with day-strip calendar tiles
  const headerColor = 'var(--accent-yellow)';
  let headerBadgeText = isEn ? 'STANDARD' : 'STANDARD';
  if (bridge.alDaysRequired === 0) {
    headerBadgeText = isEn ? '⚡ FREE LEAVE (0 AL)' : '⚡ FREE CUTI (0 AL)';
  } else if (bridge.roiMultiplier >= 4) {
    headerBadgeText = isEn ? `🔥 HIGH ROI (${bridge.roiMultiplier}x)` : `🔥 PADU GILA (${bridge.roiMultiplier}x ROI)`;
  }

  return (
    <BrutalistCard
      headerColor={headerColor}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {bridge.alDaysRequired === 0 && <Zap size={14} strokeWidth={3} />}
          <span>{bridge.title}</span>
        </div>
      }
      subtitle={`${headerBadgeText} • ${bridge.quarter}`}
      style={{ marginBottom: '1.15rem' }}
    >
      {/* 1. Dates and Badges Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '0.75rem',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '1.1rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.3px',
              lineHeight: 1.2,
            }}
          >
            {startFormatted} – {endFormatted}
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            {isEn
              ? `${bridge.totalDaysOff} Consecutive Days Off Work`
              : `${bridge.totalDaysOff} Hari Lepak Tanpa Masuk Kerja`}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          <BrutalistBadge color="var(--bg-primary)">
            {bridge.totalDaysOff} {isEn ? 'DAYS OFF' : 'HARI OFF'}
          </BrutalistBadge>

          {bridge.alDaysRequired === 0 ? (
            <BrutalistBadge color="var(--accent-cyan)">
              ⚡ 0 AL • {isEn ? 'FREE LEAVE' : 'FREE CUTI'}
            </BrutalistBadge>
          ) : bridge.roiMultiplier >= 4 ? (
            <>
              <BrutalistBadge color="var(--accent-green)">
                🔥 {bridge.roiMultiplier}x ROI
              </BrutalistBadge>
              <BrutalistBadge color="var(--accent-pink)">
                {isEn ? `APPLY ${bridge.alDaysRequired} AL ONLY` : `BURN ${bridge.alDaysRequired} AL JE`}
              </BrutalistBadge>
            </>
          ) : (
            <BrutalistBadge color="var(--accent-pink)">
              {isEn ? `APPLY ${bridge.alDaysRequired} AL (${bridge.roiMultiplier}x)` : `BURN ${bridge.alDaysRequired} AL (${bridge.roiMultiplier}x)`}
            </BrutalistBadge>
          )}
        </div>
      </div>

      {/* 2. Visual Day Strip */}
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
          {bridge.days.map((day) => {
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

      {/* 3. Action Buttons Row (Always 2 rows of text per button to prevent overflow) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            bridge.alDaysRequired > 0 ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
          gap: '0.35rem',
          paddingTop: '0.65rem',
          borderTop: '1px solid var(--border-subtle)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {bridge.alDaysRequired > 0 && (
          <BrutalistButton
            size="sm"
            onClick={handleTogglePlan}
            color={
              isFullyPlanned
                ? 'var(--accent-green)'
                : isPartiallyPlanned
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
                {isFullyPlanned ? (isEn ? 'LOCKED' : 'DAH LOCK') : isPartiallyPlanned ? (isEn ? '+ EXTEND' : '+ SAMBUNG') : '+ LOCK'}
              </span>
              <span style={{ fontSize: '0.66rem', fontWeight: 800 }}>
                {isFullyPlanned ? (isEn ? `(${bridge.alDaysRequired}d AL)` : `(${bridge.alDaysRequired}H AL)`) : (isEn ? 'LEAVE' : 'CUTI')}
              </span>
            </div>
          </BrutalistButton>
        )}

        <BrutalistButton
          size="sm"
          onClick={() => generateBridgeICS(bridge)}
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
              {copied ? (isEn ? 'COPIED' : 'DAH') : 'COPY'}
            </span>
            <span style={{ fontSize: '0.66rem', fontWeight: 800 }}>
              {copied ? '!' : (isEn ? 'MSG' : 'AYAT')}
            </span>
          </div>
        </BrutalistButton>
      </div>
    </BrutalistCard>
  );
}

export const BridgeCard = memo(BridgeCardComponent);

