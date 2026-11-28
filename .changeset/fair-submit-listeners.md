---
'@tanstack/form-core': patch
---

Clear the submitting state when a form or field submit listener throws, so the original error is propagated without leaving the form stuck in a pending submission.
