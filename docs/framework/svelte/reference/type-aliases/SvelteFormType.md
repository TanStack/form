---
id: SvelteFormType
title: SvelteFormType
---

# Type Alias: SvelteFormType\<TOptions\>

```ts
type SvelteFormType<TOptions> = TOptions extends FormOptions<infer TData, infer TValidators, infer TSubmitReturn, infer TComponents> ? SvelteFormApi<TData, SvelteFormTypeErrorTypes<TValidators, TSubmitReturn>, TComponents extends AnySvelteFormComponentMap ? TComponents : DefaultSvelteFormComponentMap> : never;
```

Defined in: [packages/svelte-form/src/formType.public.ts:20](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/formType.public.ts#L20)

## Type Parameters

### TOptions

`TOptions` *extends* `AnyFormOptions`
