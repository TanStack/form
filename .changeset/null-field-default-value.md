---
'@tanstack/form-core': patch
---

Treat field-level `defaultValue: null` as a valid default value instead of falling back to the form-level default when resolving `isDefaultValue` and in `resetField`.
