---
'@tanstack/form-core': patch
---

Fix: `formOptions.looseSchema` no longer turns optional schema properties into required ones, so the same schema can be passed to `validators[].run`.
