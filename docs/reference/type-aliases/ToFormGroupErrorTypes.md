---
id: ToFormGroupErrorTypes
title: ToFormGroupErrorTypes
---

```ts
type ToFormGroupErrorTypes<TGroupValidators> = ToValidatorErrorTypes<TGroupValidators, FormGroupValidators<any>, never>;
```

Defined in: [validation.public.ts:1323](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L1323)

Infers group and routed field issue types from group validators.

## Type Parameters

### TGroupValidators

`TGroupValidators` *extends* [`FormGroupValidators`](FormGroupValidators.md)\<`any`\>

Library-managed. Do not specify explicitly.
