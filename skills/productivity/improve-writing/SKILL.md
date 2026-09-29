---
name: improve-writing
description: "Draft, polish or take voice feedback on any text in my plain voice. Trigger 'polish this', 'feedback:'."
argument-hint: "<text | what to write | feedback: what I liked or didn't>"
---

Make `$ARGUMENTS` read like I wrote it. Any medium: message, email, post, doc, README, commit body. Voice follows the medium.

Match my language, write natively in it, never translate.

Modes:
- draft: "write X to Y about Z" -> draft now. Ask only if goal or recipient unclear.
- polish: text given -> improved version.
- feedback: I say what I like or don't -> update this file, no draft.

## Draft / polish

1. Write it in the voice below.
2. Run `/unslop` on it.
3. Plain pass: words you'd say out loud, decision -> lead with the choice, mechanism -> explain it like at a whiteboard.
4. Print the final text only, formatted for the medium (Slack bold = *single asterisks*). No before/after, no commentary.
5. I reply "copy" -> run `/copy`. Never before.

## Feedback

- each point -> a rule or a Bad/Good pair under Voice
- clashes with an existing line -> replace it, no duplicates
- reply with the changed lines only

## Voice

Warm, plain, flowing. A friend talking, not a copywriter.

- plain words: "really good", not "exceptional"
- one flowing sentence per thought, joined with "and", "but", "so" and commas. Short choppy sentences back to back read as AI, so never split a thought into two short ones, not even in bullet points
- keep softeners: "maybe", "by the way", "to be honest"
- enthusiasm ok: "!" and emoji in chats and posts, plain warmth in formal mail
- no walls of text: short paragraphs, a list when listing
- formal = same voice + "Dear [name]" and a sign-off, in my language
- no warm-up opener ("I wanted to reach out..."), start at the point
- no "here's the thing" setups, no "Thoughts?"
- bar test: read it aloud, wouldn't say it to a friend -> rewrite

From my edits:

Bad: Come by, I'll make you one. Sunday's better for me but I'm flexible.
Good: Come by and I'll make you one! Maybe we could meet on Sunday? I'm flexible, by the way.

Bad: Sounds too simple to matter. It's the thing I reach for most.
Good: Sounds too simple to matter, but it's the thing I keep reaching for.

Bad: A model is billions of frozen numbers. Everything it knows lives in them.
Good: A model is billions of frozen numbers, and everything it knows lives in them.

Bad: Stop asking how to win. Ask how you'd lose.
Good: When you're stuck, flip the question and ask how it would fail.

Technical to a non-technical reader: answer first, one everyday picture of how it works, then what it means for them.

> Yes, it's true, we really never see card numbers.
>
> When someone types their card into that box, the box isn't actually ours. It's a little
> window from Stripe embedded in our page, and whatever gets typed in there goes straight
> to Stripe. Our code can't read it, even if we wanted to.
>
> What comes back to us is just the boring stuff: the brand (Visa, Mastercard), the last 4
> digits, and the expiry month and year. That's all we store, and that's all we could ever
> show you.
>
> So the copy can stay as is.
