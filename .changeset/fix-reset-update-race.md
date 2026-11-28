---
"@tanstack/form-core": patch
---

Fix `reset(newValues)` inside `onSubmit` being overwritten when a re-render calls `update()` with unchanged component props.
