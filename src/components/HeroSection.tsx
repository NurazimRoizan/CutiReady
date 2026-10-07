import { BrutalistButton } from './BrutalistButton';
import { BrutalistBadge } from './BrutalistBadge';
import { Sparkles, Calendar, ShieldCheck, ArrowDown, HelpCircle } from 'lucide-react';

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
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: 'var(--border-width-thick) solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
        padding: '1.25rem 1rem',
        marginBottom: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Tag & Year Badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '0.65rem',
        }}
      >
        <BrutalistBadge color="var(--accent-pink)" size="sm">
          <Sparkles size={11} strokeWidth={3} />
          <span>LEAVE ARBITRAGE ENGINE</span>
        </BrutalistBadge>

        <BrutalistBadge color="var(--accent-cyan)" size="sm">
          MALAYSIA • 2026
        </BrutalistBadge>
      </div>

      {/* Main Punchy Heading */}
      <h2
        style={{
          fontSize: '1.75rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '-0.8px',
          lineHeight: 1.05,
          margin: '0 0 0.5rem 0',
          color: 'var(--text-color)',
        }}
      >
        HACK YOUR ANNUAL LEAVE.
      </h2>

      {/* Value Proposition Subheading */}
      <p
        style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          lineHeight: 1.45,
          color: 'var(--text-color)',
          margin: '0 0 0.85rem 0',
        }}
      >
        Turn <strong>14 days of Annual Leave</strong> into <strong>40+ contiguous days off</strong> by mathematically bridging company-observed public holidays with weekends.
      </p>

      {/* Reality Check Note */}
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          border: '2px solid var(--border-color)',
          borderRadius: 'var(--border-radius-sm)',
          padding: '0.55rem 0.75rem',
          marginBottom: '0.95rem',
          fontSize: '0.74rem',
          fontWeight: 600,
          lineHeight: 1.35,
          color: 'var(--text-color)',
        }}
      >
        <strong>⚠️ No Fake Promises:</strong> Viral social media infographics assume everyone gets 20 public holidays. Under <strong>Employment Act 1955 (Section 60D)</strong>, your company might only grant <strong>11 days</strong>. CutiReady tailors calculations to your exact company policy and state.
      </div>

      {/* 3 Core Benefit Chips */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.35rem',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1.5px solid var(--border-color)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.4rem 0.25rem',
            textAlign: 'center',
            boxShadow: '1px 1px 0px var(--border-color)',
          }}
        >
          <Calendar size={13} style={{ margin: '0 auto 0.15rem auto' }} />
          <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase' }}>
            EA 1955 RULES
          </div>
          <div style={{ fontSize: '0.58rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Cuti Ganti math
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1.5px solid var(--border-color)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.4rem 0.25rem',
            textAlign: 'center',
            boxShadow: '1px 1px 0px var(--border-color)',
          }}
        >
          <Sparkles size={13} style={{ margin: '0 auto 0.15rem auto' }} />
          <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase' }}>
            UP TO 4.5X ROI
          </div>
          <div style={{ fontSize: '0.58rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Max contiguous
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1.5px solid var(--border-color)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.4rem 0.25rem',
            textAlign: 'center',
            boxShadow: '1px 1px 0px var(--border-color)',
          }}
        >
          <ShieldCheck size={13} style={{ margin: '0 auto 0.15rem auto' }} />
          <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase' }}>
            100% OFFLINE
          </div>
          <div style={{ fontSize: '0.58rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Zero data stored
          </div>
        </div>
      </div>

      {/* CTA Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.5rem' }}>
        <BrutalistButton
          color="var(--accent-yellow)"
          size="md"
          onClick={onScrollToPlanner}
        >
          <ArrowDown size={16} strokeWidth={2.5} />
          <span>FIND BRIDGES</span>
        </BrutalistButton>

        <BrutalistButton
          color="var(--bg-primary)"
          size="md"
          onClick={onToggleHowToUse}
        >
          <HelpCircle size={15} strokeWidth={2.5} />
          <span>{isHowToUseOpen ? 'CLOSE GUIDE' : 'HOW TO USE'}</span>
        </BrutalistButton>
      </div>
    </div>
  );
}
