import { useLeaveStore } from '../store/useLeaveStore';
import { RefreshCw, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenHelp?: () => void;
}

export function Header({ onOpenHelp }: HeaderProps) {
  const { resetToDefaults } = useLeaveStore();

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        width: '100%',
      }}
    >
      {/* Brand on Left */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
            lineHeight: 0.95,
            margin: 0,
            color: 'var(--text-color)',
            whiteSpace: 'nowrap',
          }}
        >
          CUTI
        </h1>
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
            lineHeight: 0.95,
            margin: 0,
            color: 'var(--text-color)',
            whiteSpace: 'nowrap',
          }}
        >
          READY
        </h1>
      </div>

      {/* Action Buttons on Top Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Betul ke nak reset semua setting balik asal bossku?')) {
              resetToDefaults();
            }
          }}
          title="Reset semua ke default"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '2px solid var(--border-color)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.38rem 0.55rem',
            cursor: 'pointer',
            boxShadow: '1.5px 1.5px 0px var(--border-color)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.68rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: 'var(--text-color)',
          }}
        >
          <RefreshCw size={12} color="var(--border-color)" />
          <span>RESET</span>
        </button>

        {onOpenHelp && (
          <button
            type="button"
            onClick={onOpenHelp}
            title="Cara guna & panduan cuti"
            style={{
              backgroundColor: 'var(--accent-yellow)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.38rem 0.55rem',
              cursor: 'pointer',
              boxShadow: '1.5px 1.5px 0px var(--border-color)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.68rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: 'var(--accent-yellow-text)',
            }}
          >
            <HelpCircle size={13} />
            <span>PANDUAN</span>
          </button>
        )}
      </div>
    </header>
  );
}
