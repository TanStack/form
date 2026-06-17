---
id: SolidFormArrayFieldProps
title: SolidFormArrayFieldProps
---

# Interface: SolidFormArrayFieldProps\<TFormData, TFieldName, TFieldValue, TFieldValidators, TFormValidatorMetas, TSubmitReturn\>

Defined in: [packages/solid-form/src/createForm.public.ts:70](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L70)

## Extends

- `FieldApiOptions`\<`TFormData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, \[\], `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`\>

## Type Parameters

### TFormData

`TFormData`

### TFieldName

`TFieldName` *extends* `DeepKeysWhereValueIncludes`\<`TFormData`, `any`[]\>

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

Defined in: [packages/solid-form/src/createForm.public.ts:87](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L87)

#### Parameters

##### fieldApi

`Accessor`\<`FieldApi`\<`TFieldName`, `TFieldValue`, `ToFieldValidatorMetas`\<`TFieldValidators`\>, \[\], `TFormData`, `TFormValidatorMetas`, `TSubmitReturn`\>\>

#### Returns

`Element`
