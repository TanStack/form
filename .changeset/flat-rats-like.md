---
'@tanstack/form-core': patch
'@tanstack/form-devtools': patch
'@tanstack/preact-form': patch
'@tanstack/react-form': patch
---

BREAKING: `runOnSubmit` has been renamed in favor of `skipOnSubmit`. That way, it's easier to explain what happens when you omit the property.

Migration:

- rename `runOnSubmit` to `skipOnSubmit`
- invert the condition you returned.
