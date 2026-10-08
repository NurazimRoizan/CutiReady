import type { ReactNode, CSSProperties } from 'react';

export interface BrutalistCardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  headerColor?: string;
  headerTextColor?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  noPadding?: boolean;
}

export function BrutalistCard({
  title,
  subtitle,
  headerColor = 'var(--accent-yellow)',
  headerTextColor,
  headerAction,
  children,
  style = {},
  className = '',
  noPadding = false,
}: BrutalistCardProps) {
  const computedHeaderTextColor =
    headerTextColor ||
    (headerColor === 'var(--accent-yellow)' || headerColor === 'var(--accent-purple)'
      ? 'var(--accent-yellow-text)'
      : 'var(--text-color)');

  return (
    <div
      className={className}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: 'var(--border-width) solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
        overflow: 'hidden',
        marginBottom: '1rem',
        ...style,
      }}
    >
      {(title || subtitle || headerAction) && (
        <div
          style={{
            backgroundColor: headerColor,
            borderBottom: 'var(--border-width) solid var(--border-color)',
            padding: '0.65rem 0.9rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
            color: computedHeaderTextColor,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  lineHeight: 1.2,
                  color: computedHeaderTextColor,
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  opacity: 0.85,
                  letterSpacing: '0.3px',
                  color: computedHeaderTextColor,
                }}
              >
                {subtitle}
              </span>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div style={{ padding: noPadding ? 0 : '1rem' }}>{children}</div>
    </div>
  );
}
