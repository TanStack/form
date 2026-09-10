---
id: SvelteFormGroupArrayFieldComponent
title: SvelteFormGroupArrayFieldComponent
---

# Type Alias: SvelteFormGroupArrayFieldComponent\<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

```ts
type SvelteFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents> = <TFieldName, TFieldValidators>(options) => SvelteComponent & Component<any> & WithoutFunction<Component>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:236](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/Components.public.ts#L236)

## Type Parameters

### TFormData

`TFormData`

### TGroupValue

`TGroupValue`

### TGroupErrorTypes

`TGroupErrorTypes` *extends* `FormErrorTypes`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
