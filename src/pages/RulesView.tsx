import { useState } from 'react';
import { useLeaveStore } from '../store/useLeaveStore';
import { DEFAULT_HOLIDAYS_2026 } from '../data/holidays';
import { MalaysianState, STATE_NAMES } from '../types';
import { BrutalistBadge } from '../components/BrutalistBadge';
import { BrutalistCard } from '../components/BrutalistCard';
import { format, parseISO } from 'date-fns';
import {
  Settings,
  Building,
  Sparkles,
  Globe,
  Lock,
  Check,
  Info,
} from 'lucide-react';

export function RulesView() {
  const {
    state,
    setState,
    weekendType,
    observedHolidayIds,
    toggleHoliday,
    applyPreset,
    activePreset,
    allowSaturdayReplacements,
    toggleSaturdayReplacements,
    annualLeaveBalance,
    setAlBalance,
    maxAlPerBridge,
    setMaxAlPerBridge,
  } = useLeaveStore();

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'COMPULSORY' | 'FEDERAL' | 'STATE'>('ALL');

  const stateOptions = (Object.keys(STATE_NAMES) as MalaysianState[]).map((key) => ({
    value: key,
    label: STATE_NAMES[key],
    badge: key === 'KEDAH' || key === 'KELANTAN' || key === 'TERENGGANU' ? 'Fri-Sat' : 'Sat-Sun',
  }));

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

  const presets = [
    {
      id: 'MINIMUM_11' as const,
      label: 'EA 1955 (11H)',
      icon: Sparkles,
      desc: 'Minima akta: 5 wajib + 6 pilihan majikan',
    },
    {
      id: 'CORPORATE_15' as const,
      label: 'Korp (15H)',
      icon: Building,
      desc: 'Standard biasa syarikat swasta Malaysia',
    },
    {
      id: 'ALL' as const,
      label: 'Semua Gazet',
      icon: Globe,
      desc: 'Boss belanja semua cuti persekutuan & negeri!',
    },
  ];

  return (
    <div>
      {/* 1. View Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Settings size={22} strokeWidth={2.5} color="var(--text-color)" />
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.5px',
              margin: 0,
            }}
          >
            Polisi Syarikat & Cuti Gazet
          </h2>
        </div>

        <BrutalistBadge color="var(--accent-yellow)">
          {observedCount} CUTI AKTIF
        </BrutalistBadge>
      </div>

      {/* 2. State & Weekend Mapping Card */}
      <BrutalistCard headerColor="var(--accent-cyan)" title="1. NEGERI KERJA & HARI REST DAY">
        <p
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            margin: '0 0 0.65rem 0',
          }}
        >
          Cuti umum dan hari weekend auto-tukar ikut negeri tempat kerja korang. Takyah pening kira manual!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <select
              value={state}
              onChange={(e) => setState(e.target.value as MalaysianState)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-primary)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '0.5rem 1.8rem 0.5rem 0.65rem',
                fontSize: '0.82rem',
                fontWeight: 900,
                color: 'var(--text-color)',
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
                right: '0.6rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                fontSize: '0.65rem',
                fontWeight: 900,
              }}
            >
              ▼
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--weekend-bg)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.5rem 0.6rem',
              textAlign: 'center',
              fontSize: '0.74rem',
              fontWeight: 900,
              textTransform: 'uppercase',
            }}
          >
            {weekendType === 'SAT_SUN' ? 'WEEKEND SABTU–AHAD' : 'WEEKEND JUMAAT–SABTU'}
          </div>
        </div>
      </BrutalistCard>

      {/* 3. Statutory EA 1955 Presets */}
      <BrutalistCard headerColor="var(--accent-yellow)" title="2. PRESET CUTI SYARIKAT">
        {/* Dynamic Preset Guidance Banner */}
        <div
          style={{
            backgroundColor:
              activePreset === 'CORPORATE_15'
                ? 'var(--accent-cyan)'
                : activePreset === 'ALL'
                ? 'var(--accent-yellow)'
                : 'var(--bg-primary)',
            border: '2px solid var(--border-color)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.65rem 0.8rem',
            marginBottom: '0.85rem',
            boxShadow: '1.5px 1.5px 0px var(--border-color)',
            display: 'flex',
            gap: '0.55rem',
            alignItems: 'flex-start',
            transition: 'background-color 0.15s ease',
          }}
        >
          <Info size={16} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--text-color)' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '0.2rem',
                color: 'var(--text-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.35rem',
                flexWrap: 'wrap',
              }}
            >
              <span>
                {activePreset === 'MINIMUM_11' && 'Pakej EA 1955 (Minima 11 Hari Ikut Akta)'}
                {activePreset === 'CORPORATE_15' && 'Pakej Corporate (Standard 15 Hari Swasta)'}
                {activePreset === 'ALL' && `Pakej Semua Gazet Sapu Habis (${applicableHolidays.length} Hari Cuti)`}
                {activePreset === 'CUSTOM' && `Custom Setting Sendiri (${observedCount} Hari)`}
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '0.05rem 0.35rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-pill)',
                  color: 'var(--text-color)',
                }}
              >
                {activePreset === 'MINIMUM_11' && 'Minima Law 1955'}
                {activePreset === 'CORPORATE_15' && 'Standard Swasta / MNC'}
                {activePreset === 'ALL' && 'Boss Belanja Semua'}
                {activePreset === 'CUSTOM' && 'Checklist Sendiri'}
              </span>
            </div>
            <div style={{ fontSize: '0.73rem', fontWeight: 600, lineHeight: 1.4, color: 'var(--text-color)' }}>
              {activePreset === 'MINIMUM_11' &&
                'Ikut Seksyen 60D Akta Kerja, boss wajib bagi minima 11 hari cuti berbayar (5 wajib undang-undang + 6 company pick). Hak asas korang ni, jangan bagi boss claim tak tahu!'}
              {activePreset === 'CORPORATE_15' &&
                'Standard biasa private sector & MNC: 5 cuti wajib EA campur cuti perayaan besar (Tahun Baru, Raya 2H, CNY 2H, Deepavali, Krismas, Wesak, dll). Paling ngam untuk geng opis swasta!'}
              {activePreset === 'ALL' &&
                `Boss belanja semua! Mengambil kira kesemua cuti umum persekutuan dan cuti negeri rasmi bagi ${state.replace(/_/g, ' ')}. Rezeki terpijak, layan je cuti kaw-kaw!`}
              {activePreset === 'CUSTOM' &&
                'Korang dah custom checklist cuti ikut kalendar atau polisi syarikat sendiri dari senarai kat bawah ni.'}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.4rem',
            marginBottom: '0.75rem',
          }}
        >
          {presets.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  backgroundColor: isSelected ? 'var(--accent-yellow)' : 'var(--bg-primary)',
                  color: 'var(--text-color)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.55rem 0.25rem',
                  cursor: 'pointer',
                  boxShadow: isSelected
                    ? '2px 2px 0px var(--border-color)'
                    : '1px 1px 0px var(--border-color)',
                  transition: 'all 0.08s ease',
                  userSelect: 'none',
                }}
              >
                <p.icon size={16} strokeWidth={2.5} />
                <span style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center' }}>
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Saturday Replacement Toggle */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
              Cuti Ganti Hari Sabtu (Cuti Ganti)
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Kalau cuti jatuh Sabtu, automatik ganti Isnin (jangan rugi cuti!)
            </div>
          </div>

          <button
            type="button"
            onClick={() => toggleSaturdayReplacements(!allowSaturdayReplacements)}
            style={{
              backgroundColor: allowSaturdayReplacements ? 'var(--accent-cyan)' : 'var(--bg-primary)',
              color: 'var(--text-color)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.35rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '1px 1px 0px var(--border-color)',
            }}
          >
            {allowSaturdayReplacements ? 'ON LAH' : 'TAKDE'}
          </button>
        </div>
      </BrutalistCard>

      {/* 4. Leave Quota & Calculation Settings */}
      <BrutalistCard headerColor="var(--accent-pink)" title="3. KUOTA AL & HAD SEKALI CUTI">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '0.85rem',
            alignItems: 'center',
          }}
        >
          {/* Total Quota */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '0.35rem',
              }}
            >
              Jumlah AL Setahun:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <button
                type="button"
                onClick={() => setAlBalance(Math.max(1, annualLeaveBalance - 1))}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontWeight: 900,
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                }}
              >
                -
              </button>
              <div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.3rem',
                }}
              >
                {annualLeaveBalance} HARI
              </div>
              <button
                type="button"
                onClick={() => setAlBalance(annualLeaveBalance + 1)}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontWeight: 900,
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Max AL per bridge */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}
              >
                Had AL / Cuti:
              </label>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  backgroundColor: 'var(--accent-yellow)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-pill)',
                  padding: '0.05rem 0.35rem',
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
      </BrutalistCard>

      {/* 5. Granular Observed Holidays Checklist */}
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem',
          }}
        >
          <h3
            style={{
              fontSize: '0.95rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: 0,
            }}
          >
            Senarai Semak Cuti Umum ({observedCount} / {applicableHolidays.length})
          </h3>
        </div>

        {/* Category Filters */}
        <div
          style={{
            display: 'flex',
            gap: '0.3rem',
            marginBottom: '0.75rem',
            overflowX: 'auto',
            paddingBottom: '0.2rem',
          }}
        >
          {(
            [
              { id: 'ALL', label: `Semua (${applicableHolidays.length})` },
              { id: 'COMPULSORY', label: `Wajib Akta (${compulsoryHolidays.length})` },
              { id: 'FEDERAL', label: `Persekutuan (${federalHolidays.length})` },
              { id: 'STATE', label: `Negeri (${stateHolidays.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id)}
              style={{
                backgroundColor: categoryFilter === tab.id ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-pill)',
                padding: '0.3rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: categoryFilter === tab.id ? '2px 2px 0px var(--border-color)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List of Holidays */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredHolidays.map((holiday) => {
            const isObserved = observedHolidayIds.includes(holiday.id);
            const isCompulsory = holiday.isCompulsoryEA1955;
            const formattedDate = format(parseISO(holiday.date), 'd MMM (EEE)');

            return (
              <div
                key={holiday.id}
                onClick={() => {
                  if (!isCompulsory) {
                    toggleHoliday(holiday.id);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: isObserved ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                  opacity: isObserved ? 1 : 0.6,
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.65rem 0.75rem',
                  cursor: isCompulsory ? 'default' : 'pointer',
                  boxShadow: isObserved ? '2px 2px 0px var(--border-color)' : 'none',
                  transition: 'all 0.08s ease',
                }}
              >
                {/* Checkbox Icon */}
                <div style={{ flexShrink: 0 }}>
                  {isCompulsory ? (
                    <div
                      title="Compulsory under Employment Act 1955 (Cannot be untoggled)"
                      style={{
                        backgroundColor: 'var(--accent-yellow)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '3px',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Lock size={14} strokeWidth={2.5} color="var(--border-color)" />
                    </div>
                  ) : isObserved ? (
                    <div
                      style={{
                        backgroundColor: 'var(--accent-cyan)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '3px',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check size={14} strokeWidth={3} color="var(--border-color)" />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '3px',
                        backgroundColor: 'var(--bg-secondary)',
                      }}
                    />
                  )}
                </div>

                {/* Holiday Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      flexWrap: 'wrap',
                      marginBottom: '0.15rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 900,
                        color: 'var(--text-color)',
                      }}
                    >
                      {holiday.name}
                    </span>
                    {isCompulsory && (
                      <BrutalistBadge
                        color="var(--accent-yellow)"
                        style={{ fontSize: '0.62rem', padding: '0.05rem 0.35rem' }}
                      >
                        EA 1955 MANDATED
                      </BrutalistBadge>
                    )}
                    {holiday.category === 'STATE' && (
                      <BrutalistBadge
                        color="var(--accent-purple)"
                        style={{ fontSize: '0.62rem', padding: '0.05rem 0.35rem' }}
                      >
                        STATE
                      </BrutalistBadge>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      display: 'flex',
                      gap: '0.4rem',
                    }}
                  >
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span>{holiday.nameMs}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
