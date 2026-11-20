---
id: GetSharedFormErrorTypes
title: GetSharedFormErrorTypes
---

```ts
type GetSharedFormErrorTypes<TValidators, TSubmitReturn> = unknown extends TSubmitReturn ? any : GetFormErrorTypes<TValidators, TSubmitReturn>;
```

Defined in: [validation/state.public.ts:234](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L234)

## Type Parameters

### TValidators

`TValidators`

### TSubmitReturn

`TSubmitReturn`
