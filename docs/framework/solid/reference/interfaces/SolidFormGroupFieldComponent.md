---
id: SolidFormGroupFieldComponent
title: SolidFormGroupFieldComponent
---

# Interface: SolidFormGroupFieldComponent()\<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/solid-form/src/Components.public.ts:212](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Components.public.ts#L212)

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

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

```ts
SolidFormGroupFieldComponent<TFieldName, TFieldValidators>(props): Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:219](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Components.public.ts#L219)

## Type Parameters

### TFieldName

`TFieldName` *extends* `string`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>\>

## Parameters

### props

[`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupErrorTypes`\[`"fieldError"`\], `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

## Returns

`Element`
