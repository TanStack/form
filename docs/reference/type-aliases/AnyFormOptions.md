---
id: AnyFormOptions
title: AnyFormOptions
---

# Type Alias: AnyFormOptions

```ts
type AnyFormOptions = FormOptions<any, any, any, any>;
```

Defined in: [FormApi/FormApi.public.ts:230](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L230)

Form options whose data, validator, and submission return types are erased.

Use this alias only when reusable code does not need type-safe access to
values, validators, or submission results.
