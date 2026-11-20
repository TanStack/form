---
id: SolidFormArrayFieldProps
title: SolidFormArrayFieldProps
---

Defined in: [packages/solid-form/src/Components.public.ts:123](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L123)

## Extends

- [`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TFormData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `never`, `TFormData`, `TFormError`, `Record`\<`never`, `never`\>\>

## Type Parameters

### TFormData

`TFormData`

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `TFieldValue`\>

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

## Properties

### children

```ts
children: (fieldApi) => Element;
```

Defined in: [packages/solid-form/src/Components.public.ts:111](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Components.public.ts#L111)

#### Parameters

##### fieldApi

[`SolidFieldApi`](../type-aliases/SolidFieldApi.md)\<`TFieldName`, `TFieldValue`, `FallbackToValidationIssue`\<
  \| `ExtractValidatorFieldError`\<`NoInfer`\<`TFieldValidators`\>, `FieldValidators`\<`any`, `any`, `any`\>\>
  \| `ExtractFormFieldError`\<`TFormError`\>\>, `TFormData`, `TFormError`, `Record`\<`never`, `never`\>\>

#### Returns

`Element`

#### Inherited from

[`SolidFormFieldProps`](SolidFormFieldProps.md).[`children`](SolidFormFieldProps.md#children)
