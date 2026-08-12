---
id: AnyFormOptions
title: AnyFormOptions
---

# Type Alias: AnyFormOptions

```ts
type AnyFormOptions = FormOptions<any, any, any>;
```

Defined in: [FormApi/FormApi.public.ts:207](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L207)

Form options whose data, validator, and submission return types are erased.

Use this alias only when reusable code does not need type-safe access to
values, validators, or submission results.
