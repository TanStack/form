---
id: SolidFormArrayFieldProps
title: SolidFormArrayFieldProps
---

# Interface: SolidFormArrayFieldProps\<TFormData, TFieldName, TFieldValue, TFieldValidators, TFormErrorTypes\>

Defined in: [packages/solid-form/src/Components.public.ts:127](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Components.public.ts#L127)

## Extends

- [`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TFormData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `never`, `TFormData`, `TFormErrorTypes`, `Record`\<`never`, `never`\>\>

## Type Parameters

### TFormData

`TFormData`

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `TFieldValue`\>

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

## Properties

### children

```ts
children: (fieldApi) => Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:111](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/Components.public.ts#L111)

#### Parameters

##### fieldApi

[`SolidFieldApi`](../type-aliases/SolidFieldApi.md)\<`TFieldName`, `TFieldValue`, `FallbackToValidationIssue`\<
  \| `ExtractValidatorFieldError`\<`NoInfer`\<`TFieldValidators`\>, `FieldValidators`\<`any`, `any`, `any`\>\>
  \| `ExtractFormFieldError`\<`TFormErrorTypes`\>\>, `TFormData`, `TFormErrorTypes`, `Record`\<`never`, `never`\>\>

#### Returns

`Element`

#### Inherited from

[`SolidFormFieldProps`](SolidFormFieldProps.md).[`children`](SolidFormFieldProps.md#children)
