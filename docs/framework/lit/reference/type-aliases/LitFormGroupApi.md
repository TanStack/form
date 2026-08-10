---
id: LitFormGroupApi
title: LitFormGroupApi
---

# Type Alias: LitFormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes\>

```ts
type LitFormGroupApi<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes> = FormGroupApi<TFormData, TGroupName, TGroupValue, TGroupErrorTypes, TFormErrorTypes> & LitFieldMethods<TGroupValue, TGroupErrorTypes["fieldError"], TFormData, TFormErrorTypes> & LitSubscribeMethod<FormGroupState<TGroupValue, TGroupErrorTypes>>;
```

Defined in: [tanstack-form-controller.ts:156](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L156)

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupErrorTypes

`TGroupErrorTypes` *extends* `FormErrorTypes`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`
