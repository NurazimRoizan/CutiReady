import { useState, useMemo } from 'react';
import { useLeaveStore } from '../store/useLeaveStore';
import { getTranslations } from '../i18n/translations';
import { BridgeOpportunity, STATE_NAMES } from '../types';
import { SummaryStats } from '../components/SummaryStats';
import { BridgeCard } from '../components/BridgeCard';
import { BrutalistCard } from '../components/BrutalistCard';
import { BrutalistButton } from '../components/BrutalistButton';
import { BrutalistBadge } from '../components/BrutalistBadge';
import { generateFullPlanICS, copyFullPlanToClipboard } from '../utils/icsExport';
import {
  CalendarPlus,
  CalendarCheck,
  Trash2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface MyPlanViewProps {
  bridges: BridgeOpportunity[];
  onGoToBridges: () => void;
}

export function MyPlanView({ bridges, onGoToBridges }: MyPlanViewProps) {
  const {
    state,
    annualLeaveBalance,
    plannedLeaveDates,
    clearAllPlannedLeave,
    language,
  } = useLeaveStore();

  const t = getTranslations(language);
  const [copied, setCopied] = useState(false);

  // Only display bridges whose AL dates are fully locked, picking the most complete bridge if nested
  const plannedBridges = useMemo(() => {
    const exactMatches = bridges.filter(
      (b) =>
        b.alDaysRequired > 0 &&
        b.annualLeaveDates.every((d) => plannedLeaveDates.includes(d))
    );

    return exactMatches.filter(
      (b, _, self) =>
        !self.some(
          (other) =>
            other.id !== b.id &&
            other.totalDaysOff > b.totalDaysOff &&
            b.annualLeaveDates.every((d) => other.annualLeaveDates.includes(d))
        )
    );
  }, [bridges, plannedLeaveDates]);

  const remainingAl = Math.max(0, annualLeaveBalance - plannedLeaveDates.length);
  const stateLabel = STATE_NAMES[state] || state;

  const handleExportAll = () => {
    generateFullPlanICS(plannedBridges, stateLabel);
  };

  const handleCopySummary = async () => {
    try {
      await copyFullPlanToClipboard(plannedBridges, stateLabel);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleClearAll = () => {
    if (window.confirm(t.plan.clearConfirm)) {
      clearAllPlannedLeave();
    }
  };

  return (
    <div>
      {/* 1. Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <CalendarCheck size={22} strokeWidth={2.5} color="var(--text-color)" />
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.5px',
              margin: 0,
            }}
          >
            {t.plan.title}
          </h2>
        </div>

        <BrutalistBadge
          color={remainingAl > 3 ? 'var(--accent-cyan)' : 'var(--accent-pink)'}
        >
          {remainingAl} / {annualLeaveBalance} {t.plan.alBalanceSuffix}
        </BrutalistBadge>
      </div>

      {/* 2. Top Metric Cards */}
      <SummaryStats bridges={bridges} plannedLeaveDates={plannedLeaveDates} />

      {/* 3. Action Toolbar (if plan exists) */}
      {plannedBridges.length > 0 ? (
        <>
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: 'var(--border-width) solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '0.85rem',
              boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
              marginBottom: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {t.plan.actions} ({plannedBridges.length} {t.plan.lockedCount})
              </span>

              <button
                type="button"
                onClick={handleClearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <Trash2 size={12} />
                {t.plan.clearAll}
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '0.5rem',
              }}
            >
              <BrutalistButton
                size="sm"
                color="var(--accent-yellow)"
                onClick={handleExportAll}
                style={{ width: '100%', fontSize: '0.82rem', padding: '0.6rem 0.4rem' }}
              >
                <span>{t.plan.exportIcs}</span>
              </BrutalistButton>

              <BrutalistButton
                size="sm"
                color={copied ? 'var(--accent-green)' : 'var(--bg-primary)'}
                onClick={handleCopySummary}
                style={{ width: '100%', fontSize: '0.82rem', padding: '0.6rem 0.4rem' }}
              >
                <span>{copied ? t.plan.copied : t.plan.copyBoss}</span>
              </BrutalistButton>
            </div>
          </div>

          {/* 4. Planned Bridges Cards */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {t.plan.lockedInCalendar}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }}
              >
                {plannedLeaveDates.length} {t.plan.alDaysUsed}
              </span>
            </div>

            {plannedBridges.map((bridge) => (
              <BridgeCard key={bridge.id} bridge={bridge} />
            ))}
          </div>
        </>
      ) : (
        /* Empty State */
        <BrutalistCard
          headerColor="var(--accent-yellow)"
          title={t.plan.emptyHeader}
        >
          <div style={{ textAlign: 'center', padding: '1.25rem 0.5rem' }}>
            <CalendarPlus
              size={48}
              style={{
                margin: '0 auto 0.85rem auto',
                color: 'var(--text-color)',
                opacity: 0.85,
              }}
            />
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                margin: '0 0 0.5rem 0',
              }}
            >
              {t.plan.emptyTitle}
            </h3>
            <p
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                lineHeight: 1.45,
                margin: '0 auto 1.5rem auto',
                maxWidth: '420px',
              }}
            >
              {t.plan.emptyDesc}
            </p>

            <BrutalistButton
              color="var(--accent-yellow)"
              onClick={onGoToBridges}
              style={{
                fontSize: '0.95rem',
                padding: '0.85rem 1.5rem',
                display: 'inline-flex',
              }}
            >
              <Sparkles size={16} />
              <span>{t.plan.emptyCta}</span>
              <ArrowRight size={16} />
            </BrutalistButton>
          </div>
        </BrutalistCard>
      )}
    </div>
  );
}
