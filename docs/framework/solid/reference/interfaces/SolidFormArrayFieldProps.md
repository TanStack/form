---
id: SolidFormArrayFieldProps
title: SolidFormArrayFieldProps
---

# Interface: SolidFormArrayFieldProps\<TFormData, TFieldName, TFieldValue, TFieldValidators, TFormErrorTypes\>

Defined in: [packages/solid-form/src/createForm.public.ts:61](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L61)

## Extends

- `FieldApiOptions`\<`TFormData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `never`, `TFormData`, `TFormErrorTypes`\>

## Type Parameters

### TFormData

`TFormData`

### TFieldName

`TFieldName` *extends* `DeepKeysWhereValueIncludes`\<`TFormData`, `any`[]\>

### TFieldValue

`TFieldValue` *extends* `DeepValue`\<`TFormData`, `TFieldName`\>

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `TFieldValue`\>

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

## Properties

### children()

```ts
children: (fieldApi) => Element;
```

Defined in: [packages/solid-form/src/createForm.public.ts:76](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L76)

#### Parameters

##### fieldApi

`Accessor`\<`FieldApi`\<`TFieldName`, `TFieldValue`, `ToFieldError`\<`TFieldValidators`, `never`, `TFormErrorTypes`\>, `TFormData`, `TFormErrorTypes`\>\>

#### Returns

`Element`
