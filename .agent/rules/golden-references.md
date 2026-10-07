# CutiReady — Golden References & Code Standards

This document establishes the canonical reference patterns for `CutiReady`. When developing new features, components, or screens, use these implementations as the definitive standard.

---

## 1. Canonical Golden Component: `BrutalistButton`

The button is the central tactile interactive element of the Neobrutalist design system.

### Why This Is The Standard:

#### A. Tactile Press Mechanics (Wallo Signature)
- **Resting state:** Sits physically raised above the surface with a solid 4px offset drop shadow:
  ```javascript
  boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
  transform: 'translate(0, 0)'
  ```
- **Active / Pressed state:** When tapped or clicked, it physically collapses down and right into the shadow footprint:
  ```javascript
  boxShadow: '0px 0px 0px var(--border-color)',
  transform: 'translate(var(--shadow-offset), var(--shadow-offset))'
  ```
- Inverting this behavior (e.g. expanding outward or showing blur) breaks the tactile illusion.

#### B. Polymorphic Semantic Markup
- Renders an `<a>` tag if `href` is supplied, or `<button>` if an action is supplied.
- Retains identical tactile press handlers across both mouse and touch devices.

#### C. Zero Raw Hex
- All colors strictly use `var(--accent-yellow)`, `var(--text-color)`, `var(--border-color)`.

---

## 2. Canonical Golden Card: `BrutalistCard`

The standard container for information units, lists, forms, and metric displays.

### Why This Is The Standard:

1. **Layered Structure:**
   - Solid `3px` black border (`var(--border-width)`).
   - Hard `4px` black drop shadow with zero blur.
   - Rounded `8px` corners with `overflow: hidden` so the header strip seamlessly caps the top.
2. **Colored Header Strip:**
   - A distinct 32px–40px colored banner strip (`var(--accent-yellow)`, `var(--accent-cyan)`, or `var(--accent-pink)`).
   - Solid bottom border separating the header from the card content.
   - Heavy uppercase title (`fontWeight: 900`).

---

## 3. Canonical Golden Page Layout Pattern

```jsx
import React from 'react';
import { BrutalistButton } from '../components/BrutalistButton';
import { BrutalistCard } from '../components/BrutalistCard';
import { BrutalistBadge } from '../components/BrutalistBadge';

export default function SamplePage() {
  return (
    <div className="neobrutalist-container">
      {/* 1. Header Banner */}
      <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.25rem', 
          fontWeight: 900, 
          textTransform: 'uppercase', 
          letterSpacing: '-1px',
          margin: '0 0 0.5rem 0' 
        }}>
          CUTI READY
        </h1>
        <p style={{ fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
          MAXIMIZE YOUR 2026 HOLIDAYS & LONG WEEKENDS
        </p>
      </header>

      {/* 2. Metric Chips Row */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <BrutalistBadge color="var(--accent-yellow)">12 LONG WEEKENDS</BrutalistBadge>
        <BrutalistBadge color="var(--accent-cyan)">8 LEAVE DAYS LEFT</BrutalistBadge>
      </div>

      {/* 3. Neobrutalist Information Card */}
      <BrutalistCard 
        title="UPCOMING HOLIDAY" 
        subtitle="3 DAYS AWAY" 
        headerColor="var(--accent-yellow)"
      >
        <p style={{ fontWeight: 700, margin: '0 0 1rem 0' }}>
          HARIRAYA AIDILFITRI • 31 MARCH 2026
        </p>
        <BrutalistButton color="var(--accent-cyan)" href="/plan">
          PLAN LEAVE BRIDGE
        </BrutalistButton>
      </BrutalistCard>
    </div>
  );
}
```
