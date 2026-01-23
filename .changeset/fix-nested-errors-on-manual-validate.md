---
'@tanstack/form-core': patch
'@tanstack/react-form': patch
'@tanstack/angular-form': patch
'@tanstack/vue-form': patch
'@tanstack/solid-form': patch
---

fix: flatten errors consistently when validating before field mount

Fixed an issue where `field.errors` was incorrectly nested as `[[error]]` instead of `[error]` when `form.validate()` was called manually before a field was mounted. The `flat(1)` operation is now applied by default unless `disableErrorFlat` is explicitly set to true, ensuring consistent error structure regardless of when validation occurs.
