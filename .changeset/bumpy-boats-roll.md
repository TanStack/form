---
'@tanstack/form-core': patch
---

Make fieldMeta values optional to reflect runtime behavior and prevent crashes

BREAKING CHANGE: `fieldMeta` values are now typed as `Record<DeepKeys<TData>, AnyFieldMeta | undefined>` instead of `Record<DeepKeys<TData>, AnyFieldMeta>`. This accurately reflects that field metadata is only available after a field has been mounted.

**Why:** Previously, TypeScript allowed unchecked access to `fieldMeta` properties, leading to runtime crashes when accessing metadata of unmounted fields during the first render.

**What changed:** The type now includes `undefined` in the union, forcing developers to handle the case where a field hasn't been mounted yet.

**How to migrate:**

```typescript
// Before (crashes at runtime)
const isValid = form.state.fieldMeta.name.isValid

// After - use optional chaining
const isValid = form.state.fieldMeta.name?.isValid

// Or explicit undefined check
const fieldMeta = form.state.fieldMeta.name
if (fieldMeta) {
  const isValid = fieldMeta.isValid
}
```
