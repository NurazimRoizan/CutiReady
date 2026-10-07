import type { CSSProperties } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
}

export interface BrutalistSelectProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  style?: CSSProperties;
  className?: string;
  helperText?: string;
}

export function BrutalistSelect({
  label,
  value,
  onChange,
  options,
  style = {},
  className = '',
  helperText,
}: BrutalistSelectProps) {
  return (
    <div className={className} style={{ marginBottom: '0.85rem' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontWeight: 900,
            fontSize: '0.82rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '0.3rem',
            color: 'var(--text-color)',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: 'var(--bg-secondary)',
            border: 'var(--border-width) solid var(--border-color)',
            borderRadius: 'var(--border-radius)',
            padding: '0.65rem 2rem 0.65rem 0.85rem',
            fontSize: '0.92rem',
            fontWeight: 800,
            color: 'var(--text-color)',
            outline: 'none',
            cursor: 'pointer',
            boxShadow: '2px 2px 0px var(--border-color)',
            appearance: 'none',
            WebkitAppearance: 'none',
            ...style,
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} {opt.badge ? `(${opt.badge})` : ''}
            </option>
          ))}
        </select>
        <span
          style={{
            position: 'absolute',
            right: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            fontWeight: 900,
            fontSize: '0.75rem',
          }}
        >
          ▼
        </span>
      </div>
      {helperText && (
        <span
          style={{
            display: 'block',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginTop: '0.25rem',
          }}
        >
          {helperText}
        </span>
      )}
    </div>
  );
}
