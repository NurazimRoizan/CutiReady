import { BrutalistButton } from './BrutalistButton';

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
  return (
    <section style={{ textAlign: 'center', position: 'relative', marginBottom: '1.25rem' }}>
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
    </section>
  );
}
