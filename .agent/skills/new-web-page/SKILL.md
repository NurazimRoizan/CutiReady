---
name: new-web-page
description: >-
  Scaffold a new mobile-first page view in CutiReady adhering to Neobrutalist design tokens and component contracts.
---

# New Web Page Runbook

Follow this runbook when introducing a new route or screen to `CutiReady`.

---

## Step 1: Create Page Component (`src/pages/<Name>.jsx`)

Build the page adhering strictly to Neobrutalist web conventions:
- Wrap the entire view inside `.neobrutalist-container` (`maxWidth: 560px`).
- Compose shared primitives from `src/components/` (`BrutalistButton`, `BrutalistCard`, `BrutalistBadge`).
- Use CSS variables (`var(--accent-yellow)`, `var(--bg-primary)`) rather than raw hex.
- Ensure 360px+ viewport compatibility with zero horizontal overflow.

Example:
```jsx
import React from 'react';
import { BrutalistButton } from '../components/BrutalistButton';
import { BrutalistCard } from '../components/BrutalistCard';

export default function MyNewPage() {
  return (
    <div className="neobrutalist-container">
      <h1 style={{ textTransform: 'uppercase', fontWeight: 900 }}>Page Title</h1>
      <BrutalistCard title="CARD TITLE" headerColor="var(--accent-cyan)">
        <p>Neobrutalist content body.</p>
        <BrutalistButton href="/">BACK HOME</BrutalistButton>
      </BrutalistCard>
    </div>
  );
}
```

---

## Step 2: Register Route

Register the new page in your application's router (e.g., `src/App.jsx` or router configuration):
```jsx
<Route path="/my-path" element={<MyNewPage />} />
```

---

## Step 3: Verification & Token Audit

Run verification commands:
```powershell
node scripts/check-tokens.js src/pages/<Name>.jsx
npm run build
```
Confirm 0 build errors and 0 arbitrary hex violations before concluding.
