import { BrutalistButton } from './BrutalistButton';

interface HowToUseSectionProps {
  onClose: () => void;
}

export function HowToUseSection({ onClose }: HowToUseSectionProps) {
  const steps = [
    {
      step: '01',
      title: 'Pick Your State & Rest Days',
      emoji: '📍',
      pill: 'Rest Day Math',
      bgColor: 'var(--bg-secondary)',
      description:
        'Different Malaysian states observe different weekends. Select your state (e.g. Selangor / KL = Sat–Sun; Kedah / Kelantan / Terengganu = Fri–Sat). Rest days and state-specific gazetted holidays adjust instantly.',
    },
    {
      step: '02',
      title: 'Match Your Company Policy',
      emoji: '🏢',
      pill: 'EA 1955 Section 60D',
      bgColor: 'var(--bg-secondary)',
      description:
        'Select whether your employer follows Statutory Minimum (11 days under Employment Act 1955), Corporate Standard (15 days), or All Gazetted Holidays. Toggle Saturday Cuti Ganti if observed by your company.',
    },
    {
      step: '03',
      title: 'Discover & Lock In Combo Cuti',
      emoji: '🎯',
      pill: 'Up to 4.5x ROI',
      bgColor: 'var(--bg-secondary)',
      description:
        'Browse mathematically discovered leave windows. Look for natural 0 AL breaks or Mega Combos (≥4.0x ROI). Tap "+ Plan Leave" to lock dates into your annual leave quota.',
    },
    {
      step: '04',
      title: 'Export to Calendar or Slack/HR',
      emoji: '📅',
      pill: '1-Click Export',
      bgColor: 'var(--bg-secondary)',
      description:
        'Download native RFC 5545 .ICS files directly to Google Calendar or Apple Calendar, or click "Copy Dates" to get a pre-formatted message ready to paste into Slack, email, or your HR portal.',
    },
  ];

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '0.4rem',
          fontSize: '1.55rem',
          textTransform: 'uppercase',
          letterSpacing: '-0.5px',
          fontWeight: 900,
          color: 'var(--text-color)',
        }}
      >
        How Leave Arbitrage Works
      </h2>
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.9rem',
          fontWeight: 700,
          opacity: 0.8,
          margin: '0 auto 1.5rem auto',
          color: 'var(--text-color)',
        }}
      >
        4 steps to maximize your time off without burning all your leave.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {steps.map((item) => (
          <div
            key={item.step}
            style={{
              backgroundColor: item.bgColor,
              padding: '1.25rem 1.15rem',
              margin: 0,
              borderRadius: 'var(--border-radius)',
              border: 'var(--border-width) solid var(--border-color)',
              boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
                flexWrap: 'wrap',
                gap: '0.4rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{item.emoji}</span>
                <h3
                  style={{
                    fontSize: '1.05rem',
                    margin: 0,
                    textTransform: 'uppercase',
                    fontWeight: 900,
                    letterSpacing: '0.3px',
                    color: 'var(--text-color)',
                  }}
                >
                  Step {item.step}: {item.title}
                </h3>
              </div>
              <span
                style={{
                  backgroundColor: 'var(--border-color)',
                  color: 'var(--bg-secondary)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                {item.pill}
              </span>
            </div>
            <p
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                lineHeight: '1.45',
                margin: 0,
                color: 'var(--text-color)',
              }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
        <BrutalistButton
          color="var(--accent-yellow)"
          size="sm"
          onClick={onClose}
          style={{ width: '100%' }}
        >
          GOT IT — SHOW ME COMBO CUTI ↑
        </BrutalistButton>
      </div>
    </section>
  );
}
