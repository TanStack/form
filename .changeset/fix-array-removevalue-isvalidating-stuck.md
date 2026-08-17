---
'@tanstack/form-core': patch
---

Fix `isFieldsValidating` getting stuck `true` after `removeValue` on an array field while an async validation is in flight
