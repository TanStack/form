---
"@tanstack/form-core": patch
---

fix(form-core): clear a stale field-level `onMount` error when a linked-field revalidation (`onChangeListenTo`/`onBlurListenTo`) passes, so the field is no longer left permanently invalid
