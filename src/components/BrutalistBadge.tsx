import type { ReactNode, CSSProperties } from 'react';

export interface BrutalistBadgeProps {
  children: ReactNode;
  color?: string;
  textColor?: string;
  style?: CSSProperties;
  className?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
  title?: string;
}

export function BrutalistBadge({
  children,
  color = 'var(--accent-cyan)',
  textColor,
  style = {},
  className = '',
  size = 'md',
  onClick,
  title,
}: BrutalistBadgeProps) {
  const isSmall = size === 'sm';

  return (
    <span
      className={className}
      onClick={onClick}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.35rem',
        backgroundColor: color,
        color:
          textColor ||
          (color === 'var(--accent-yellow)' || color === 'var(--accent-purple)'
            ? 'var(--accent-yellow-text)'
            : 'var(--text-color)'),
        border: '2px solid var(--border-color)',
        borderRadius: 'var(--border-radius-pill)',
        padding: isSmall ? '0.15rem 0.45rem' : '0.25rem 0.65rem',
        fontSize: isSmall ? '0.7rem' : '0.78rem',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        lineHeight: 1.2,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
