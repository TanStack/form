---
id: SvelteFieldApi
title: SvelteFieldApi
---

```ts
type SvelteFieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormError, TFieldComponents> = FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormError> & FieldComponentsMatchingType<TFieldComponents, TFieldValue>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:67](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L67)

## Type Parameters

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldError

`TFieldError`

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
