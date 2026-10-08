import { useState, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { useLeaveStore } from '../store/useLeaveStore';
import { HeroSection } from '../components/HeroSection';
import { FilterTabs } from '../components/FilterTabs';
import { BridgeCard } from '../components/BridgeCard';
import { BrutalistCard } from '../components/BrutalistCard';
import { BrutalistButton } from '../components/BrutalistButton';
import { BrutalistBadge } from '../components/BrutalistBadge';
import { LegendGuide } from '../components/LegendGuide';
import { FilterTabType, BridgeOpportunity } from '../types';
import { SlidersHorizontal, Sun, CalendarCheck } from 'lucide-react';

interface BridgesViewProps {
  bridges: BridgeOpportunity[];
  onOpenHowToUse: () => void;
  onGoToPlan: () => void;
  onGoToRules: () => void;
}

export function BridgesView({
  bridges,
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
  const bridgesListRef = useRef<HTMLDivElement>(null);

  const remainingAl = Math.max(0, annualLeaveBalance - plannedLeaveDates.length);

  const todayStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  // Count past bridges (ended before today)
  const pastBridgesCount = useMemo(() => {
    return bridges.filter((b) => b.endDate < todayStr).length;
  }, [bridges, todayStr]);

  // Base list of bridges filtered by hidePastHolidays
  const baseBridges = useMemo(() => {
    if (hidePastHolidays) {
      const upcoming = bridges.filter((b) => b.endDate >= todayStr);
      return upcoming.length > 0 ? upcoming : bridges;
    }
    return bridges;
  }, [bridges, hidePastHolidays, todayStr]);

  const handleScrollToBridges = () => {
    bridgesListRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Compute tab counts based on baseBridges
  const tabCounts = useMemo(() => {
    const counts: Record<FilterTabType, number> = {
      ALL: baseBridges.length,
      HIGH_ROI: baseBridges.filter((b) => b.roiMultiplier >= 3).length,
      ZERO_AL: baseBridges.filter((b) => b.alDaysRequired === 0).length,
      Q1: baseBridges.filter((b) => b.quarter === 'Q1').length,
      Q2: baseBridges.filter((b) => b.quarter === 'Q2').length,
      Q3: baseBridges.filter((b) => b.quarter === 'Q3').length,
      Q4: baseBridges.filter((b) => b.quarter === 'Q4').length,
    };
    return counts;
  }, [baseBridges]);

  // Filter bridges according to active tab
  const filteredBridges = useMemo(() => {
    if (activeTab === 'ALL') return baseBridges;
    if (activeTab === 'HIGH_ROI') return baseBridges.filter((b) => b.roiMultiplier >= 3);
    if (activeTab === 'ZERO_AL') return baseBridges.filter((b) => b.alDaysRequired === 0);
    return baseBridges.filter((b) => b.quarter === activeTab);
  }, [baseBridges, activeTab]);

  return (
    <div>
      {/* 1. Hero Section & Quick AL Quota Picker */}
      <HeroSection
        onScrollToPlanner={handleScrollToBridges}
        onToggleHowToUse={onOpenHowToUse}
        isHowToUseOpen={false}
      />

      {/* 2. Status Badges & Quick Tuning Bar */}
      <div
        ref={bridgesListRef}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <BrutalistBadge
          color={remainingAl > 3 ? 'var(--accent-cyan)' : 'var(--accent-pink)'}
        >
          {remainingAl} / {annualLeaveBalance} AL BALANCE (JANGAN BURN!)
        </BrutalistBadge>

        <BrutalistBadge
          color="var(--accent-yellow)"
          style={{ cursor: 'pointer' }}
          onClick={onGoToRules}
        >
          {observedHolidayIds.length} CUTI OBSERVED ⚙️
        </BrutalistBadge>

        <BrutalistBadge color="var(--weekend-bg)">
          {weekendType === 'SAT_SUN' ? 'WEEKEND SABTU–AHAD' : 'WEEKEND JUMAAT–SABTU'}
        </BrutalistBadge>

        {pastBridgesCount > 0 && (
          <BrutalistBadge
            color={hidePastHolidays ? 'var(--accent-cyan)' : 'var(--accent-orange)'}
            style={{ cursor: 'pointer' }}
            onClick={toggleHidePastHolidays}
            title="Klik untuk ubah paparan cuti lepas"
          >
            {hidePastHolidays
              ? `⏳ CUTI AKAN DATANG (${pastBridgesCount} LEPAS DISEMBUNYI)`
              : `👁️ TUNJUK SEMUA (TERMASUK ${pastBridgesCount} LEPAS)`}
          </BrutalistBadge>
        )}

        {plannedLeaveDates.length > 0 && (
          <BrutalistBadge
            color="var(--accent-pink)"
            style={{ cursor: 'pointer' }}
            onClick={onGoToPlan}
          >
            <CalendarCheck size={12} />
            {plannedLeaveDates.length} HARI DAH LOCK →
          </BrutalistBadge>
        )}
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
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.2rem',
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
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 900,
                backgroundColor: 'var(--accent-yellow)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-pill)',
                padding: '0.05rem 0.4rem',
              }}
            >
              {maxAlPerBridge} {maxAlPerBridge === 1 ? 'HARI' : 'HARI'}
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

      {/* 4. Filter Tabs & Header */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.4rem',
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
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            {filteredBridges.length} DARI {bridges.length} BRIDGES
          </span>
        </div>

        <FilterTabs
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          counts={tabCounts}
        />
      </div>

      {/* 5. Color Legend Guide */}
      <LegendGuide />

      {/* 6. List of Bridge Opportunities */}
      {filteredBridges.length > 0 ? (
        <div>
          {filteredBridges.map((bridge: BridgeOpportunity) => (
            <BridgeCard key={bridge.id} bridge={bridge} />
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
            {hidePastHolidays && pastBridgesCount > 0 && (
              <p
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                }}
              >
                ({pastBridgesCount} cuti bagi tarikh yang telah berlalu disembunyikan. Korang boleh buka semula bila-bila masa.)
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
              {hidePastHolidays && pastBridgesCount > 0 && (
                <BrutalistButton
                  size="sm"
                  color="var(--accent-cyan)"
                  onClick={toggleHidePastHolidays}
                >
                  TUNJUK CUTI LEPAS ({pastBridgesCount})
                </BrutalistButton>
              )}
              {maxAlPerBridge < 5 && (
                <BrutalistButton
                  size="sm"
                  color="var(--bg-primary)"
                  onClick={() => setMaxAlPerBridge(maxAlPerBridge + 1)}
                >
                  <SlidersHorizontal size={14} />
                  BAGI +1 HARI AL LAGI
                </BrutalistButton>
              )}
            </div>
          </div>
        </BrutalistCard>
      )}
    </div>
  );
}
