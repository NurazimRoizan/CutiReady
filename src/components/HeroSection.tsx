import { BrutalistButton } from './BrutalistButton';
import { useLeaveStore } from '../store/useLeaveStore';

interface HeroSectionProps {
  onScrollToPlanner: () => void;
  onToggleHowToUse: () => void;
  isHowToUseOpen: boolean;
}

export function HeroSection({
  onScrollToPlanner,
  onToggleHowToUse,
  isHowToUseOpen,
}: HeroSectionProps) {
  const { annualLeaveBalance, setAlBalance } = useLeaveStore();

  const alPresets = [8, 12, 14, 16, 20];

  const handleAlSelect = (val: number) => {
    setAlBalance(val);
    onScrollToPlanner();
  };

  return (
    <section style={{ textAlign: 'center', position: 'relative', marginBottom: '2.5rem' }}>
      {/* Main Massive Hero Header */}
      <h1
        style={{
          fontSize: 'clamp(2.1rem, 9.5vw, 3.2rem)',
          textTransform: 'uppercase',
          letterSpacing: '-1.2px',
          lineHeight: '1.05',
          marginTop: '0.75rem',
          marginBottom: '1rem',
          color: 'var(--text-color)',
        }}
      >
        The Leave Hack<br />
        For Malaysian<br />
        <span
          style={{
            backgroundColor: 'var(--accent-cyan)',
            padding: '0.1rem 0.5rem',
            border: 'var(--border-width) solid var(--border-color)',
            display: 'inline-block',
            marginTop: '0.3rem',
            boxShadow: '3px 3px 0px var(--border-color)',
          }}
        >
          Workers & Teams
        </span>
      </h1>

      {/* Bold Explanatory Lead Paragraph */}
      <p
        style={{
          fontSize: '1.02rem',
          fontWeight: 700,
          margin: '0 auto 1.75rem auto',
          lineHeight: '1.45',
          opacity: 0.9,
          color: 'var(--text-color)',
        }}
      >
        Turn <strong>14 days of Annual Leave</strong> into <strong>40+ contiguous days off</strong>. Zero-hallucination deterministic calendar arithmetic that combines your company-observed public holidays, rest days, and <em>Cuti Ganti</em> rollovers into optimal long weekends.
      </p>

      {/* Stacked Full-Width Dual Action Hero Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
        <BrutalistButton
          color="var(--accent-yellow)"
          onClick={onScrollToPlanner}
          style={{
            fontSize: '1.15rem',
            padding: '1.1rem',
            width: '100%',
            boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
          }}
        >
          JUMP INTO 2026 BRIDGES ↓
        </BrutalistButton>

        <BrutalistButton
          color="var(--accent-pink)"
          onClick={onToggleHowToUse}
          style={{
            fontSize: '1.02rem',
            padding: '0.85rem',
            width: '100%',
            boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
          }}
        >
          {isHowToUseOpen ? 'HIDE ONBOARDING GUIDE ↑' : 'HOW LEAVE ARBITRAGE WORKS ↗'}
        </BrutalistButton>
      </div>

      {/* Subtext info row */}
      <div
        style={{
          marginTop: '0.85rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.45rem',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 700, opacity: 0.75, color: 'var(--text-color)' }}>
          Employment Act 1955 (Section 60D) Compliant
        </span>
        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            textDecoration: 'underline',
            cursor: 'pointer',
            color: 'var(--text-color)',
          }}
          onClick={onToggleHowToUse}
        >
          (How it works)
        </span>
      </div>

      {/* Quick Interactive Leave Config Box (Wallo's Join Box Heritage) */}
      <div
        style={{
          marginTop: '2rem',
          backgroundColor: 'var(--bg-secondary)',
          border: 'var(--border-width) solid var(--border-color)',
          boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
          borderRadius: '12px',
          padding: '1.25rem 1rem',
          width: '100%',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            letterSpacing: '0.5px',
            color: 'var(--text-color)',
          }}
        >
          HOW MANY ANNUAL LEAVE DAYS DO YOU GET?
        </div>

        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            margin: '0 0 0.85rem 0',
          }}
        >
          Tap your leave quota to calculate tailored Malaysian break opportunities:
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {alPresets.map((val) => {
            const isSelected = annualLeaveBalance === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => handleAlSelect(val)}
                style={{
                  backgroundColor: isSelected ? 'var(--accent-yellow)' : 'var(--bg-primary)',
                  color: 'var(--text-color)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: isSelected
                    ? '2px 2px 0px var(--border-color)'
                    : '1px 1px 0px var(--border-color)',
                  transition: 'all 0.08s ease',
                  userSelect: 'none',
                }}
              >
                {val} DAYS
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
