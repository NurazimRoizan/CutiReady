import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BrutalistButton } from './BrutalistButton';
import { X, HelpCircle } from 'lucide-react';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToUseModal({ isOpen, onClose }: HowToUseModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Pilih Negeri Tempat Kerja',
      emoji: '📍',
      pill: 'Rules Weekend',
      description:
        'Negeri lain, hari cuti & weekend lain bro:\n• KL / Selangor = Sabtu–Ahad\n• Kedah / Kelantan / Terengganu = Jumaat–Sabtu\n\nSistem auto-adjust cuti gazet ikut negeri korang!',
    },
    {
      step: '02',
      title: 'Match Polisi Syarikat',
      emoji: '🏢',
      pill: 'EA 1955 Seksyen 60D',
      description:
        'Company korang ikut Minima Akta (11 hari), Standard Korporat (15 hari), atau jenis boss pemurah (semua cuti gazet)?\n\nBoleh toggle Cuti Ganti hari Sabtu juga!',
    },
    {
      step: '03',
      title: 'Spot Bridge & Lock In Cepat',
      emoji: '🎯',
      pill: 'ROI Sampai 5x!',
      description:
        'Tengok kombo cuti yang auto-generate. Cari yang 0 AL (free cuti terus) atau Mega Bridge ROI padu.\n\nTekan "+ Lock Cuti" sebelum colleague lain sapu slot!',
    },
    {
      step: '04',
      title: 'Export & WhatsApp Boss',
      emoji: '📅',
      pill: '1-Click Settle',
      description:
        'Pergi tab "My Cuti" untuk download .ics masuk Google/Apple Calendar, atau copy terus ayat WhatsApp/Slack mesra-boss untuk mohon cuti!',
    },
  ];

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
      onClick={onClose}
    >
      <div
        className="neo-modal-content"
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
            <HelpCircle size={20} strokeWidth={2.5} color="var(--accent-yellow-text)" />
            <h2
              style={{
                fontSize: '1rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: 0,
                color: 'var(--accent-yellow-text)',
              }}
            >
              Cara Hack Cuti Macam Pro
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
                  alignItems: 'flex-start',
                  gap: '0.45rem',
                  marginBottom: '0.45rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.emoji}</span>
                  <h3
                    style={{
                      fontSize: '0.9rem',
                      margin: 0,
                      textTransform: 'uppercase',
                      fontWeight: 900,
                      color: 'var(--text-color)',
                      lineHeight: 1.2,
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
                    flexShrink: 0,
                  }}
                >
                  {item.pill}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  lineHeight: '1.45',
                  margin: 0,
                  color: 'var(--text-color)',
                  whiteSpace: 'pre-line',
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
            FAHAM, JOM TAPAU CUTI!
          </BrutalistButton>
        </div>
      </div>
    </div>,
    document.body
  );
}
