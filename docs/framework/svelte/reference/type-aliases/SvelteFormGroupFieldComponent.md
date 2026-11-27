---
id: SvelteFormGroupFieldComponent
title: SvelteFormGroupFieldComponent
---

```ts
type SvelteFormGroupFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents> = <TFieldName, TFieldValidators>(options) => SvelteComponent & Component<any> & WithoutFunction<Component>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:200](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L200)

## Type Parameters

### TFormData

`TFormData`

### TGroupValue

`TGroupValue`

### TGroupError

`TGroupError` *extends* `ScopedErrorTypes`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
