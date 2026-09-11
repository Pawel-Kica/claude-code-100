---
name: throwaway-prototype
description: "Throwaway HTML page prototype, variants by default. Trigger 'prototype this page'."
---

Run `/prototype`'s UI branch with these overrides:

- One standalone `.html`, CSS and JS inline, no build, no repo. Variant switcher is a `?variant=` query param in plain JS.
- Mock all data in memory or localStorage.
- Read the repo's colors, spacing, fonts, and components. Match them closely.

Save to `~/.claude/specs/<name>/<slug>.html` when scoping a spec (`<name>` = slug picked at the start of `/scope`), otherwise `~/.claude/prototypes/<slug>.html`.
Copy the path per `/clipboard-copy`.

Please use Chrome DevTools (MCP) to do super-simple verification in order to check that the prototype is loading - DON'T DO A LOT OF CHECKS, JUST BASIC CHECK TO PROOF IT LOADS.
Basically we want to avoid e.g. "js build" errors, so user doesn't need to prompt again saying "prototype doesn't work". 

On first generation only, use "open -A" to open the prototype in Chrome. On later iterations/regenerations never open it again, user just refreshes the tab.