import { useState, type ReactNode, type CSSProperties, type MouseEvent } from 'react';

export interface BrutalistButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  color?: string;
  textColor?: string;
  href?: string;
  disabled?: boolean;
  style?: CSSProperties;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

export function BrutalistButton({
  children,
  onClick,
  color = 'var(--accent-yellow)',
  textColor,
  href,
  disabled = false,
  style = {},
  className = '',
  size = 'md',
  type = 'button',
  title,
}: BrutalistButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const paddingBySize = {
    sm: '0.4rem 0.75rem',
    md: '0.75rem 1.25rem',
    lg: '0.95rem 1.75rem',
  };

  const fontSizeBySize = {
    sm: '0.8rem',
    md: '0.95rem',
    lg: '1.1rem',
  };

  const computedTextColor =
    textColor ||
    (color === 'var(--accent-yellow)' || color === 'var(--accent-purple)'
      ? 'var(--accent-yellow-text)'
      : 'var(--text-color)');

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    backgroundColor: color,
    color: computedTextColor,
    border: 'var(--border-width) solid var(--border-color)',
    borderRadius: 'var(--border-radius)',
    padding: paddingBySize[size],
    fontSize: fontSizeBySize[size],
    fontWeight: 900,
    textTransform: 'uppercase',
    textDecoration: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    position: 'relative',
    transition: 'transform 0.08s ease, box-shadow 0.08s ease',
    userSelect: 'none',
    opacity: disabled ? 0.6 : 1,
    boxShadow:
      isPressed && !disabled
        ? '0px 0px 0px var(--border-color)'
        : 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
    transform:
      isPressed && !disabled
        ? 'translate(var(--shadow-offset), var(--shadow-offset))'
        : 'translate(0, 0)',
    lineHeight: 1.2,
    ...style,
  };

  const handlePressStart = () => {
    if (!disabled) setIsPressed(true);
  };

  const handlePressEnd = () => {
    if (!disabled) setIsPressed(false);
  };

  if (href && !disabled) {
    return (
      <a
        href={href}
        style={baseStyle}
        className={className}
        title={title}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      style={baseStyle}
      className={className}
      title={title}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
