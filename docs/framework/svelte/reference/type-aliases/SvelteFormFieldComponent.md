---
id: SvelteFormFieldComponent
title: SvelteFormFieldComponent
---

```ts
type SvelteFormFieldComponent<TFormData, TFormError, TFieldComponents> = <TFieldName, TFieldValidators>(options) => SvelteComponent & Component<any> & WithoutFunction<Component>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:133](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L133)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
