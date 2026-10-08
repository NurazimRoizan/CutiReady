# CutiReady — Design System & Neobrutalist Component Registry

This document defines the Neobrutalist design tokens, CSS variables, component contracts, and strict negative styling constraints for `CutiReady`.

---

## 1. Negative Constraints (STRICT & VERBATIM)

Every agent modifying or writing UI code in `CutiReady` MUST abide by these rules:

> [!CAUTION]
> 1. **Zero Raw Hex in Components:** Hardcoded `#...` hex codes in JSX/TSX or inline styles are strictly forbidden. Always use CSS variables (`var(--...)`) defined in `:root`.
> 2. **Strict Component Reuse:** Never create ad-hoc buttons, custom cards, or duplicate container wrappers. Always compose existing shared primitives.
> 3. **Tactile Button Signature (Never Invert):**
>    - **Inactive state:** Raised with `4px 4px 0px #000` drop shadow and `transform: none`.
>    - **Active / Pressed state:** Mechanically pressed into the shadow with `transform: translate(var(--shadow-offset), var(--shadow-offset))` and `box-shadow: 0px 0px 0px`. Inverting this pattern breaks the signature tactile feel.
> 4. **Zero Blurred Shadows:** Drop shadows must be solid and directional (`box-shadow: 4px 4px 0px #000`). Blur radius must strictly be `0px`.
> 5. **Mobile-First Clamping:** The container MUST clamp to `maxWidth: 560px` centered. No horizontal table scrolling on 360px+ screens.
> 6. **Missing Primitives Gate:** If a required UI element is missing from this registry, STOP and propose it in the Plan & Audit checklist; do not invent it inline.

---

## 2. CSS Design Tokens & Base Variables

Place this `:root` definition in `src/index.css` (or main stylesheet):

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');

:root {
  /* Surfaces & Canvas */
  --bg-primary: #ffd6af;      /* Soft Apricot: Warm pastel canvas */
  --bg-secondary: #ffffff;    /* Pure crisp white: Cards, modals */
  --neutral-dark: #6b4b3e;    /* Mauve Bark: Deep espresso surfaces */

  /* High-Octane Accents (Wisteria & Camel Palette) */
  --accent-yellow: #bea7e5;   /* Wisteria: Primary CTA, active tabs, hero highlight */
  --accent-pink: #c49e85;     /* Camel: Secondary actions, subtle tags */
  --accent-cyan: #ffd6af;     /* Soft Apricot: Tertiary accents, chips */
  --accent-green: #bea7e5;    /* Wisteria: Confirmed / locked state */
  --accent-orange: #c49e85;   /* Camel: Highlight / alert tags */
  --accent-purple: #6b4b3e;   /* Mauve Bark: Dark contrast badge */

  /* Day Strip Semantic Tokens */
  --weekend-bg: #f8f4f9;      /* Ghost White pill for weekends */
  --weekend-text: #000000;    /* Solid black text on weekends */
  --ph-bg: #6b4b3e;           /* Mauve Bark pill for Public Holidays */
  --ph-text: #ffffff;         /* Crisp white text on Public Holidays */
  --replacement-bg: #c49e85;  /* Camel pill for Replacement Holidays (Cuti Ganti) */
  --replacement-text: #ffffff;/* Crisp white text on Replacement Holidays */
  --al-bg: #bea7e5;           /* Wisteria pill for recommended Annual Leave (AL) */
  --al-text: #000000;         /* Solid black text on Wisteria */
  --workday-bg: #f8f4f9;      /* Ghost White pill for regular workdays */
  --workday-text: #000000;    /* Solid black text on regular workdays */
  
  /* Text & Borders (Solid Black High-Contrast Ink) */
  --text-color: #000000;      /* Pure solid black typography */
  --text-muted: #555555;      /* Crisp dark charcoal secondary labels */
  --border-color: #000000;    /* Solid black chunky borders & directional 4px drop shadows */
  --border-subtle: #d1b8a5;   /* Warm card dividers */
  --danger-bg: #fde8e8;       /* Soft tinted danger background */

  /* Neobrutalist Geometry */
  --border-width: 3px;        /* Standard 3px chunky border */
  --border-width-thick: 4px;  /* Heavy 4px border for hero cards & buttons */
  --border-radius: 8px;       /* Standard card & button radius */
  --border-radius-sm: 6px;    /* Nested sub-card radius */
  --border-radius-pill: 100px;/* Pills & metric badges */
  --shadow-offset: 4px;       /* 4px solid offset */
}

/* Global Container Utility */
.neobrutalist-container {
  max-width: 560px;
  margin: 0 auto;
  padding: 1.25rem 1rem;
  width: 100%;
}
```

---

## 3. UI Component Registry

Always reuse or implement these canonical shared primitives in `src/components/`:

### 1. `BrutalistButton` (`src/components/BrutalistButton.jsx`)
The foundational tactile button and polymorphic link primitive.
```jsx
import React, { useState } from 'react';

export function BrutalistButton({ 
  children, 
  onClick, 
  color = 'var(--accent-yellow)', 
  href, 
  disabled = false,
  style = {} 
}) {
  const [isPressed, setIsPressed] = useState(false);

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color,
    color: 'var(--text-color)',
    border: 'var(--border-width) solid var(--border-color)',
    borderRadius: 'var(--border-radius)',
    padding: '0.85rem 1.5rem',
    fontSize: '1.05rem',
    fontWeight: '900',
    textTransform: 'uppercase',
    textDecoration: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    position: 'relative',
    transition: 'all 0.08s ease',
    userSelect: 'none',
    opacity: disabled ? 0.6 : 1,
    boxShadow: isPressed && !disabled
      ? '0px 0px 0px var(--border-color)' 
      : 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
    transform: isPressed && !disabled
      ? 'translate(var(--shadow-offset), var(--shadow-offset))' 
      : 'translate(0, 0)',
    ...style
  };

  const handleMouseDown = () => { if (!disabled) setIsPressed(true); };
  const handleMouseUp = () => { if (!disabled) setIsPressed(false); };
  const handleMouseLeave = () => { if (!disabled) setIsPressed(false); };

  if (href && !disabled) {
    return (
      <a 
        href={href} 
        style={baseStyle}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button 
      disabled={disabled}
      style={baseStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### 2. `BrutalistCard` (`src/components/BrutalistCard.jsx`)
Standard Neobrutalist card with optional colored header strip.
```jsx
import React from 'react';

export function BrutalistCard({ 
  title, 
  subtitle,
  headerColor = 'var(--accent-yellow)', 
  children, 
  style = {} 
}) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: 'var(--border-width) solid var(--border-color)',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
      overflow: 'hidden',
      marginBottom: '1rem',
      ...style
    }}>
      {title && (
        <div style={{
          backgroundColor: headerColor,
          borderBottom: 'var(--border-width) solid var(--border-color)',
          padding: '0.65rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '0.95rem', 
            fontWeight: 900, 
            textTransform: 'uppercase',
            letterSpacing: '0.5px' 
          }}>
            {title}
          </h3>
          {subtitle && (
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.85 }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
      <div style={{ padding: '1rem' }}>
        {children}
      </div>
    </div>
  );
}
```

### 3. `BrutalistBadge` (`src/components/BrutalistBadge.jsx`)
Compact metric chip or category pill.
```jsx
import React from 'react';

export function BrutalistBadge({ 
  children, 
  color = 'var(--accent-cyan)', 
  style = {} 
}) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      backgroundColor: color,
      color: 'var(--text-color)',
      border: '2px solid var(--border-color)',
      borderRadius: 'var(--border-radius-pill)',
      padding: '0.25rem 0.65rem',
      fontSize: '0.78rem',
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      ...style
    }}>
      {children}
    </span>
  );
}
```

### 4. `BrutalistInput` (`src/components/BrutalistInput.jsx`)
Uppercase sanitized input field with Neobrutalist focus state.
```jsx
import React from 'react';

export function BrutalistInput({ 
  value, 
  onChange, 
  placeholder, 
  label, 
  autoUppercase = true,
  style = {} 
}) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          fontWeight: 900, 
          fontSize: '0.85rem', 
          textTransform: 'uppercase', 
          marginBottom: '0.35rem' 
        }}>
          {label}
        </label>
      )}
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange(autoUppercase ? e.target.value.toUpperCase() : e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: 'var(--bg-secondary)',
          border: 'var(--border-width) solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text-color)',
          outline: 'none',
          boxShadow: '2px 2px 0px var(--border-color)',
          ...style
        }}
      />
    </div>
  );
}
### 5. `BottomNavBar` (`src/components/BottomNavBar.tsx`)
Sticky mobile-first bottom navigation bar clamped to `maxWidth: 560px` with tactile active indicators and badges.

```tsx
// 3 Primary Tabs: 'BRIDGES' | 'PLAN' | 'RULES'
<BottomNavBar
  currentTab={currentTab}
  onChangeTab={setCurrentTab}
  bridgesCount={bridges.length}
  plannedCount={plannedBridgesCount}
  observedCount={observedHolidaysCount}
/>
```

---

## 4. Typography Standards

- **Font Family:** `Plus Jakarta Sans`, sans-serif.
- **Headings (H1–H4):** `fontWeight: 900` or `700`, `textTransform: 'uppercase'`, negative letter-spacing (`-0.5px` to `-1px`).
- **Body Text:** `fontWeight: 500`–`600`, line height `1.5`.
- **Labels & Buttons:** Strictly uppercase (`textTransform: 'uppercase'`).
