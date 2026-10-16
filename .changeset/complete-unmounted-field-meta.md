---
'@tanstack/form-core': patch
---

Fix `form.setFieldValue()` creating incomplete metadata for a field that is not mounted yet. A `FormGroup` validator that later reports an error for that field no longer throws `TypeError: Cannot read properties of undefined (reading 'onChange')`, and the error is assigned to the field.
