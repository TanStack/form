---
id: PreactFormGroupFieldComponent
title: PreactFormGroupFieldComponent
---

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:212](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L212)

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

```ts
PreactFormGroupFieldComponent<TFieldName, TFieldValidators>(props): ComponentChildren;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:219](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L219)

## Type Parameters

### TFieldName

`TFieldName` *extends* `string`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>\>

## Parameters

### props

[`PreactFormFieldProps`](PreactFormFieldProps.md)\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupError`, `TFormData`, `TFormError`, `TFieldComponents`\>

## Returns

`ComponentChildren`
