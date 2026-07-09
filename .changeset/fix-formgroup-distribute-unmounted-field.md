---
'@tanstack/form-core': patch
---

Fix `FormGroupApi.distributeFieldErrors` throwing `TypeError: Cannot read properties of undefined` when a group validator returns errors for a field that is not mounted yet
