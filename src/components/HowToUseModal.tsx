import { BrutalistButton } from './BrutalistButton';
import { X, HelpCircle } from 'lucide-react';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Pick State & Rest Days',
      emoji: '📍',
      pill: 'Rest Day Rules',
      description:
        'Different Malaysian states observe different weekends (KL/Selangor = Sat–Sun; Kedah/Kelantan/Terengganu = Fri–Sat). Rest days and state-specific gazetted holidays adjust dynamically.',
    },
    {
      step: '02',
      title: 'Match Your Company Policy',
      emoji: '🏢',
      pill: 'EA 1955 Sec 60D',
      description:
        'Select whether your employer follows Statutory Minimum (11 days under Employment Act 1955), Corporate Standard (15 days), or All Gazetted Holidays. Toggle Saturday Cuti Ganti if observed.',
    },
    {
      step: '03',
      title: 'Discover & Lock In Bridges',
      emoji: '🎯',
      pill: 'Up to 4.5x ROI',
      description:
        'Browse mathematically discovered leave windows. Look for natural 0 AL breaks or Mega Bridges (≥4.0x ROI). Tap "+ Add to Plan" to lock dates into your annual leave quota.',
    },
    {
      step: '04',
      title: 'Export to Calendar or Slack/HR',
      emoji: '📅',
      pill: '1-Click Export',
      description:
        'Head over to the "My Plan" tab to download unified RFC 5545 .ics calendar files or copy pre-formatted WhatsApp/Slack leave requests for your manager.',
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: 'var(--border-width) solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          boxShadow: '6px 6px 0px var(--border-color)',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: 'var(--accent-yellow)',
            borderBottom: 'var(--border-width) solid var(--border-color)',
            padding: '0.85rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <HelpCircle size={20} strokeWidth={2.5} color="var(--border-color)" />
            <h2
              style={{
                fontSize: '1rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: 0,
                color: 'var(--text-color)',
              }}
            >
              How Leave Arbitrage Works
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close onboarding modal"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '2px 2px 0px var(--border-color)',
            }}
          >
            <X size={18} color="var(--border-color)" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {steps.map((item) => (
            <div
              key={item.step}
              style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '0.85rem',
                borderRadius: 'var(--border-radius-sm)',
                border: '2px solid var(--border-color)',
                boxShadow: '2px 2px 0px var(--border-color)',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>{item.emoji}</span>
                  <h3
                    style={{
                      fontSize: '0.9rem',
                      margin: 0,
                      textTransform: 'uppercase',
                      fontWeight: 900,
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
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                >
                  {item.pill}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  lineHeight: '1.4',
                  margin: 0,
                  color: 'var(--text-color)',
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderTop: 'var(--border-width) solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          <BrutalistButton
            color="var(--accent-yellow)"
            size="sm"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            GOT IT — LET'S PLAN LEAVE!
          </BrutalistButton>
        </div>
      </div>
    </div>
  );
}
