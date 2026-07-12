---
name: html
description: Render a non-trivial answer as a self-contained HTML page and open it in the browser.
---

A single `.html` in the browser beats a wall of markdown. (After Thariq Shihipar's html-effectiveness.)

30+ pages to crib in [`examples/`](examples/): decision trees, comparisons, code reviews, dashboards, SVG scenes, decks, animations, live editors. Gallery: [`examples/index.html`](examples/index.html).

Explicit trigger only. Read context, pick a category, ship. Don't ask what they want.

## Categories

| Category | Use for |
|---|---|
| Exploration / Planning | Decision trees, option matrices |
| Code Review | Diff annotations, risk callouts |
| Design | Visual comparisons |
| Prototyping | Throwaway UI |
| Diagrams | Architecture, flows, state machines |
| Decks | Slide-style sections |
| Research | Multi-source synthesis, comparisons |
| Reports | Summaries, metrics, dashboards |
| Custom editors | One-off data tools |

Out of scope: production app UI, page redesigns. Route to a design skill.

## Rules

Self-contained `.html`, inline CSS/JS, no build. CDN libs only when earned (Chart.js, D3, Mermaid). Mock data inline as a JS const. Throwaway by default.

## Style

Minimal: cream `#F6F2EA`, near-black text, serif headlines, sans body, accent `#C8553D` sparingly, max-width 720-900px. No shadows, gradients, emoji. "Make it pop" → go bolder.

Stuck? Crib from [`examples/`](examples/).

## Unleashed

Trigger: "unleashed", "go wild", "make it wild".

The user often fires this just to see the power of HTML. So show them.

Mine the whole [`examples/`](examples/) library, combine whatever fits the subject: SVG, animation, interaction, decks, live editors, motion.

Keep the cream/serif taste as the base, break any Style rule the subject earns.

Really show what HTML can do.

## Output

Write to `/tmp/claude-html/<slug>.html` (or your artifacts folder). Copy path to clipboard.

Load `file://<path>` with `mcp__chrome-devtools__navigate_page`, screenshot to check it rendered. Broken → fix before reporting.

Print path + one line. The file is the answer.
