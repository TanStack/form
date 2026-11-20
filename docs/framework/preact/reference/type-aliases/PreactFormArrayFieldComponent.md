---
id: PreactFormArrayFieldComponent
title: PreactFormArrayFieldComponent
---

```ts
type PreactFormArrayFieldComponent<TFormData, TFormError, TFieldComponents> = <TFieldName, TFieldValidators>(props) => ComponentChildren;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:173](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L173)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>\>

## Parameters

### props

[`PreactFormFieldProps`](../interfaces/PreactFormFieldProps.md)\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormError`, `TFieldComponents`\>

## Returns

`ComponentChildren`
