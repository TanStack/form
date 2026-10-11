---
id: ReusableErrorVisibilityState
title: ReusableErrorVisibilityState
---

```ts
type ReusableErrorVisibilityState = Omit<FormApi<any, any>["state"], "values"> & object;
```

Defined in: [validation.public.ts:350](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L350)

Form or group state available to a reusable error visibility policy.

`values` is `unknown` because the policy can be used with different form shapes.

## Type Declaration

### values

```ts
values: unknown;
```

Current form values, without assuming a particular form shape.
