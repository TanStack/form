---
id: ReusableErrorVisibilityState
title: ReusableErrorVisibilityState
---

# Type Alias: ReusableErrorVisibilityState

```ts
type ReusableErrorVisibilityState = Omit<FormApi<any, any, any>["state"], "values"> & object;
```

Defined in: [packages/form-core/src/validation.public.ts:223](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L223)

The scoped state view available while declaring a reusable visibility policy.

`values` remains unknown because a reusable policy is not associated with a
particular form shape until it is assigned to a form or field option.

## Type Declaration

### values

```ts
values: unknown;
```
