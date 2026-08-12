---
id: SvelteFormApi
title: SvelteFormApi
---

# Type Alias: SvelteFormApi\<TFormData, TFormErrorTypes, TComponents\>

```ts
type SvelteFormApi<TFormData, TFormErrorTypes, TComponents> = unknown extends TComponents["formComponents"] ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents["fieldComponents"]> : ExtendedFormApi<TFormData, TFormErrorTypes, TComponents["fieldComponents"]> & TComponents["formComponents"];
```

Defined in: [packages/svelte-form/src/formApiTypes.public.ts:31](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/formApiTypes.public.ts#L31)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TComponents

`TComponents` *extends* [`AnySvelteFormComponentMap`](AnySvelteFormComponentMap.md) = [`DefaultSvelteFormComponentMap`](DefaultSvelteFormComponentMap.md)
