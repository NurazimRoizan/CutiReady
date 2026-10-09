import { useState, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { useLeaveStore } from '../store/useLeaveStore';
import { HeroSection } from '../components/HeroSection';
import { FilterTabs } from '../components/FilterTabs';
import { GroupedHolidayCard } from '../components/GroupedHolidayCard';
import { BrutalistCard } from '../components/BrutalistCard';
import { BrutalistButton } from '../components/BrutalistButton';
import { LegendModal } from '../components/LegendModal';
import { FilterTabType, BridgeOpportunity, CalendarDay, GroupedHoliday } from '../types';
import { groupBridgesByHoliday } from '../engine/calendarEngine';
import { Sun, Palette, ChevronDown, ChevronUp } from 'lucide-react';

interface BridgesViewProps {
  bridges: BridgeOpportunity[];
  calendar: CalendarDay[];
  onOpenHowToUse: () => void;
  onGoToPlan: () => void;
  onGoToRules: () => void;
}

export function BridgesView({
  bridges,
  calendar,
  onOpenHowToUse,
  onGoToPlan,
  onGoToRules,
}: BridgesViewProps) {
  const {
    annualLeaveBalance,
    plannedLeaveDates,
    maxAlPerBridge,
    setMaxAlPerBridge,
    observedHolidayIds,
    weekendType,
    hidePastHolidays,
    toggleHidePastHolidays,
  } = useLeaveStore();

  const [activeTab, setActiveTab] = useState<FilterTabType>('ALL');
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [expandAll, setExpandAll] = useState(false);
  const bridgesListRef = useRef<HTMLDivElement>(null);

  const remainingAl = Math.max(0, annualLeaveBalance - plannedLeaveDates.length);

  const todayStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  // Group bridge opportunities by distinct holiday event
  const groupedHolidays = useMemo(() => {
    return groupBridgesByHoliday(bridges, calendar);
  }, [bridges, calendar]);

  // Count past holiday events (ended before today)
  const pastHolidaysCount = useMemo(() => {
    return groupedHolidays.filter((h) => h.endDate < todayStr).length;
  }, [groupedHolidays, todayStr]);

  // Base list of holiday events filtered by hidePastHolidays
  const baseHolidays = useMemo(() => {
    if (hidePastHolidays) {
      const upcoming = groupedHolidays.filter((h) => h.endDate >= todayStr);
      return upcoming.length > 0 ? upcoming : groupedHolidays;
    }
    return groupedHolidays;
  }, [groupedHolidays, hidePastHolidays, todayStr]);

  const handleScrollToBridges = () => {
    bridgesListRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Compute tab counts based on baseHolidays
  const tabCounts = useMemo(() => {
    const counts: Record<FilterTabType, number> = {
      ALL: baseHolidays.length,
      HIGH_ROI: baseHolidays.filter((h) => h.bestRoi >= 3).length,
      ZERO_AL: baseHolidays.filter((h) => h.strategies.some((s) => s.type === 'ZERO_AL')).length,
      Q1: baseHolidays.filter((h) => h.quarter === 'Q1').length,
      Q2: baseHolidays.filter((h) => h.quarter === 'Q2').length,
      Q3: baseHolidays.filter((h) => h.quarter === 'Q3').length,
      Q4: baseHolidays.filter((h) => h.quarter === 'Q4').length,
    };
    return counts;
  }, [baseHolidays]);

  // Filter holidays according to active tab
  const filteredHolidays = useMemo(() => {
    if (activeTab === 'ALL') return baseHolidays;
    if (activeTab === 'HIGH_ROI') return baseHolidays.filter((h) => h.bestRoi >= 3);
    if (activeTab === 'ZERO_AL')
      return baseHolidays.filter((h) => h.strategies.some((s) => s.type === 'ZERO_AL'));
    return baseHolidays.filter((h) => h.quarter === activeTab);
  }, [baseHolidays, activeTab]);

  return (
    <div>
      {/* 1. Hero Section & Quick AL Quota Picker */}
      <HeroSection
        onScrollToPlanner={handleScrollToBridges}
        onToggleHowToUse={onOpenHowToUse}
        isHowToUseOpen={false}
      />

      {/* 2. Structured Leave Status & Controls Bar */}
      <div
        ref={bridgesListRef}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: 'var(--border-width) solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
          padding: '0.65rem 0.75rem',
          marginBottom: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {/* Top: 2 High-Contrast Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
          {/* Metric 1: AL Balance */}
          <div
            style={{
              backgroundColor: remainingAl > 3 ? 'var(--accent-cyan)' : 'var(--accent-pink)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.45rem 0.55rem',
              boxShadow: '1.5px 1.5px 0px var(--border-color)',
            }}
          >
            <div
              style={{
                fontSize: '0.62rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                color: 'var(--text-color)',
              }}
            >
              BAKI AL SEMASA
            </div>
            <div
              style={{
                fontSize: '1.1rem',
                fontWeight: 900,
                lineHeight: 1.1,
                marginTop: '0.15rem',
                color: 'var(--text-color)',
              }}
            >
              {remainingAl} / {annualLeaveBalance}{' '}
              <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>HARI</span>
            </div>
          </div>

          {/* Metric 2: Locked Cuti (or Observed Rules) */}
          <div
            onClick={plannedLeaveDates.length > 0 ? onGoToPlan : onGoToRules}
            style={{
              backgroundColor: plannedLeaveDates.length > 0 ? 'var(--accent-yellow)' : 'var(--bg-primary)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.45rem 0.55rem',
              boxShadow: '1.5px 1.5px 0px var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                fontSize: '0.62rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'var(--text-color)',
              }}
            >
              <span>{plannedLeaveDates.length > 0 ? 'PLAN SAYA' : 'CUTI OBSERVED'}</span>
              <span>{plannedLeaveDates.length > 0 ? '→' : '⚙️'}</span>
            </div>
            <div
              style={{
                fontSize: '1.1rem',
                fontWeight: 900,
                lineHeight: 1.1,
                marginTop: '0.15rem',
                color: 'var(--text-color)',
              }}
            >
              {plannedLeaveDates.length > 0
                ? `${plannedLeaveDates.length} HARI LOCK`
                : `${observedHolidayIds.length} CUTI AKTIF`}
            </div>
          </div>
        </div>

        {/* Bottom: Context Chips & Past Holiday Toggle */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          {/* Work Weekend context chip */}
          <button
            type="button"
            onClick={onGoToRules}
            title="Klik untuk konfigurasi cuti & negeri"
            style={{
              flex: '1 1 auto',
              backgroundColor: 'var(--bg-primary)',
              border: '1.5px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.3rem 0.45rem',
              fontSize: '0.68rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.3rem',
              color: 'var(--text-color)',
              boxShadow: '1px 1px 0px var(--border-color)',
            }}
          >
            <span>⚙️ {weekendType === 'SAT_SUN' ? 'SAB–AHAD' : 'JUM–SAB'}</span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span>{observedHolidayIds.length} GAZET</span>
          </button>

          {/* Past Holidays Toggle - Clean, NO horizontal overflow */}
          {pastHolidaysCount > 0 && (
            <button
              type="button"
              onClick={toggleHidePastHolidays}
              title="Klik untuk buka / sembunyi cuti lepas"
              style={{
                flex: '1 1 auto',
                backgroundColor: hidePastHolidays ? 'var(--accent-cyan)' : 'var(--accent-orange)',
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '0.3rem 0.5rem',
                fontSize: '0.68rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                boxShadow: '1px 1px 0px var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <span>{hidePastHolidays ? `⏳ AKAN DATANG (${pastHolidaysCount} LEPAS)` : `👁️ TUNJUK SEMUA`}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Inline Max AL Slider Pill */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: 'var(--border-width) solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          padding: '0.65rem 0.85rem',
          boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
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
              fontSize: '0.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
            }}
          >
            Had AL Sekali Cuti:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setMaxAlPerBridge(lvl)}
                style={{
                  backgroundColor: maxAlPerBridge === lvl ? 'var(--accent-yellow)' : 'var(--bg-primary)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.1rem 0.4rem',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: maxAlPerBridge === lvl ? '1px 1px 0px var(--border-color)' : 'none',
                }}
              >
                {lvl}H
              </button>
            ))}
          </div>
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

      {/* 4. Filter Tabs & Header */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.4rem',
            flexWrap: 'wrap',
            gap: '0.4rem',
          }}
        >
          <h2
            style={{
              fontSize: '0.95rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: 0,
            }}
          >
            SENARAI CUTI PANJANG 2026
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setExpandAll((prev) => !prev)}
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '0.2rem 0.55rem',
                fontSize: '0.7rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: '1.5px 1.5px 0px var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              {expandAll ? <ChevronUp size={13} strokeWidth={2.5} /> : <ChevronDown size={13} strokeWidth={2.5} />}
              <span>{expandAll ? 'TUTUP SEMUA' : 'BUKA SEMUA'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsLegendOpen(true)}
              style={{
                backgroundColor: 'var(--accent-yellow)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '0.2rem 0.55rem',
                fontSize: '0.7rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: '1.5px 1.5px 0px var(--border-color)',
                color: 'var(--text-color)',
              }}
            >
              <Palette size={13} strokeWidth={2.5} />
              <span>PANDUAN WARNA</span>
            </button>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              {filteredHolidays.length} DARI {groupedHolidays.length} CUTI
            </span>
          </div>
        </div>

        <FilterTabs
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          counts={tabCounts}
        />
      </div>

      {/* 6. List of Grouped Holiday Opportunities */}
      {filteredHolidays.length > 0 ? (
        <div>
          {filteredHolidays.map((holiday: GroupedHoliday) => (
            <GroupedHolidayCard
              key={`${holiday.id}-${expandAll}`}
              holiday={holiday}
              isInitiallyExpanded={expandAll}
            />
          ))}
        </div>
      ) : (
        <BrutalistCard
          headerColor="var(--accent-orange)"
          title="TAK JUMPA CUTI UNTUK FILTER NI LAH!"
        >
          <div style={{ textAlign: 'center', padding: '1rem 0.5rem' }}>
            <Sun
              size={36}
              style={{ margin: '0 auto 0.75rem auto', color: 'var(--text-color)' }}
            />
            <p
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                marginBottom: '1rem',
                lineHeight: 1.4,
              }}
            >
              Filter ni takde cuti panjang dengan had maksimum{' '}
              <strong>{maxAlPerBridge} hari AL</strong>. Cuba naikkan slider had AL atau klik tab SEMUA!
            </p>
            {hidePastHolidays && pastHolidaysCount > 0 && (
              <p
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                }}
              >
                ({pastHolidaysCount} cuti bagi tarikh yang telah berlalu disembunyikan. Korang boleh buka semula bila-bila masa.)
              </p>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <BrutalistButton
                size="sm"
                color="var(--accent-yellow)"
                onClick={() => setActiveTab('ALL')}
              >
                TENGOK SEMUA CUTI
              </BrutalistButton>
              {hidePastHolidays && pastHolidaysCount > 0 && (
                <BrutalistButton
                  size="sm"
                  color="var(--accent-cyan)"
                  onClick={toggleHidePastHolidays}
                >
                  TUNJUK CUTI LEPAS ({pastHolidaysCount})
                </BrutalistButton>
              )}
              {maxAlPerBridge < 5 && (
                <BrutalistButton
                  size="sm"
                  color="var(--bg-primary)"
                  onClick={() => setMaxAlPerBridge(maxAlPerBridge + 1)}
                >
                  +1 HARI AL LAGI
                </BrutalistButton>
              )}
            </div>
          </div>
        </BrutalistCard>
      )}

      <LegendModal
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
      />
    </div>
  );
}
