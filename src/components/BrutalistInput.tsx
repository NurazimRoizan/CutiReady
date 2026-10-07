import type { CSSProperties } from 'react';

export interface BrutalistInputProps {
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  autoUppercase?: boolean;
  type?: string;
  min?: number;
  max?: number;
  style?: CSSProperties;
  className?: string;
}

export function BrutalistInput({
  value,
  onChange,
  placeholder,
  label,
  helperText,
  autoUppercase = false,
  type = 'text',
  min,
  max,
  style = {},
  className = '',
}: BrutalistInputProps) {
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
      <input
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(autoUppercase ? e.target.value.toUpperCase() : e.target.value)
        }
        placeholder={placeholder}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: 'var(--bg-secondary)',
          border: 'var(--border-width) solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          padding: '0.65rem 0.85rem',
          fontSize: '0.95rem',
          fontWeight: 700,
          color: 'var(--text-color)',
          outline: 'none',
          boxShadow: '2px 2px 0px var(--border-color)',
          ...style,
        }}
      />
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
