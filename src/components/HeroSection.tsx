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
        The Ultimate Leave Hack<br />
        Untuk Pekerja Malaysia<br />
        <span
          style={{
            backgroundColor: 'var(--accent-yellow)',
            color: 'var(--accent-yellow-text)',
            padding: '0.1rem 0.5rem',
            border: 'var(--border-width) solid var(--border-color)',
            display: 'inline-block',
            marginTop: '0.3rem',
            boxShadow: '3px 3px 0px var(--border-color)',
          }}
        >
          Kerja Kuat, Cuti Lagi Kuat!
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
        Burn sikit <strong>Annual Leave (AL)</strong>, tapau <strong>40+ hari cuti panjang</strong>! Formula matematik 100% tepat ikut Akta Kerja 1955, public holiday, dan <em>Cuti Ganti</em>. Boss senyum, HR approve, anda healing!
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
          JOM TENGOK BRIDGES 2026 ↓
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
          {isHowToUseOpen ? 'TUTUP GUIDE ONBOARDING ↑' : 'CARA HACK CUTI NI MACAM MANA? ↗'}
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
          100% Patuh Akta Kerja 1955 (Seksyen 60D)
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
          (Tengok cara guna)
        </span>
      </div>

      {/* Dynamic Remaining Leave Config Box */}
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
            fontSize: '0.88rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            marginBottom: '0.35rem',
            letterSpacing: '0.5px',
            color: 'var(--text-color)',
          }}
        >
          BERAPA BAKI HARI AL KORANG SEKARANG?
        </div>

        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            margin: '0 0 1rem 0',
          }}
        >
          Masukkan baki cuti tahunan yang tinggal untuk kira kombo cuti yang sempat dinikmati:
        </p>

        {/* Stepper + Direct Input */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <button
            type="button"
            onClick={() => setAlBalance(Math.max(0, annualLeaveBalance - 1))}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: 'var(--border-width) solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              width: '42px',
              height: '42px',
              fontSize: '1.3rem',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '2px 2px 0px var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            -
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--bg-primary)',
              border: 'var(--border-width) solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.2rem 0.65rem',
              boxShadow: '2px 2px 0px var(--border-color)',
            }}
          >
            <input
              type="number"
              min={0}
              max={60}
              value={annualLeaveBalance}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setAlBalance(isNaN(val) ? 0 : Math.max(0, Math.min(60, val)));
              }}
              style={{
                width: '54px',
                textAlign: 'center',
                fontSize: '1.4rem',
                fontWeight: 900,
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-color)',
                outline: 'none',
              }}
            />
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'var(--text-color)',
              }}
            >
              HARI
            </span>
          </div>

          <button
            type="button"
            onClick={() => setAlBalance(annualLeaveBalance + 1)}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: 'var(--border-width) solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              width: '42px',
              height: '42px',
              fontSize: '1.3rem',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '2px 2px 0px var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            +
          </button>
        </div>

        {/* Quick Click Chips */}
        <div
          style={{
            display: 'flex',
            gap: '0.35rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[2, 4, 5, 8, 10, 14, 20].map((val) => {
            const isSelected = annualLeaveBalance === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => setAlBalance(val)}
                style={{
                  backgroundColor: isSelected ? 'var(--accent-yellow)' : 'var(--bg-primary)',
                  color: isSelected ? 'var(--accent-yellow-text)' : 'var(--text-color)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.35rem 0.55rem',
                  fontSize: '0.75rem',
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
                {val}H
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
