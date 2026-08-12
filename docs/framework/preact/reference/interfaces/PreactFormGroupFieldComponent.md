---
id: PreactFormGroupFieldComponent
title: PreactFormGroupFieldComponent
---

# Interface: PreactFormGroupFieldComponent()\<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:223](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L223)

## Type Parameters

### TFormData

`TFormData`

### TGroupValue

`TGroupValue`

### TGroupErrorTypes

`TGroupErrorTypes` *extends* `FormErrorTypes`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

```ts
PreactFormGroupFieldComponent<TFieldName, TFieldValidators>(props): ComponentChildren;
```

Defined in: [packages/preact-form/src/PreactForm/Components.public.ts:230](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/PreactForm/Components.public.ts#L230)

## Type Parameters

### TFieldName

`TFieldName` *extends* `string`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>\>

## Parameters

### props

[`PreactFormFieldProps`](PreactFormFieldProps.md)\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupErrorTypes`\[`"fieldError"`\], `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

## Returns

`ComponentChildren`
