---
id: SvelteFormArrayFieldComponent
title: SvelteFormArrayFieldComponent
---

```ts
type SvelteFormArrayFieldComponent<TFormData, TFormErrorTypes, TFieldComponents> = <TFieldName, TFieldValidators>(options) => SvelteComponent & Component<any> & WithoutFunction<Component>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:164](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L164)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
