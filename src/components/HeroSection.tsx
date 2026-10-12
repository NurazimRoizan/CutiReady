import { BrutalistButton } from './BrutalistButton';
import { useLeaveStore } from '../store/useLeaveStore';
import { getTranslations } from '../i18n/translations';

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
  const language = useLeaveStore((state) => state.language);
  const t = getTranslations(language);

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
        {t.hero.title1}<br />
        {t.hero.title2}<br />
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
          {t.hero.badge}
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
        {t.hero.description}
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
          {t.hero.ctaCombo}
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
          {isHowToUseOpen ? t.hero.ctaGuideClose : t.hero.ctaGuideOpen}
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
          {t.hero.eaNote}
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
          {t.hero.eaLink}
        </span>
      </div>
    </section>
  );
}
