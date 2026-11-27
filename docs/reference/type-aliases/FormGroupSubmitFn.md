---
id: FormGroupSubmitFn
title: FormGroupSubmitFn
---

```ts
type FormGroupSubmitFn<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormError, TSubmitReturn> = (context) => TSubmitReturn;
```

Defined in: [FormGroupApi/FormGroupApi.public.ts:138](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts#L138)

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupValidators

`TGroupValidators` *extends* [`FormGroupValidators`](FormGroupValidators.md)\<`TGroupValue`\>

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](../interfaces/ScopedErrorTypes.md)

### TSubmitReturn

`TSubmitReturn`

## Parameters

### context

[`FormGroupSubmitContext`](../interfaces/FormGroupSubmitContext.md)\<`TFormData`, `TGroupName`, `TGroupValue`, [`ToFormGroupOutputs`](ToFormGroupOutputs.md)\<`NoInfer`\<`TGroupValidators`\>\>, [`ToFormGroupErrorTypes`](ToFormGroupErrorTypes.md)\<`NoInfer`\<`TGroupValidators`\>, `never`\>, `TFormError`\>

## Returns

`TSubmitReturn`
