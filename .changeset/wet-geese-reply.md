---
'@tanstack/form-core': patch
---

Fixed `handleSubmit` re-entering while a submission is in flight. Since 1.33.1, the re-submission bypass for `canSubmit` also applied during a pending submission (because `canSubmit` is false while `isSubmitting`), so a repeated `handleSubmit` validated and called `onSubmit` again. In-flight submissions now return early, restoring pre-1.33.1 behavior while keeping the stale-error re-validation on re-submission.
