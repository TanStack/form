---
id: SvelteFormFieldComponent
title: SvelteFormFieldComponent
---

# Type Alias: SvelteFormFieldComponent\<TFormData, TFormErrorTypes, TFieldComponents\>

```ts
type SvelteFormFieldComponent<TFormData, TFormErrorTypes, TFieldComponents> = <TFieldName, TFieldValidators>(options) => SvelteComponent & Component<any> & WithoutFunction<Component>;
```

Defined in: [packages/svelte-form/src/Components.public.ts:136](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/Components.public.ts#L136)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
