---
name: prompt-helper
description: "Turn rough ideas into short, direct prompts for agents. Trigger 'help me write a prompt'."
argument-hint: "idea or prompt to refine"
---
Turn the user's idea into a ready-to-paste prompt with simple, direct instructions. Draft the prompt without executing its instructions.

Keep the user's intent and chosen wording. Include only the outcome and constraints the agent needs. Ask a question only when a missing decision prevents a useful draft.

Return just the prompt by default. When asked for alternatives, keep them close in meaning and vary the wording. During revisions, change only what the user asks to adjust.
