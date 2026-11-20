---
id: LitFormGroupApi
title: LitFormGroupApi
---

```ts
type LitFormGroupApi<TFormData, TGroupName, TGroupValue, TGroupError, TFormError> = FormGroupApi<TFormData, TGroupName, TGroupValue, TGroupError, TFormError> & LitFieldMethods<TGroupValue, TGroupError["subfieldError"], TFormData, TFormError> & LitSubscribeMethod<FormGroupState<TGroupValue, TGroupError>>;
```

Defined in: [tanstack-form-controller.ts:155](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L155)

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupError

`TGroupError` *extends* `ScopedErrorTypes`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`
