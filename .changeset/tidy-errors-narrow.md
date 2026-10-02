---
'@tanstack/form-core': patch
---

Remove the spurious `undefined` from the element type of `field.state.meta.errors`. Each unused validator slot previously contributed `undefined` to the union, so a single form-level Standard Schema produced `(StandardSchemaV1Issue | undefined)[]` and the array could not be iterated without a guard or a cast. The array is already filtered at runtime, and the form-level `errors` type is already wrapped in `NonNullable`; this aligns the field-level type with both.
