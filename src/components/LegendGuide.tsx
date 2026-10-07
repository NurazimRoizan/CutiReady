import { useState } from 'react';
import { BrutalistCard } from './BrutalistCard';
import { BrutalistBadge } from './BrutalistBadge';
import { ChevronDown, ChevronUp, Palette, HelpCircle } from 'lucide-react';

export function LegendGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'STRIP' | 'CARDS'>('STRIP');

  return (
    <BrutalistCard
      headerColor="var(--accent-yellow)"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Palette size={16} strokeWidth={2.5} />
          <span>COLOR GUIDE & LEGEND</span>
        </div>
      }
      headerAction={
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '2px solid var(--border-color)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.2rem 0.5rem',
            fontSize: '0.7rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            boxShadow: '1px 1px 0px var(--border-color)',
          }}
        >
          <span>{isOpen ? 'COLLAPSE' : 'EXPAND'}</span>
          {isOpen ? <ChevronUp size={13} strokeWidth={3} /> : <ChevronDown size={13} strokeWidth={3} />}
        </button>
      }
      style={{ marginBottom: '1rem' }}
    >
      {/* Quick Summary Bar always visible */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--text-muted)',
            }}
          >
            QUICK REFERENCE:
          </span>
          <BrutalistBadge size="sm" color="var(--ph-bg)">
            🟢 Public Holiday
          </BrutalistBadge>
          <BrutalistBadge size="sm" color="var(--accent-cyan)">
            🔵 Cuti Ganti
          </BrutalistBadge>
          <BrutalistBadge size="sm" color="var(--al-bg)">
            🟡 Take AL
          </BrutalistBadge>
          <BrutalistBadge size="sm" color="var(--accent-green)">
            ⚡ Free / Mega Break
          </BrutalistBadge>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-color)',
            fontWeight: 800,
            fontSize: '0.72rem',
            textDecoration: 'underline',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            padding: '0.2rem 0',
          }}
        >
          <HelpCircle size={12} />
          <span>{isOpen ? 'Hide Details' : 'Full Color Breakdown'}</span>
        </button>
      </div>

      {/* Expanded Details Section */}
      {isOpen && (
        <div
          style={{
            marginTop: '0.85rem',
            paddingTop: '0.75rem',
            borderTop: '2px solid var(--border-subtle)',
          }}
        >
          {/* Section Switcher Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('STRIP')}
              style={{
                flex: 1,
                padding: '0.45rem',
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                backgroundColor: activeTab === 'STRIP' ? 'var(--accent-yellow)' : 'var(--bg-primary)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                boxShadow: activeTab === 'STRIP' ? '2px 2px 0px var(--border-color)' : 'none',
                cursor: 'pointer',
              }}
            >
              🗓️ 1. Visual Day Strip Colors
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('CARDS')}
              style={{
                flex: 1,
                padding: '0.45rem',
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                backgroundColor: activeTab === 'CARDS' ? 'var(--accent-yellow)' : 'var(--bg-primary)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                boxShadow: activeTab === 'CARDS' ? '2px 2px 0px var(--border-color)' : 'none',
                cursor: 'pointer',
              }}
            >
              🃏 2. Bridge Card Banners & Badges
            </button>
          </div>

          {/* Tab 1: Day Strip Colors Breakdown */}
          {activeTab === 'STRIP' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Public Holiday */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem 0.65rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--ph-bg)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--ph-text)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  🟢 Green Pill
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Gazetted Public Holiday (PH)
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    Official statutory holiday under Employment Act 1955 or State Gazette. Paid break; 0 Annual Leave deducted.
                  </div>
                </div>
              </div>

              {/* Cuti Ganti */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem 0.65rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--accent-cyan)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--text-color)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  🔵 Cyan Pill
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Replacement Holiday (Cuti Ganti)
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    Triggered when a Public Holiday falls on an official Rest Day (Sunday or Saturday). Rolls forward to the next working day.
                  </div>
                </div>
              </div>

              {/* Take AL */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem 0.65rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--al-bg)',
                    border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--al-text)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  🟡 Amber (Dashed)
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Recommended Annual Leave (AL)
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    Workdays strategically converted into leave to bridge the holiday with weekends. Tap any tile to lock into your leave plan.
                  </div>
                </div>
              </div>

              {/* Weekend */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem 0.65rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--weekend-bg)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--weekend-text)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  ⚪ Slate Gray
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Statutory Weekend / Rest Day
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    Standard weekend: Saturday & Sunday (or Friday & Saturday in Kedah, Kelantan, and Terengganu).
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Bridge Cards & Badges Breakdown */}
          {activeTab === 'CARDS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Cyan Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem 0.65rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--accent-cyan)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--text-color)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  ⚡ Cyan Banner
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Free Long Weekend (0 AL Needed)
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    A natural long weekend created directly by gazetted holidays adjacent to weekends. Pure free time off!
                  </div>
                </div>
              </div>

              {/* Green Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem 0.65rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--accent-green)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--text-color)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  🔥 Green Banner
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Mega High-ROI Bridge (≥ 4.0x Return)
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    Super efficient leave opportunity. For every 1 AL day invested, you unlock 4 or more contiguous days away from the desk.
                  </div>
                </div>
              </div>

              {/* Yellow Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem 0.65rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--accent-yellow)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--text-color)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  🌴 Yellow Banner
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Standard Bridge
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    Standard leave arbitrage opportunity yielding 3.0x to 3.9x days off per AL day.
                  </div>
                </div>
              </div>

              {/* Pink Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem 0.65rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--accent-pink)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--text-color)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  🌸 Pink Badge
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    AL Days Required & ROI Multiplier
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    Shows the exact number of Annual Leave days needed and the calculated return ratio (Total Days Off ÷ AL Days).
                  </div>
                </div>
              </div>

              {/* Green Planned Button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  backgroundColor: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem 0.65rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--accent-green)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: 'var(--text-color)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  ✓ Green Button
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Locked Into Leave Plan
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    Indicates you have locked this bridge into your planned quota, automatically deducting from your remaining AL balance.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </BrutalistCard>
  );
}
