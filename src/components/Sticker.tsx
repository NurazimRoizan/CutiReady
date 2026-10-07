import type { ReactNode, CSSProperties } from 'react';

export interface StickerProps {
  children: ReactNode;
  color?: string;
  rotation?: number;
  style?: CSSProperties;
  className?: string;
}

export function Sticker({
  children,
  color = 'var(--bg-secondary)',
  rotation = -2,
  style = {},
  className = '',
}: StickerProps) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        backgroundColor: color,
        border: 'var(--border-width) solid var(--border-color)',
        padding: '0.4rem 0.85rem',
        fontWeight: 900,
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
        transform: `rotate(${rotation}deg)`,
        userSelect: 'none',
        lineHeight: 1.2,
        color: 'var(--text-color)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
