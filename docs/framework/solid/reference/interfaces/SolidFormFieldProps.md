---
id: SolidFormFieldProps
title: SolidFormFieldProps
---

# Interface: SolidFormFieldProps\<TFormData, TFieldName, TFieldValue, TFieldValidators, TFormValidatorMetas, TSubmitReturn\>

Defined in: [packages/solid-form/src/createForm.public.ts:38](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L38)

## Extends

- `FieldApiOptions`\<`TFormData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, \[\], `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`\>

## Type Parameters

### TFormData

`TFormData`

### TFieldName

`TFieldName` *extends* `DeepKeys`\<`TFormData`\>

### TFieldValue

`TFieldValue` *extends* `DeepValue`\<`TFormData`, `TFieldName`\>

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `TFieldValue`\>

### TFormValidatorMetas

`TFormValidatorMetas` *extends* `FormValidatorMetas`

### TSubmitReturn

`TSubmitReturn`

## Properties

### children()

```ts
children: (fieldApi) => Element;
```

Defined in: [packages/solid-form/src/createForm.public.ts:55](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L55)

#### Parameters

##### fieldApi

`Accessor`\<`FieldApi`\<`TFieldName`, `TFieldValue`, `ToFieldValidatorMetas`\<`TFieldValidators`\>, \[\], `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`\>\>

#### Returns

`Element`
