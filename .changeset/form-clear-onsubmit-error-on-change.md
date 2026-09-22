---
'@tanstack/form-core': patch
---

fix(form-core): only clear a form-level onSubmit error on value change

`FormApi` cleared a stale form-level `onSubmit` error on any non-`submit`
validation cause (`cause !== 'submit'`), so a `blur`, `mount`, or `dynamic`
revalidation dropped the error even though the user never edited the field. The
clear now only happens on `cause === 'change'`, matching the documented intent
("clear the error as soon as the user enters a valid value") and the field-level
fix in #2211.
