import { AppTab } from '../types';
import { Zap, CalendarCheck, Settings } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
  bridgesCount: number;
  plannedCount: number;
  observedCount: number;
}

export function BottomNavBar({
  currentTab,
  onChangeTab,
  bridgesCount,
  plannedCount,
  observedCount,
}: BottomNavBarProps) {
  const tabs = [
    {
      id: 'BRIDGES' as AppTab,
      label: 'Bridges',
      icon: Zap,
      badge: bridgesCount > 0 ? `${bridgesCount}` : undefined,
      badgeColor: 'var(--accent-cyan)',
    },
    {
      id: 'PLAN' as AppTab,
      label: 'My Cuti',
      icon: CalendarCheck,
      badge: `${plannedCount}`,
      badgeColor: plannedCount > 0 ? 'var(--accent-pink)' : 'var(--weekend-bg)',
    },
    {
      id: 'RULES' as AppTab,
      label: 'Holiday',
      icon: Settings,
      badge: `${observedCount}`,
      badgeColor: 'var(--accent-yellow)',
    },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '560px',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: 'var(--border-width) solid var(--border-color)',
        zIndex: 50,
        padding: '0.45rem 0.5rem calc(0.45rem + env(safe-area-inset-bottom, 0px)) 0.5rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.45rem',
        }}
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                backgroundColor: isActive ? 'var(--accent-yellow)' : 'var(--bg-secondary)',
                border: 'var(--border-width) solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '0.45rem 0.2rem',
                cursor: 'pointer',
                boxShadow: isActive
                  ? '0px 0px 0px var(--border-color)'
                  : '2px 2px 0px var(--border-color)',
                transform: isActive ? 'translate(2px, 2px)' : 'none',
                transition: 'all 0.08s ease',
                position: 'relative',
                userSelect: 'none',
              }}
            >
              {tab.badge !== undefined && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '6px',
                    backgroundColor: tab.badgeColor,
                    color: 'var(--text-color)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-pill)',
                    fontSize: '0.62rem',
                    fontWeight: 900,
                    padding: '0.05rem 0.35rem',
                    lineHeight: 1,
                  }}
                >
                  {tab.badge}
                </span>
              )}

              <Icon
                size={18}
                strokeWidth={isActive ? 3 : 2.2}
                color={isActive ? 'var(--accent-yellow-text)' : 'var(--text-color)'}
              />

              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  color: isActive ? 'var(--accent-yellow-text)' : 'var(--text-color)',
                  lineHeight: 1,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
