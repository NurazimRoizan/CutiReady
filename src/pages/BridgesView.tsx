import { useState, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { useLeaveStore } from '../store/useLeaveStore';
import { HeroSection } from '../components/HeroSection';
import { FilterTabs } from '../components/FilterTabs';
import { GroupedHolidayCard } from '../components/GroupedHolidayCard';
import { BrutalistCard } from '../components/BrutalistCard';
import { BrutalistButton } from '../components/BrutalistButton';
import { LegendModal } from '../components/LegendModal';
import { HolidayConfigDrawer } from '../components/HolidayConfigDrawer';
import {
  FilterTabType,
  BridgeOpportunity,
  CalendarDay,
  GroupedHoliday,
  MalaysianState,
  STATE_NAMES,
} from '../types';
import { groupBridgesByHoliday } from '../engine/calendarEngine';
import { Sun, Palette, ChevronDown, ChevronUp, Sliders, RefreshCw } from 'lucide-react';

interface BridgesViewProps {
  bridges: BridgeOpportunity[];
  calendar: CalendarDay[];
  onOpenHowToUse: () => void;
  onGoToPlan: () => void;
  onGoToRules?: () => void;
}

export function BridgesView({
  bridges,
  calendar,
  onOpenHowToUse,
  onGoToPlan,
  onGoToRules,
}: BridgesViewProps) {
  const {
    state,
    setState,
    annualLeaveBalance,
    setAlBalance,
    plannedLeaveDates,
    maxAlPerBridge,
    setMaxAlPerBridge,
    observedHolidayIds,
    weekendType,
    setWeekendType,
    allowSaturdayReplacements,
    toggleSaturdayReplacements,
    hidePastHolidays,
    toggleHidePastHolidays,
    resetToDefaults,
  } = useLeaveStore();

  const [activeTab, setActiveTab] = useState<FilterTabType>('ALL');
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isHolidayDrawerOpen, setIsHolidayDrawerOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [expandAll, setExpandAll] = useState(false);
  const bridgesListRef = useRef<HTMLDivElement>(null);

  const stateOptions = useMemo(
    () =>
      (Object.keys(STATE_NAMES) as MalaysianState[]).map((key) => ({
        value: key,
        label: STATE_NAMES[key],
        badge:
          key === 'KEDAH' || key === 'KELANTAN' || key === 'TERENGGANU'
            ? 'Jum–Sab'
            : 'Sab–Ahad',
      })),
    []
  );

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

      {/* 2. Unified Quick Setup & Controls Card */}
      <div ref={bridgesListRef}>
        <BrutalistCard
          headerColor="var(--accent-yellow)"
          title="QUICK SETUP"
          headerAction={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {plannedLeaveDates.length > 0 && (
                <button
                  type="button"
                  onClick={onGoToPlan}
                  title="Lihat cuti yang telah dilock"
                  style={{
                    backgroundColor: 'var(--accent-pink)',
                    color: 'var(--accent-pink-text)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-pill)',
                    padding: '0.12rem 0.45rem',
                    fontSize: '0.62rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '1px 1px 0px var(--border-color)',
                  }}
                >
                  {plannedLeaveDates.length} LOCK →
                </button>
              )}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-pill)',
                  padding: '0.15rem 0.55rem',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  color: 'var(--text-color)',
                  boxShadow: '1px 1px 0px var(--border-color)',
                  textTransform: 'uppercase',
                }}
              >
                {remainingAl} / {annualLeaveBalance} AL
              </div>
            </div>
          }
          style={{ marginBottom: '0.9rem' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Field 1: Malaysian State Selector */}
            <div>
              <label
                htmlFor="state-selector"
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  marginBottom: '0.3rem',
                  color: 'var(--text-color)',
                }}
              >
                Negeri Tempat Kerja:
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="state-selector"
                  value={state}
                  onChange={(e) => setState(e.target.value as MalaysianState)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-primary)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.5rem 2rem 0.5rem 0.7rem',
                    fontSize: '0.82rem',
                    fontWeight: 900,
                    color: 'var(--text-color)',
                    boxShadow: '2px 2px 0px var(--border-color)',
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
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    color: 'var(--text-color)',
                  }}
                >
                  ▼
                </span>
              </div>
            </div>

            {/* Field 2: 2-Column Responsive Grid (AL Balance Stepper & Max AL Chips) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '0.6rem',
              }}
            >
              {/* AL Balance Stepper */}
              <div
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem 0.65rem',
                  boxShadow: '2px 2px 0px var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.35rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      color: 'var(--text-color)',
                    }}
                  >
                    Baki Annual Leave
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '0.1rem 0.35rem',
                      borderRadius: 'var(--border-radius-pill)',
                      backgroundColor: remainingAl > 3 ? 'var(--accent-cyan)' : 'var(--accent-pink)',
                      color: remainingAl > 3 ? 'var(--accent-cyan-text)' : 'var(--accent-pink-text)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {remainingAl} TINGGAL
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setAlBalance(Math.max(0, annualLeaveBalance - 1))}
                    aria-label="Kurangkan cuti tahunan"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '2px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      boxShadow: '1.5px 1.5px 0px var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-color)',
                    }}
                  >
                    −
                  </button>
                  <div
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      color: 'var(--text-color)',
                    }}
                  >
                    {annualLeaveBalance}{' '}
                    <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>HARI</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAlBalance(annualLeaveBalance + 1)}
                    aria-label="Tambah cuti tahunan"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '2px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      boxShadow: '1.5px 1.5px 0px var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-color)',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Max AL per Bridge Chips */}
              <div
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem 0.65rem',
                  boxShadow: '2px 2px 0px var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.35rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      color: 'var(--text-color)',
                    }}
                  >
                    Had AL Sekali Cuti
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      color: 'var(--text-muted)',
                    }}
                  >
                    MAKS {maxAlPerBridge} HARI
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '0.25rem',
                  }}
                >
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setMaxAlPerBridge(lvl)}
                      style={{
                        backgroundColor:
                          maxAlPerBridge === lvl ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        padding: '0.35rem 0.2rem',
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow:
                          maxAlPerBridge === lvl ? '1.5px 1.5px 0px var(--border-color)' : 'none',
                        color:
                          maxAlPerBridge === lvl
                            ? 'var(--accent-yellow-text)'
                            : 'var(--text-color)',
                        textAlign: 'center',
                      }}
                    >
                      {lvl}H
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field 3: Holiday Policy Modal Trigger Button */}
            <div
              onClick={() => setIsHolidayDrawerOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsHolidayDrawerOpen(true);
                }
              }}
              style={{
                backgroundColor: 'var(--accent-cyan)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '0.55rem 0.75rem',
                boxShadow: '2px 2px 0px var(--border-color)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--accent-cyan-text)',
                  }}
                >
                  Polisi Cuti Syarikat (Checklist)
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--accent-cyan-text)',
                    marginTop: '0.1rem',
                  }}
                >
                  {observedHolidayIds.length} Cuti Aktif Digunakan
                </div>
              </div>
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.25rem 0.55rem',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  boxShadow: '1px 1px 0px var(--border-color)',
                  color: 'var(--text-color)',
                  flexShrink: 0,
                }}
              >
                PILIH CUTI
              </div>
            </div>

            {/* Field 4: Expandable Advanced Settings Accordion */}
            <div
              style={{
                borderTop: '2px dashed var(--border-color)',
                paddingTop: '0.55rem',
              }}
            >
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '0.2rem 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-color)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sliders size={14} color="var(--border-color)" />
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Tetapan Lanjutan (Advanced)
                  </span>
                </div>
                {isAdvancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isAdvancedOpen && (
                <div
                  style={{
                    marginTop: '0.55rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  {/* Setting A: Weekend Days Mode */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      padding: '0.45rem 0.6rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: 'var(--text-color)',
                      }}
                    >
                      Hari Weekend:
                    </span>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button
                        type="button"
                        onClick={() => setWeekendType('SAT_SUN')}
                        style={{
                          backgroundColor:
                            weekendType === 'SAT_SUN'
                              ? 'var(--accent-yellow)'
                              : 'var(--bg-secondary)',
                          border: '1.5px solid var(--border-color)',
                          borderRadius: 'var(--border-radius-sm)',
                          padding: '0.2rem 0.45rem',
                          fontSize: '0.68rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                          color: 'var(--text-color)',
                          boxShadow:
                            weekendType === 'SAT_SUN'
                              ? '1px 1px 0px var(--border-color)'
                              : 'none',
                        }}
                      >
                        SAB–AHAD
                      </button>
                      <button
                        type="button"
                        onClick={() => setWeekendType('FRI_SAT')}
                        style={{
                          backgroundColor:
                            weekendType === 'FRI_SAT'
                              ? 'var(--accent-yellow)'
                              : 'var(--bg-secondary)',
                          border: '1.5px solid var(--border-color)',
                          borderRadius: 'var(--border-radius-sm)',
                          padding: '0.2rem 0.45rem',
                          fontSize: '0.68rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                          color: 'var(--text-color)',
                          boxShadow:
                            weekendType === 'FRI_SAT'
                              ? '1px 1px 0px var(--border-color)'
                              : 'none',
                        }}
                      >
                        JUM–SAB
                      </button>
                    </div>
                  </div>

                  {/* Setting B: Saturday Replacement Toggle */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      padding: '0.45rem 0.6rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                    }}
                  >
                    <div style={{ maxWidth: '72%' }}>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          color: 'var(--text-color)',
                        }}
                      >
                        Cuti Ganti Sabtu:
                      </div>
                      <div
                        style={{
                          fontSize: '0.63rem',
                          color: 'var(--text-muted)',
                          fontWeight: 600,
                        }}
                      >
                        Ganti cuti Isnin jika cuti am jatuh Sabtu
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSaturdayReplacements(!allowSaturdayReplacements)}
                      style={{
                        backgroundColor: allowSaturdayReplacements
                          ? 'var(--accent-green)'
                          : 'var(--bg-secondary)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        color: 'var(--text-color)',
                        boxShadow: '1px 1px 0px var(--border-color)',
                      }}
                    >
                      {allowSaturdayReplacements ? 'YA' : 'TIDAK'}
                    </button>
                  </div>

                  {/* Setting C: Past Holidays Toggle */}
                  {pastHolidaysCount > 0 && (
                    <div
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        padding: '0.45rem 0.6rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: 'var(--text-color)',
                          }}
                        >
                          Cuti Lepas ({pastHolidaysCount}):
                        </div>
                        <div
                          style={{
                            fontSize: '0.63rem',
                            color: 'var(--text-muted)',
                            fontWeight: 600,
                          }}
                        >
                          {hidePastHolidays ? 'Disembunyikan dari senarai' : 'Dipaparkan dalam senarai'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={toggleHidePastHolidays}
                        style={{
                          backgroundColor: hidePastHolidays
                            ? 'var(--accent-cyan)'
                            : 'var(--bg-secondary)',
                          border: '1.5px solid var(--border-color)',
                          borderRadius: 'var(--border-radius-sm)',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.68rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                          color: 'var(--text-color)',
                          boxShadow: '1px 1px 0px var(--border-color)',
                        }}
                      >
                        {hidePastHolidays ? 'SEMBUNYI' : 'TUNJUK'}
                      </button>
                    </div>
                  )}

                  {/* Setting D: Reset Defaults & Link to Full Tab */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                      paddingTop: '0.2rem',
                    }}
                  >
                    {onGoToRules && (
                      <button
                        type="button"
                        onClick={onGoToRules}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontSize: '0.67rem',
                          fontWeight: 800,
                          color: 'var(--text-color)',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Buka tab Holiday penuh →
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Reset semua tetapan kepada tetapan asal?')) {
                          resetToDefaults();
                        }
                      }}
                      style={{
                        marginLeft: 'auto',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        padding: '0.25rem 0.55rem',
                        fontSize: '0.67rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: 'var(--text-color)',
                        boxShadow: '1px 1px 0px var(--border-color)',
                      }}
                    >
                      <RefreshCw size={11} color="var(--border-color)" />
                      <span>RESET DEFAULT</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </BrutalistCard>
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

      <HolidayConfigDrawer
        isOpen={isHolidayDrawerOpen}
        onClose={() => setIsHolidayDrawerOpen(false)}
      />

      <LegendModal
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
      />
    </div>
  );
}
