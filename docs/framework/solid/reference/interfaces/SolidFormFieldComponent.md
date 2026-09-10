---
id: SolidFormFieldComponent
title: SolidFormFieldComponent
---

# Interface: SolidFormFieldComponent()\<TFormData, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/solid-form/src/Components.public.ts:144](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L144)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

```ts
SolidFormFieldComponent<TFieldName, TFieldValidators>(props): Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:149](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L149)

## Type Parameters

### TFieldName

`TFieldName` *extends* `string`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>\>

## Parameters

### props

[`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

## Returns

`Element`
