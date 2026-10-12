import { useState, useEffect } from 'react';
import { useLeaveStore, isEnglishPath } from '../store/useLeaveStore';
import { Languages, X } from 'lucide-react';

const STORAGE_KEY = 'cutiready_dismissed_lang_toast';

export function LanguageToastBanner() {
  const { language, setLanguage } = useLeaveStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if:
    // 1. Current language is manglish
    // 2. URL is not explicitly /en
    // 3. User hasn't previously dismissed this banner
    // 4. Browser locale indicates English preference (e.g., en, en-US, en-GB, en-SG)
    if (language !== 'manglish' || isEnglishPath()) {
      setIsVisible(false);
      return;
    }

    try {
      const isDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
      if (isDismissed) {
        setIsVisible(false);
        return;
      }

      const browserLocale = (navigator.language || '').toLowerCase();
      // Show for English-configured browsers/systems
      if (browserLocale.startsWith('en')) {
        // Slight delay to allow smooth page load entrance
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage access failures
    }
  }, [language]);

  if (!isVisible) return null;

  const handleSwitchToEnglish = () => {
    setLanguage('en');
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  return (
    <aside
      aria-label="Language recommendation banner"
      style={{
        position: 'fixed',
        bottom: 'calc(4.75rem + env(safe-area-inset-bottom, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 1.5rem)',
        maxWidth: '520px',
        backgroundColor: 'var(--bg-secondary)',
        border: 'var(--border-width) solid var(--border-color)',
        borderRadius: 'var(--border-radius-pill)',
        boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
        padding: '0.45rem 0.65rem 0.45rem 0.85rem',
        boxSizing: 'border-box',
        zIndex: 45,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
        animation: 'popoverIn 0.15s ease-out',
      }}
    >
      {/* Icon & Label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          minWidth: 0,
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--accent-yellow)',
            border: '1.5px solid var(--border-color)',
            borderRadius: 'var(--border-radius-pill)',
            padding: '0.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Languages size={13} color="var(--border-color)" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontSize: 'clamp(0.68rem, 2.7vw, 0.74rem)',
            fontWeight: 800,
            color: 'var(--text-color)',
            whiteSpace: 'nowrap',
          }}
        >
          Prefer English?
        </span>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={handleSwitchToEnglish}
          style={{
            backgroundColor: 'var(--accent-yellow)',
            border: '2px solid var(--border-color)',
            borderRadius: 'var(--border-radius-pill)',
            padding: '0.25rem 0.65rem',
            fontSize: '0.68rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: 'var(--accent-yellow-text)',
            cursor: 'pointer',
            boxShadow: '1.5px 1.5px 0px var(--border-color)',
            lineHeight: 1.2,
            transition: 'all 0.08s ease',
          }}
        >
          Switch to EN
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          title="Dismiss language prompt"
          aria-label="Dismiss language prompt"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            borderRadius: 'var(--border-radius-pill)',
          }}
        >
          <X size={15} strokeWidth={2.5} />
        </button>
      </div>
    </aside>
  );
}
