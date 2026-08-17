---
name: close-cmux-tab
description: "Close the cmux tab this session is running in"
disable-model-invocation: true
---

Close the tab this session lives in. The session dies with it, so the close is the turn's final act — anything printed after it never reaches the user.

If `$CMUX_SURFACE_ID` is empty, report "not inside cmux" and stop. Otherwise run exactly:

```bash
cmux close-surface --surface "$CMUX_SURFACE_ID"
```
