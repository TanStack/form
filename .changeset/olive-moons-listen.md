---
'@tanstack/form-core': minor
---

Add an `onDynamicListenTo` validator option, so a field's `onDynamic` and `onDynamicAsync` validators can be re-run when other named fields change, the way `onChangeListenTo` and `onBlurListenTo` already work for their validators. Previously the only way to link a dynamic validator was to duplicate the rule into an `onChange` validator, which reported the error under the wrong key.

Fixes #1698
