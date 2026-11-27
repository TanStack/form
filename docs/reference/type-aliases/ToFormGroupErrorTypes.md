---
id: ToFormGroupErrorTypes
title: ToFormGroupErrorTypes
---

```ts
type ToFormGroupErrorTypes<TGroupValidators, TSubmitReturn> = ToValidatorErrorTypes<TGroupValidators, FormGroupValidators<any>, TSubmitReturn>;
```

Defined in: [validation/state.public.ts:259](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L259)

Infers group and routed field issue types from group validators.

## Type Parameters

### TGroupValidators

`TGroupValidators` *extends* [`FormGroupValidators`](FormGroupValidators.md)\<`any`\>

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`
