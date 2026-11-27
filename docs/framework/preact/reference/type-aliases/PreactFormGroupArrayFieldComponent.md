---
id: PreactFormGroupArrayFieldComponent
title: PreactFormGroupArrayFieldComponent
---

```ts
type PreactFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents> = <TFieldName, TFieldValidators>(props) => ComponentChildren;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:240](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L240)

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

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>\>

## Parameters

### props

[`PreactFormFieldProps`](../interfaces/PreactFormFieldProps.md)\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupError`, `TFormData`, `TFormError`, `TFieldComponents`\>

## Returns

`ComponentChildren`
