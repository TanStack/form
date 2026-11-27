---
id: ReactFormGroupArrayFieldComponent
title: ReactFormGroupArrayFieldComponent
---

```ts
type ReactFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents> = <TFieldName, TFieldValidators>(props) => ReactNode;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:273](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L273)

## Type Parameters

### TFormData

`TFormData`

### TGroupValue

`TGroupValue`

### TGroupError

`TGroupError` *extends* `ScopedErrorTypes`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](ReactComponentTree.md)

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>\>

## Parameters

### props

[`ReactFormArrayFieldProps`](../interfaces/ReactFormArrayFieldProps.md)\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupError`, `TFormData`, `TFormError`, `TFieldComponents`\>

## Returns

`ReactNode`
