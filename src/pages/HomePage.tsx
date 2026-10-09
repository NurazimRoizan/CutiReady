import { useState, useMemo, useEffect } from 'react';
import { useLeaveStore } from '../store/useLeaveStore';
import { buildNormalizedCalendar, findBridgeOpportunities } from '../engine/calendarEngine';
import { Header } from '../components/Header';
import { BottomNavBar } from '../components/BottomNavBar';
import { BridgesView } from './BridgesView';
import { MyPlanView } from './MyPlanView';
import { RulesView } from './RulesView';
import { AppTab } from '../types';
import { Sparkles, Info } from 'lucide-react';

interface HomePageProps {
  onOpenHowToUse: () => void;
}

export function HomePage({ onOpenHowToUse }: HomePageProps) {
  const {
    selectedYear,
    state,
    weekendType,
    observedHolidayIds,
    allowSaturdayReplacements,
    plannedLeaveDates,
    maxAlPerBridge,
  } = useLeaveStore();

  const [currentTab, setCurrentTab] = useState<AppTab>('BRIDGES');

  // Fix: Reset window scroll to top whenever switching tabs so user doesn't land at the bottom
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentTab]);

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

  // Count planned bridges
  const plannedBridgesCount = useMemo(() => {
    return allBridges.filter((b) =>
      b.annualLeaveDates.some((d) => plannedLeaveDates.includes(d))
    ).length;
  }, [allBridges, plannedLeaveDates]);

  return (
    <div
      className="neobrutalist-container"
      style={{
        paddingBottom: '5.5rem',
      }}
    >
      {/* 1. Header (Navbar with State Selector, Reset & Help Buttons) */}
      <Header onOpenHelp={onOpenHowToUse} />

      {/* 2. Active Tab Content View wrapped with snappy Neobrutalist entrance animation */}
      <main key={currentTab} className="neo-tab-pane">
        {currentTab === 'BRIDGES' && (
          <BridgesView
            bridges={allBridges}
            calendar={calendar}
            onOpenHowToUse={onOpenHowToUse}
            onGoToPlan={() => setCurrentTab('PLAN')}
            onGoToRules={() => setCurrentTab('RULES')}
          />
        )}

        {currentTab === 'PLAN' && (
          <MyPlanView
            bridges={allBridges}
            onGoToBridges={() => setCurrentTab('BRIDGES')}
          />
        )}

        {currentTab === 'RULES' && <RulesView />}
      </main>

      {/* 3. Global Footer Disclaimer */}
      <footer
        style={{
          marginTop: '2.5rem',
          marginBottom: '1rem',
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
          <span>CUTIREADY MALAYSIA • REHAT RESPONSIBLY • JANGAN SAMPAI BURN AL</span>
        </div>
        <p
          style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            margin: '0 0 0.5rem 0',
            lineHeight: 1.4,
          }}
        >
          100% matematik ikut Akta Kerja 1955 (Seksyen 60D). Boss senyum, HR approved, korang healing dengan tenang!
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.68rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
          }}
        >
          <Info size={12} />
          <span>Tap mana-mana tile hari untuk toggle cuti pilihan korang</span>
        </div>
      </footer>

      {/* 4. Sticky Bottom Navigation Bar */}
      <BottomNavBar
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        bridgesCount={allBridges.length}
        plannedCount={plannedBridgesCount}
        observedCount={observedHolidayIds.length}
      />
    </div>
  );
}
