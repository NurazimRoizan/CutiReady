import { FilterTabType } from '../types';

interface FilterTabsProps {
  activeTab: FilterTabType;
  onChangeTab: (tab: FilterTabType) => void;
  counts: Record<FilterTabType, number>;
}

export function FilterTabs({ activeTab, onChangeTab, counts }: FilterTabsProps) {
  const tabs: { id: FilterTabType; label: string }[] = [
    { id: 'ALL', label: 'SEMUA' },
    { id: 'HIGH_ROI', label: 'ROI PADU' },
    { id: 'ZERO_AL', label: 'FREE (0 AL)' },
    { id: 'Q1', label: 'Q1' },
    { id: 'Q2', label: 'Q2' },
    { id: 'Q3', label: 'Q3' },
    { id: 'Q4', label: 'Q4' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.4rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '0.85rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = counts[tab.id] ?? 0;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: isActive
                ? 'var(--accent-yellow)'
                : 'var(--bg-secondary)',
              color: isActive ? 'var(--accent-yellow-text)' : 'var(--text-color)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-pill)',
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              cursor: 'pointer',
              boxShadow: isActive
                ? '2px 2px 0px var(--border-color)'
                : '1px 1px 0px var(--border-color)',
              userSelect: 'none',
              transition: 'all 0.08s ease',
            }}
          >
            <span>{tab.label}</span>
            <span
              style={{
                fontSize: '0.65rem',
                backgroundColor: isActive ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-pill)',
                padding: '0.05rem 0.35rem',
                lineHeight: 1.1,
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
