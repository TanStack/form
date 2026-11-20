---
id: ReactFormArrayFieldComponent
title: ReactFormArrayFieldComponent
---

```ts
type ReactFormArrayFieldComponent<TFormData, TFormError, TFieldComponents> = <TFieldName, TFieldValidators>(props) => ReactNode;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:175](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L175)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](ReactComponentTree.md)

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>\>

## Parameters

### props

[`ReactFormFieldProps`](../interfaces/ReactFormFieldProps.md)\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormError`, `TFieldComponents`\>

## Returns

`ReactNode`
