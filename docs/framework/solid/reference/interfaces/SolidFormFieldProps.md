---
id: SolidFormFieldProps
title: SolidFormFieldProps
---

# Interface: SolidFormFieldProps\<TFieldData, TFieldName, TFieldValue, TFieldValidators, TGroupFieldError, TFormData, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/solid-form/src/Components.public.ts:93](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Components.public.ts#L93)

## Extends

- `FieldApiOptions`\<`TFieldData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `TGroupFieldError`, `TFormData`, `TFormErrorTypes`\>

## Extended by

- [`SolidFormArrayFieldProps`](SolidFormArrayFieldProps.md)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFieldData`, `TFieldName`, `TFieldValue`\>

### TGroupFieldError

`TGroupFieldError`

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Properties

### children

```ts
children: (fieldApi) => Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:111](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Components.public.ts#L111)

#### Parameters

##### fieldApi

[`SolidFieldApi`](../type-aliases/SolidFieldApi.md)\<`TFieldName`, `TFieldValue`, `ToFieldError`\<`NoInfer`\<`TFieldValidators`\>, `TGroupFieldError`, `TFormErrorTypes`\>, `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>

#### Returns

`Element`
