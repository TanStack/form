---
'@tanstack/form-core': patch
---

Fix `form.resetField()` leaving the current value in place when the field's default value is `undefined`. The field is now reset to `undefined`, matching `form.reset()` and `isDefaultValue`.
