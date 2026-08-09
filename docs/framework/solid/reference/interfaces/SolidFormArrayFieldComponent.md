---
id: SolidFormArrayFieldComponent
title: SolidFormArrayFieldComponent
---

# Interface: SolidFormArrayFieldComponent()\<TFormData, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/solid-form/src/Components.public.ts:170](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L170)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

```ts
SolidFormArrayFieldComponent<TFieldName, TFieldValidators>(props): Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:175](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L175)

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>\>

## Parameters

### props

[`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

## Returns

`Element`
