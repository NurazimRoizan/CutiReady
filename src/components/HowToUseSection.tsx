import { BrutalistCard } from './BrutalistCard';
import { BrutalistBadge } from './BrutalistBadge';
import { MapPin, Sliders, CalendarCheck, Download, ChevronUp, CheckCircle2 } from 'lucide-react';

interface HowToUseSectionProps {
  onClose: () => void;
}

export function HowToUseSection({ onClose }: HowToUseSectionProps) {
  const steps = [
    {
      step: '01',
      title: 'Set Your Work Location',
      icon: MapPin,
      badgeColor: 'var(--accent-yellow)',
      badgeText: 'REST DAYS',
      description:
        'Different states observe different weekends. Select your state (e.g. Selangor = Sat–Sun; Kedah = Fri–Sat). Rest days and state-specific holidays configure instantly.',
    },
    {
      step: '02',
      title: 'Match Company Holiday Policy',
      icon: Sliders,
      badgeColor: 'var(--accent-cyan)',
      badgeText: 'POLICY',
      description:
        'Select whether your employer follows Statutory Minimum (11 days under EA 1955), Corporate Standard (15 days), or All Gazetted Holidays. Toggle Saturday Cuti Ganti if observed.',
    },
    {
      step: '03',
      title: 'Discover & Lock In Bridges',
      icon: CalendarCheck,
      badgeColor: 'var(--accent-pink)',
      badgeText: 'ARBITRAGE',
      description:
        'Browse calculated leave windows. Look for natural 0 AL breaks or Mega Bridges (≥4.0x ROI). Tap "+ Plan Leave" to track against your annual quota.',
    },
    {
      step: '04',
      title: 'Export to Calendar & HR',
      icon: Download,
      badgeColor: 'var(--accent-green)',
      badgeText: 'EXPORT',
      description:
        'Export native .ICS files to Google Calendar or Apple Calendar, or click "Copy Dates" to get a pre-formatted message ready for Slack or your HR leave portal.',
    },
  ];

  return (
    <BrutalistCard
      headerColor="var(--accent-cyan)"
      title="HOW CUTIREADY WORKS"
      subtitle="4-STEP GUIDE"
      headerAction={
        <button
          type="button"
          onClick={onClose}
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
          <span>CLOSE</span>
          <ChevronUp size={13} strokeWidth={3} />
        </button>
      }
      style={{ marginBottom: '1.25rem' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {steps.map((item) => (
          <div
            key={item.step}
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.75rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              boxShadow: '2px 2px 0px var(--border-color)',
            }}
          >
            <div
              style={{
                backgroundColor: item.badgeColor,
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '0.35rem 0.45rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                minWidth: '38px',
                textAlign: 'center',
              }}
            >
              <item.icon size={16} strokeWidth={2.5} color="var(--border-color)" />
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  marginTop: '0.15rem',
                  lineHeight: 1,
                }}
              >
                {item.step}
              </span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  flexWrap: 'wrap',
                  marginBottom: '0.2rem',
                }}
              >
                <h4
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    margin: 0,
                    letterSpacing: '0.3px',
                  }}
                >
                  {item.title}
                </h4>
                <BrutalistBadge size="sm" color={item.badgeColor}>
                  {item.badgeText}
                </BrutalistBadge>
              </div>

              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-color)',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '0.85rem',
          paddingTop: '0.65rem',
          borderTop: '2px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
        }}
      >
        <CheckCircle2 size={14} color="var(--text-color)" />
        <span>Ready to begin? Adjust controls below and pick your holidays.</span>
      </div>
    </BrutalistCard>
  );
}
