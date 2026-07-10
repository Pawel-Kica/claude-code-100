---
name: throwaway-prototype
description: "Throwaway HTML page prototype, variants by default. Trigger /throwaway-prototype, 'prototype this page'."
---

Run `/prototype`'s UI branch with these overrides:

- One standalone `.html`, CSS and JS inline, no build, no repo. Variant switcher is a `?variant=` query param in plain JS.
- Mock all data in memory or localStorage.
- Read the repo's colors, spacing, fonts, and components. Match them closely.

Save to `~/.claude/prds/<name>/artifacts/<slug>.html` when scoping a PRD, otherwise `~/.claude/prototypes/<slug>.html`.
Copy the path per `/clipboard-copy`.
