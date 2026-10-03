---
"@tanstack/form-core": patch
---

Re-run a form-level `onSubmit` validator on every submit (when no field-level validator errored) so it can recompute and clear its own field errors. Previously a form configured with only a form-level validator could be permanently gated by stale errors, because `_handleSubmit` bailed on `isFieldsValid` before the form-level validator re-ran (#2248).
