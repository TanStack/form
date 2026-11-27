---
'@tanstack/angular-form': minor
'@tanstack/form-core': minor
'@tanstack/form-devtools': minor
'@tanstack/lit-form': minor
'@tanstack/preact-form': minor
'@tanstack/react-form': minor
'@tanstack/react-form-nextjs': minor
'@tanstack/react-form-start': minor
'@tanstack/solid-form': minor
'@tanstack/svelte-form': minor
'@tanstack/vue-form': minor
---

BREAKING: Schemas no longer automatically send copies of field errors to the form. Use `fieldErrorTarget: 'field-and-self'` on form or group validators.

`fieldErrorTarget` can now control where schemas process errors. It has three modes:

- `'field'` (default) - Field errors are only sent to the field it targets.
- `'field-and-self'` - Field errors are sent to the field it targets, and a copy is sent to the form array.
- `'self'` - Fields do not receive errors, only the form.
