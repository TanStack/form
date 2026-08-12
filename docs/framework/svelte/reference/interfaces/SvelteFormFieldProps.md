---
id: SvelteFormFieldProps
title: SvelteFormFieldProps
---

# Interface: SvelteFormFieldProps\<TFieldData, TFieldName, TFieldValue, TFieldValidators, TGroupFieldError, TFormData, TFormErrorTypes, TFieldComponents\>

Defined in: [packages/svelte-form/src/Components.public.ts:100](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L100)

## Extends

- `FieldApiOptions`\<`TFieldData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `TGroupFieldError`, `TFormData`, `TFormErrorTypes`\>

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
children: Snippet<[SvelteFieldApi<TFieldName, TFieldValue, FallbackToValidationIssue<
  | ExtractValidatorFieldError<NoInfer<TFieldValidators>, FieldValidators<any, any, any>>
  | unknown extends TGroupFieldError ? never : TGroupFieldError
| ExtractFormFieldError<TFormErrorTypes>>, TFormData, TFormErrorTypes, TFieldComponents>]>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:118](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L118)
