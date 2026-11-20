---
id: SvelteFormType
title: SvelteFormType
---

```ts
type SvelteFormType<TOptions> = TOptions extends FormOptions<infer TData, any, infer TValidators, infer TSubmitReturn, infer TComponents> ? SvelteFormApi<TData, GetSharedFormErrorTypes<TValidators, TSubmitReturn>, TComponents extends AnySvelteFormComponentMap ? TComponents : DefaultSvelteFormComponentMap> : never;
```

Defined in: [packages/svelte-form/src/formType.public.ts:13](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/formType.public.ts#L13)

## Type Parameters

### TOptions

`TOptions` *extends* `AnyFormOptions`
