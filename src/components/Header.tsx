import { useState, useRef, useEffect } from 'react';
import { useLeaveStore } from '../store/useLeaveStore';
import { getTranslations } from '../i18n/translations';
import { Settings, RefreshCw, HelpCircle, Check, Languages } from 'lucide-react';

interface HeaderProps {
  onOpenHelp?: () => void;
}

export function Header({ onOpenHelp }: HeaderProps) {
  const { resetToDefaults, language, setLanguage } = useLeaveStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const t = getTranslations(language);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleReset = () => {
    if (window.confirm(t.header.resetConfirm)) {
      resetToDefaults();
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        width: '100%',
        position: 'relative',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
        {onOpenHelp && (
          <button
            type="button"
            onClick={onOpenHelp}
            title={t.header.guideTitle}
            style={{
              backgroundColor: 'var(--accent-yellow)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.42rem 0.6rem',
              cursor: 'pointer',
              boxShadow: '1.5px 1.5px 0px var(--border-color)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.7rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: 'var(--accent-yellow-text)',
            }}
          >
            <HelpCircle size={13} />
            <span>{t.header.guide}</span>
          </button>
        )}

        {/* Top Right Gear Icon Button */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            title={t.header.settingsTitle}
            aria-label={t.header.settingsTitle}
            aria-expanded={isMenuOpen}
            style={{
              backgroundColor: isMenuOpen ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '0.42rem 0.5rem',
              cursor: 'pointer',
              boxShadow: isMenuOpen ? '0px 0px 0px var(--border-color)' : '1.5px 1.5px 0px var(--border-color)',
              transform: isMenuOpen ? 'translate(1.5px, 1.5px)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-color)',
              transition: 'all 0.08s ease',
            }}
          >
            <Settings size={15} strokeWidth={2.5} color="var(--border-color)" />
          </button>

          {/* Neobrutalist Settings Dropdown Menu */}
          {isMenuOpen && (
            <div
              role="menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                backgroundColor: 'var(--bg-secondary)',
                border: 'var(--border-width) solid var(--border-color)',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
                zIndex: 100,
                overflow: 'hidden',
                animation: 'popoverIn 0.12s ease-out',
              }}
            >
              {/* Header Title */}
              <div
                style={{
                  backgroundColor: 'var(--accent-yellow)',
                  borderBottom: 'var(--border-width) solid var(--border-color)',
                  padding: '0.45rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Settings size={13} strokeWidth={3} />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {t.header.settingsTitle}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-pill)',
                    padding: '0.1rem 0.4rem',
                  }}
                >
                  {language === 'en' ? 'EN' : 'MY'}
                </span>
              </div>

              <div
                style={{
                  padding: '0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                {/* Item 1: Reset */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.55rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.35rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <RefreshCw size={12} color="var(--text-color)" />
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px',
                        }}
                      >
                        1. {t.header.resetTitle}
                      </span>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      margin: '0 0 0.45rem 0',
                      lineHeight: 1.3,
                    }}
                  >
                    {t.header.resetDesc}
                  </p>

                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '2px solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      padding: '0.38rem 0.5rem',
                      cursor: 'pointer',
                      boxShadow: '1.5px 1.5px 0px var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      color: 'var(--text-color)',
                      transition: 'all 0.08s ease',
                    }}
                  >
                    <RefreshCw size={11} />
                    <span>{t.header.resetButton}</span>
                  </button>
                </div>

                {/* Item 2: Change Language */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.55rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      marginBottom: '0.45rem',
                    }}
                  >
                    <Languages size={13} color="var(--text-color)" />
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.4px',
                      }}
                    >
                      2. {t.header.changeLanguage}
                    </span>
                  </div>

                  {/* Two options only */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {/* Option 1: Manglish (Default) */}
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('manglish');
                        setIsMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor:
                          language === 'manglish' ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                        border: '2px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        padding: '0.4rem 0.55rem',
                        cursor: 'pointer',
                        boxShadow:
                          language === 'manglish'
                            ? '0px 0px 0px var(--border-color)'
                            : '1.5px 1.5px 0px var(--border-color)',
                        transform: language === 'manglish' ? 'translate(1px, 1px)' : 'none',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: 'var(--text-color)',
                        transition: 'all 0.08s ease',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>1.</span>
                        <span>{t.header.manglish}</span>
                      </span>
                      {language === 'manglish' && <Check size={13} strokeWidth={3} />}
                    </button>

                    {/* Option 2: English */}
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('en');
                        setIsMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor:
                          language === 'en' ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                        border: '2px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        padding: '0.4rem 0.55rem',
                        cursor: 'pointer',
                        boxShadow:
                          language === 'en'
                            ? '0px 0px 0px var(--border-color)'
                            : '1.5px 1.5px 0px var(--border-color)',
                        transform: language === 'en' ? 'translate(1px, 1px)' : 'none',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: 'var(--text-color)',
                        transition: 'all 0.08s ease',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>2.</span>
                        <span>{t.header.english}</span>
                      </span>
                      {language === 'en' && <Check size={13} strokeWidth={3} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
