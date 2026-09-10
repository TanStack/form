---
id: SvelteFormGroupComponent
title: SvelteFormGroupComponent
---

# Type Alias: SvelteFormGroupComponent\<TFormData, TFormErrorTypes, TFieldComponents\>

```ts
type SvelteFormGroupComponent<TFormData, TFormErrorTypes, TFieldComponents> = <TGroupName, TGroupValue, TGroupValidators>(options) => SvelteComponent & Component<any> & WithoutFunction<Component>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:328](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L328)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
