import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BrutalistButton } from './BrutalistButton';
import { BrutalistBadge } from './BrutalistBadge';
import { X, Palette } from 'lucide-react';

interface LegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LegendModal({ isOpen, onClose }: LegendModalProps) {
  // Close on ESC key press & lock background scrolling
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

  const calendarColors = [
    {
      badge: <BrutalistBadge size="sm" color="var(--ph-bg)" textColor="var(--ph-text)">🌿 Cuti Umum (PH)</BrutalistBadge>,
      title: 'Gazetted Public Holiday',
      desc: 'Cuti am rasmi kerajaan / gazet negeri (Seafoam Mint). Gaji jalan, 0 AL ditolak.',
    },
    {
      badge: <BrutalistBadge size="sm" color="var(--replacement-bg)" textColor="var(--replacement-text)">🌙 Cuti Ganti</BrutalistBadge>,
      title: 'Replacement Holiday',
      desc: 'Bila PH jatuh hari weekend / rehat, automatik diganti ke hari bekerja seterusnya (Slate Plum).',
    },
    {
      badge: <BrutalistBadge size="sm" color="var(--al-bg)" textColor="var(--al-text)">🌸 Ambil AL</BrutalistBadge>,
      title: 'Recommended Annual Leave',
      desc: 'Hari kerja strategik diapit cuti & weekend (Raspberry Coral). Apply AL hari ni untuk unlock cuti panjang!',
    },
    {
      badge: <BrutalistBadge size="sm" color="var(--weekend-bg)" textColor="var(--weekend-text)">⚪ Weekend</BrutalistBadge>,
      title: 'Hari Rehat Mingguan',
      desc: 'Sabtu & Ahad (atau Jumaat & Sabtu untuk Kedah, Kelantan, Terengganu).',
    },
  ];

  const cardBadges = [
    {
      badge: <BrutalistBadge size="sm" color="var(--accent-cyan)">⚡ 0 AL • Free Cuti</BrutalistBadge>,
      desc: 'Long weekend semulajadi tanpa tolak walau sehari pun baki AL korang (Seafoam Mint)!',
    },
    {
      badge: <BrutalistBadge size="sm" color="var(--accent-yellow)">🔥 Mega ROI (≥4x)</BrutalistBadge>,
      desc: 'Paling untung! Apply 1–2 hari AL dapat lepak 5–9 hari cuti bersambung (Raspberry Coral).',
    },
    {
      badge: <BrutalistBadge size="sm" color="var(--accent-pink)">🌸 Burn [X] AL</BrutalistBadge>,
      desc: 'Bilangan hari cuti tahunan yang perlu diapply untuk jayakan bridge ni (Slate Plum).',
    },
    {
      badge: <BrutalistBadge size="sm" color="var(--accent-green)">✓ Dah Lock</BrutalistBadge>,
      desc: 'Cuti yang korang dah simpan ke dalam dossier peribadi (Seafoam Mint).',
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
          maxWidth: '480px',
          maxHeight: '88vh',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Palette size={18} strokeWidth={2.5} color="var(--accent-yellow-text)" />
            <h2
              style={{
                fontSize: '0.95rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: 0,
                color: 'var(--accent-yellow-text)',
              }}
            >
              Panduan Warna & Simbol
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup panduan legend"
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
            gap: '1rem',
          }}
        >
          {/* Section 1: Strip Kalendar */}
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.5rem',
                color: 'var(--text-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>🗓️ Warna Strip Kalendar (Hari Ke Hari)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {calendarColors.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.5rem 0.65rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {item.badge}
                    <span style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase' }}>
                      {item.title}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      margin: 0,
                      lineHeight: 1.35,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Badge Kad */}
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.5rem',
                color: 'var(--text-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>🃏 Simbol & Badge Pada Kad Cuti</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {cardBadges.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.5rem 0.65rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {item.badge}
                  </div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      margin: 0,
                      lineHeight: 1.35,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
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
            FAHAM, DAH CLEAR!
          </BrutalistButton>
        </div>
      </div>
    </div>,
    document.body
  );
}
