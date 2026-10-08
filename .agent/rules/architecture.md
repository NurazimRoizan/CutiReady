# CutiReady — Architecture & Codebase Guidelines

This document specifies the technical architecture, folder structure, mobile-first conventions, and quality gates for `CutiReady`.

---

## 1. Directory Structure & Organization

```
CutiReady/
├── public/                 # Static assets, favicons, illustrations
├── scripts/                # Verification utilities (scripts/check-tokens.js)
├── src/
│   ├── components/         # Shared Neobrutalist primitives (BrutalistButton, BottomNavBar, etc.)
│   ├── pages/              # Core views (HomePage, BridgesView, MyPlanView, RulesView)
│   ├── data/               # Static dataset models (holidays.ts)
│   ├── engine/             # Calendar arithmetic & EA 1955 bridge engine (calendarEngine.ts)
│   ├── store/              # Zustand global store with localStorage persistence (useLeaveStore.ts)
│   ├── utils/              # RFC 5545 .ics generation & clipboard formatting (icsExport.ts)
│   ├── types/              # Canonical TypeScript interfaces (index.ts)
│   ├── App.tsx             # Shell orchestrating views, modals & service worker
│   └── index.css           # CSS variables & Neobrutalist tokens
└── .agent/
    ├── rules/              # Modular agent governance rules
    └── skills/             # On-demand executable runbooks
```

### File Naming Conventions:
- **UI Components & Views:** PascalCase (e.g., `BrutalistButton.tsx`, `BottomNavBar.tsx`, `BridgesView.tsx`).
- **Data & Config:** camelCase (e.g., `holidays.ts`, `calendarEngine.ts`).
- **Services & Utils:** camelCase (e.g., `icsExport.ts`, `useLeaveStore.ts`).

---

## 2. 3-View Bottom Navigation Architecture

To prevent mobile scrolling fatigue and maintain high cognitive clarity, CutiReady is structured into 3 distinct views orchestrated via `BottomNavBar`:

1. **`BRIDGES` (`src/pages/BridgesView.tsx`):**
   - Discovery & browsing mode.
   - Hero section with quick Annual Leave quota buttons (`8`, `12`, `14`, `16`, `20` days).
   - Quarter filter tabs (`ALL`, `HIGH_ROI`, `ZERO_AL`, `Q1`, `Q2`, `Q3`, `Q4`).
   - Discovered long weekend cards with "+ Add to Plan" action.
2. **`PLAN` (`src/pages/MyPlanView.tsx`):**
   - Execution & decision mode (Vacation Dossier).
   - Summary metric chips (Total Days Off, AL Invested, Arbitrage Multiplier).
   - Master export actions (unified `.ics` download for all planned breaks, pre-formatted clipboard summary for managers/HR).
   - Empty state CTA to redirect users to the Bridges view when no leave is planned.
3. **`RULES` (`src/pages/RulesView.tsx`):**
   - Configuration mode.
   - Working state selector & automatic rest-day mappings (`SAT_SUN` vs `FRI_SAT`).
   - Statutory presets under Employment Act 1955 (11 Days statutory minimum, 15 Days corporate standard, All gazetted).
   - Saturday *Cuti Ganti* replacement toggle.
   - Granular holiday checklist with category filters (Compulsory, Federal, State).

> [!NOTE]
> The bottom navigation bar is fixed at the bottom (`maxWidth: 560px`). All page views wrapped in `.neobrutalist-container` must maintain `paddingBottom: 5.5rem` to avoid content occlusion.

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
