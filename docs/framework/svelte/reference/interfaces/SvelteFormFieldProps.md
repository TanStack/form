---
id: SvelteFormFieldProps
title: SvelteFormFieldProps
---

Defined in: [packages/svelte-form/src/Components.public.ts:101](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L101)

## Extends

- `FieldApiOptions`\<`TFieldData`, `TFieldName`, `TFieldValue`, `TFieldValidators`, `TGroupFieldError`, `TFormData`, `TFormError`\>

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

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

## Properties

### children

```ts
children: Snippet<[SvelteFieldApi<TFieldName, TFieldValue, FallbackToValidationIssue<
  | ExtractValidatorFieldError<NoInfer<TFieldValidators>, FieldValidators<any, any, any>>
  | unknown extends TGroupFieldError ? never : TGroupFieldError
| ExtractFormFieldError<TFormError>>, TFormData, TFormError, TFieldComponents>]>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:119](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L119)
