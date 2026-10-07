# CutiReady — Architecture & Codebase Guidelines

This document specifies the technical architecture, folder structure, mobile-first conventions, and quality gates for `CutiReady`.

---

## 1. Directory Structure & Organization

```
CutiReady/
├── public/                 # Static assets, favicons, illustrations
├── scripts/                # Verification utilities (scripts/check-tokens.js)
├── src/
│   ├── components/         # Shared Neobrutalist primitives (BrutalistButton, etc.)
│   ├── pages/              # Route views (Home, Planner, HolidayList, etc.)
│   ├── data/               # Static dataset models (holidays, long weekends, etc.)
│   ├── services/           # API adapters, storage, calculations
│   ├── App.jsx             # Top-level client-side routing & shell
│   └── index.css           # CSS variables & Neobrutalist tokens
└── .agent/
    ├── rules/              # Modular agent governance rules
    └── skills/             # On-demand executable runbooks
```

### File Naming Conventions:
- **UI Components:** PascalCase (e.g., `BrutalistButton.jsx`, `HolidayCard.jsx`, `LeaveOptimizer.jsx`).
- **Data & Config:** camelCase (e.g., `publicHolidays2026.js`, `leaveStrategies.js`).
- **Services & Utils:** camelCase (e.g., `dateUtils.js`, `storage.js`).

---

## 2. Mobile-First Layout Rules

`CutiReady` is strictly designed as a mobile-first web app:
1. **Container Clamping:** Every screen must be wrapped in `.neobrutalist-container` with `maxWidth: 560px` centered on desktop.
2. **Zero Horizontal Overflow:** Calendar matrices, leave schedules, and breakdown cards must fit within 360px+ screen widths with zero horizontal scroll.
3. **Stacked Neobrutalist Cards:** Use vertical card sequences with compact metric chips rather than wide side-by-side data tables.

---

## 3. Component Hierarchy & Layering

1. **Primitives (`src/components/`):** Generic, reusable Neobrutalist elements ([`BrutalistButton`](file:///C:/training/buwerk/CutiReady/.agent/rules/design-system.md#1-brutalistbutton-srccomponentsbrutalistbuttonjsx), `BrutalistCard`, `BrutalistBadge`, `BrutalistInput`). They contain zero business logic.
2. **Domain Components:** Domain-specific composite components (e.g., `HolidayDateTile`, `LeaveBalanceCard`) that compose base primitives.
3. **Pages (`src/pages/`):** Full route views that assemble domain components inside `.neobrutalist-container`.

> [!CAUTION]
> **No Inline Ad-Hoc Components:**
> Never define raw `<button>` or `<div style={{ border: '3px solid #000' }}>` inline inside page components. Always import and reuse the shared primitives from `src/components/`.

---

## 4. Verification & Quality Gates

Before concluding any turn or proposing code:
1. **Build / Typecheck:** `npm run build` or `npm run typecheck` (MUST exit 0 with 0 errors).
2. **Linter:** `npm run lint` (MUST report 0 errors).
3. **Token Linter:** `node scripts/check-tokens.js` (MUST confirm zero raw hex violations).
