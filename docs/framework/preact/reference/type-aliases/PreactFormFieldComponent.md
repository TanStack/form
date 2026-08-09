---
id: PreactFormFieldComponent
title: PreactFormFieldComponent
---

# Type Alias: PreactFormFieldComponent()\<TFormData, TFormErrorTypes, TFieldComponents\>

```ts
type PreactFormFieldComponent<TFormData, TFormErrorTypes, TFieldComponents> = <TFieldName, TFieldValidators>(props) => ComponentChildren;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:151](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L151)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Type Parameters

### TFieldName

`TFieldName` *extends* `string`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>\>

## Parameters

### props

[`PreactFormFieldProps`](../interfaces/PreactFormFieldProps.md)\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

## Returns

`ComponentChildren`
