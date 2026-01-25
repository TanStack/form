---
'@tanstack/form-core': minor
---

Introduced a **Prioritized Default System** that ensures consistency between field metadata and form reset behavior. This change prioritizes field-level default values over form-level defaults across `isDefaultValue` derivation, `form.reset()`, and `form.resetField()`. This ensures that field metadata accurately reflects the state the form would return to upon reset and prevents `undefined` from being incorrectly treated as a default when a value is explicitly specified.
