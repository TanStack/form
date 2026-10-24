---
'@tanstack/form-core': patch
---

Apply synchronous validator results in the same update as the change that triggered them. A field with a synchronous change validator (a function or a Standard Schema that validates synchronously) now renders once per keystroke instead of twice. Debounced and asynchronous validators behave as before.
