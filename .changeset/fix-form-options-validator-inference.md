---
'@tanstack/form-core': patch
---

fix(form-core): fix validator type inference in formOptions

When using `formOptions()` with `validators`, the callback parameter types were
inferred as `any` instead of the expected typed shape. This happened because the
return type `TOptions` captured the raw object literal type before TypeScript could
resolve the validator generics.

The fix uses `Omit` + `Pick` to selectively re-type the validator-dependent properties
(`validators`, `onSubmit`, `onSubmitInvalid`, `listeners`) with the properly resolved
generic types, while preserving spread/override compatibility through `TOptions` for
all other properties.
