---
id: SvelteFormArrayFieldComponent
title: SvelteFormArrayFieldComponent
---

```ts
type SvelteFormArrayFieldComponent<TFormData, TFormError, TFieldComponents> = <TFieldName, TFieldValidators>(options) => SvelteComponent & Component<any> & WithoutFunction<Component>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:161](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L161)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
