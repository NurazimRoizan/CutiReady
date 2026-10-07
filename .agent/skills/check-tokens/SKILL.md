---
name: check-tokens
description: >-
  Audit and enforce design token compliance and zero arbitrary hex codes across modified files in CutiReady.
---

# Design Token Compliance Runbook

This runbook guides the automated audit and resolution of arbitrary styling violations in `CutiReady`.

---

## 1. Running the Validator

To check a specific file or directory:
```powershell
node scripts/check-tokens.js src/components/MyComponent.jsx
```

To run the full suite check:
```powershell
node scripts/check-tokens.js
```

---

## 2. Resolving Violations

If the script flags hardcoded hex values (`#...`) in JSX/TSX files:

1. Replace raw colors with CSS variables from `:root` (defined in `src/index.css`):
   - Soft cream background: `var(--bg-primary)`
   - Pure white card: `var(--bg-secondary)`
   - Accent Yellow: `var(--accent-yellow)`
   - Accent Pink: `var(--accent-pink)`
   - Accent Cyan: `var(--accent-cyan)`
   - Black borders & text: `var(--border-color)` or `var(--text-color)`
   - Muted captions: `var(--text-muted)`
   - Card dividers: `var(--border-subtle)`
   - Error/alert background: `var(--danger-bg)`
2. If a new color token is genuinely needed across the brand, add it to `:root` in `src/index.css` and document it in `.agent/rules/design-system.md` rather than leaving inline hex codes in components.
