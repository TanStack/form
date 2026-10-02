---
'@tanstack/form-core': patch
'@tanstack/react-form': patch
---

Bump `_arrayVersion` when resetting array fields so adapters re-render after `form.reset()` or `form.resetField()` changes array length.

Fixes #2228
