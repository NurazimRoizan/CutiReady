import { useState, useMemo } from 'react';
import { useLeaveStore } from '../store/useLeaveStore';
import { buildNormalizedCalendar, findBridgeOpportunities } from '../engine/calendarEngine';
import { Header } from '../components/Header';
import { ControlBar } from '../components/ControlBar';
import { SummaryStats } from '../components/SummaryStats';
import { FilterTabs } from '../components/FilterTabs';
import { BridgeCard } from '../components/BridgeCard';
import { BrutalistCard } from '../components/BrutalistCard';
import { BrutalistButton } from '../components/BrutalistButton';
import { LegendGuide } from '../components/LegendGuide';
import { FilterTabType, BridgeOpportunity } from '../types';
import { Sparkles, SlidersHorizontal, Sun, Info } from 'lucide-react';

interface HomePageProps {
  onOpenHolidayDrawer: () => void;
}

export function HomePage({ onOpenHolidayDrawer }: HomePageProps) {
  const {
    selectedYear,
    state,
    weekendType,
    observedHolidayIds,
    allowSaturdayReplacements,
    plannedLeaveDates,
    maxAlPerBridge,
    setMaxAlPerBridge,
  } = useLeaveStore();

  const [activeTab, setActiveTab] = useState<FilterTabType>('ALL');

  // Deterministically compute normalized calendar and bridge opportunities
  const calendar = useMemo(() => {
    return buildNormalizedCalendar(
      selectedYear,
      state,
      weekendType,
      observedHolidayIds,
      allowSaturdayReplacements,
      plannedLeaveDates
    );
  }, [
    selectedYear,
    state,
    weekendType,
    observedHolidayIds,
    allowSaturdayReplacements,
    plannedLeaveDates,
  ]);

  const allBridges = useMemo(() => {
    return findBridgeOpportunities(calendar, maxAlPerBridge);
  }, [calendar, maxAlPerBridge]);

  // Compute tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<FilterTabType, number> = {
      ALL: allBridges.length,
      HIGH_ROI: allBridges.filter((b) => b.roiMultiplier >= 3).length,
      ZERO_AL: allBridges.filter((b) => b.alDaysRequired === 0).length,
      Q1: allBridges.filter((b) => b.quarter === 'Q1').length,
      Q2: allBridges.filter((b) => b.quarter === 'Q2').length,
      Q3: allBridges.filter((b) => b.quarter === 'Q3').length,
      Q4: allBridges.filter((b) => b.quarter === 'Q4').length,
    };
    return counts;
  }, [allBridges]);

  // Filter bridges according to active tab
  const filteredBridges = useMemo(() => {
    if (activeTab === 'ALL') return allBridges;
    if (activeTab === 'HIGH_ROI') return allBridges.filter((b) => b.roiMultiplier >= 3);
    if (activeTab === 'ZERO_AL') return allBridges.filter((b) => b.alDaysRequired === 0);
    return allBridges.filter((b) => b.quarter === activeTab);
  }, [allBridges, activeTab]);

  return (
    <div className="neobrutalist-container">
      {/* 1. Header */}
      <Header onOpenHolidayDrawer={onOpenHolidayDrawer} />

      {/* 2. Control Bar */}
      <ControlBar onOpenHolidayDrawer={onOpenHolidayDrawer} />

      {/* 3. Summary Stats Banner */}
      <SummaryStats bridges={allBridges} plannedLeaveDates={plannedLeaveDates} />

      {/* 4. Full Color Guide & Legend */}
      <LegendGuide />

      {/* 5. Filter Tabs */}
      <div style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>
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
            DISCOVERED LONG WEEKENDS
          </h2>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            {filteredBridges.length} OF {allBridges.length} BRIDGES
          </span>
        </div>

        <FilterTabs
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          counts={tabCounts}
        />
      </div>

      {/* 5. List of Bridge Opportunities */}
      {filteredBridges.length > 0 ? (
        <div>
          {filteredBridges.map((bridge: BridgeOpportunity) => (
            <BridgeCard key={bridge.id} bridge={bridge} />
          ))}
        </div>
      ) : (
        <BrutalistCard
          headerColor="var(--accent-orange)"
          title="NO BRIDGES FOUND FOR THIS FILTER"
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
              No long weekends match the currently selected filter with a max limit of{' '}
              <strong>{maxAlPerBridge} AL days</strong>. Try increasing the AL slider or switching to the ALL tab.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <BrutalistButton
                size="sm"
                color="var(--accent-yellow)"
                onClick={() => setActiveTab('ALL')}
              >
                VIEW ALL BRIDGES
              </BrutalistButton>
              {maxAlPerBridge < 5 && (
                <BrutalistButton
                  size="sm"
                  color="var(--accent-cyan)"
                  onClick={() => setMaxAlPerBridge(maxAlPerBridge + 1)}
                >
                  <SlidersHorizontal size={14} />
                  ALLOW +1 AL DAY
                </BrutalistButton>
              )}
            </div>
          </div>
        </BrutalistCard>
      )}

      {/* 6. Footer Disclaimer & Stat Note */}
      <footer
        style={{
          marginTop: '2rem',
          marginBottom: '2.5rem',
          paddingTop: '1rem',
          borderTop: '2px solid var(--border-subtle)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '0.35rem',
          }}
        >
          <Sparkles size={14} color="var(--text-color)" />
          <span>CUTIREADY MALAYSIA • OFFLINE-READY PWA</span>
        </div>
        <p
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            margin: '0 0 0.5rem 0',
            lineHeight: 1.4,
          }}
        >
          Calculations are 100% deterministic based on Malaysian Employment Act 1955 (Section 60D) and gazetted holiday calendars.
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.65rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
          }}
        >
          <Info size={12} />
          <span>Tap any day tile to toggle individual AL bookings</span>
        </div>
      </footer>
    </div>
  );
}
