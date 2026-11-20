---
id: GetFormErrorTypes
title: GetFormErrorTypes
---

```ts
type GetFormErrorTypes<TValidators, TSubmitReturn> = ScopedErrorTypes<GetSelfErrors<TValidators, TSubmitReturn>, GetSubfieldErrors<TValidators, TSubmitReturn>>;
```

Defined in: [validation/state.public.ts:227](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L227)

## Type Parameters

### TValidators

`TValidators`

### TSubmitReturn

`TSubmitReturn`
