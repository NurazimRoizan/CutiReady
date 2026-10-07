# CutiReady — AI Agent Enforcement Protocol & Design Router

This file is the authoritative router and execution protocol for all AI agents working in the `CutiReady` codebase.

---

## 0. Project Identity & Visual DNA

`CutiReady` is a modern holiday, leave planning, and vacation readiness web application.

> [!IMPORTANT]
> **Design Lineage (Wallo Neobrutalism):**
> CutiReady inherits its exact visual identity, interaction feel, and styling patterns from **Wallo & Wallo Web**:
> - **Aesthetic:** High-contrast, tactile **Neobrutalism**.
> - **Colors:** Soft pastel cream canvas (`#fef3c7`), crisp white cards (`#ffffff`), electric accent yellow (`#fde047`), hot accent pink (`#f9a8d4`), and cyan (`#67e8f9`).
> - **Borders & Shadows:** Thick 3px/4px solid black borders (`#000000`) and hard directional 4px drop shadows (`4px 4px 0px #000`) with **zero blur**.
> - **Tactile Feedback:** Buttons sit raised with offset shadows and physically press down into the shadow on click.
> - **Typography:** Bold uppercase headings (`Space Grotesk` / sans-serif, `fontWeight: 700`–`900`), tight letter spacing.
> - **Layout:** Mobile-first, centered card container clamped to `maxWidth: 560px`.

Any AI agent working on this codebase **MUST strictly maintain this design signature** and never invent generic corporate, flat minimalist, or blurry glassmorphism designs.

---

## 1. Rule Routing Table

Before generating or modifying any code in `CutiReady`, you MUST review the specific rule file corresponding to your task:

| Task Type | Rule File | Content & Focus |
| :--- | :--- | :--- |
| **UI Components, Styling, Tokens, Layout** | `.agent/rules/design-system.md` | CSS variables, Neobrutalist design tokens, `BrutalistButton`, mobile-first constraints, negative styling constraints. |
| **Routing, State, Architecture, Conventions** | `.agent/rules/architecture.md` | Folder structure, component hierarchy, mobile-first container patterns, quality gates. |
| **Implementation Standards & Golden Reference** | `.agent/rules/golden-references.md` | Canonical reference files (`BrutalistButton`, `BrutalistCard`, metric chips), tactile button press pattern. |

---

## 2. Mandatory "Plan & Audit" Workflow

Before writing or editing code for any new page, component, feature, or refactor, the agent MUST first output a Plan & Audit checklist:

1. **Architecture Placement:** Specify the exact file path (`src/components/`, `src/pages/`, etc.), route, and state/data requirements.
2. **Component & Token Reuse:** Enumerate the exact shared UI primitives (`BrutalistButton`, `BrutalistCard`, metric chips, etc.) and CSS variables (`var(--accent-yellow)`, `var(--bg-primary)`) being reused.
3. **Zero Arbitrary Styles Confirmation:** Explicitly confirm that **zero** raw hex codes (`#...`), ad-hoc inline buttons, or blurred shadows are introduced.
4. **Mobile-First Layout Confirmation:** Confirm that the layout is clamped to mobile-first widths (`maxWidth: 560px` or `.neobrutalist-container`) and has zero horizontal overflow on 360px+ screens.
5. **Missing Primitives Gate:** If a required UI element does not exist in `.agent/rules/design-system.md`, **STOP** and propose it in the plan for approval; do not invent it inline.

---

## 3. Negative Constraints (STRICT & VERBATIM)

Every agent working on this codebase MUST follow these negative constraints:

> [!CAUTION]
> 1. **Zero Raw Hex in Components:** Hardcoded `#...` hex codes in JSX/TSX or inline styles are strictly forbidden. Always use CSS variables (`var(--...)`) defined in the design system.
> 2. **Strict Reuse:** Never create ad-hoc buttons, custom cards, or duplicate container wrappers. Always compose existing shared primitives.
> 3. **Tactile Button Signature (Never Invert):**
>    - **Inactive state:** Raised with `4px 4px 0px #000` drop shadow and `transform: none`.
>    - **Active / Pressed state:** Mechanically pressed into the shadow with `transform: translate(var(--shadow-offset), var(--shadow-offset))` and `box-shadow: 0px 0px 0px`. Inverting this pattern breaks the signature tactile feel.
> 4. **No Blurs or Gradients in Shadows:** Drop shadows must be solid and directional (`box-shadow: 4px 4px 0px #000`). Soft blurred box-shadows or glow effects are strictly forbidden.
> 5. **Mobile-First Constraint:** Clamped to `maxWidth: 560px`. No multi-column desktop grids or wide tables that force horizontal scrolling on mobile viewports.

---

## 4. Quality Verification Gate

After completing any code edits or additions:
- **Build / Typecheck:** Run `npm run build` or `npm run typecheck` (ensure 0 errors).
- **Linter:** Run `npm run lint` (ensure 0 warnings/errors).
- **Token Linter:** Run `node scripts/check-tokens.js <path>` (or `npm run check:tokens`).
- **Requirement:** Verification MUST pass before concluding any turn.

---

## 5. Environment & Shell Guidelines

- **Operating System:** Windows with PowerShell. **NEVER use `cd` commands.** Always provide commands with working paths or explicit `-Cwd`.
- **Framework:** Modern Web (React / Vite, React Router, CSS Variables / Tailwind Neobrutalism).

---

## 6. Workspace Skills

The following on-demand executable runbooks are available in `.agent/skills/`:
- **`check-tokens`** (`.agent/skills/check-tokens/SKILL.md`): Automated style audit and CSS variable enforcement.
- **`new-web-page`** (`.agent/skills/new-web-page/SKILL.md`): Scaffolding a new mobile-first page adhering to the Neobrutalist design system.
