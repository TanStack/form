---
id: SvelteFormApi
title: SvelteFormApi
---

```ts
type SvelteFormApi<TFormData, TFormError, TComponents> = unknown extends TComponents["formComponents"] ? ExtendedFormApi<TFormData, TFormError, TComponents["fieldComponents"]> : ExtendedFormApi<TFormData, TFormError, TComponents["fieldComponents"]> & TComponents["formComponents"];
```

Defined in: [packages/svelte-form/src/formApiTypes.public.ts:31](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/formApiTypes.public.ts#L31)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TComponents

`TComponents` *extends* [`AnySvelteFormComponentMap`](AnySvelteFormComponentMap.md) = [`DefaultSvelteFormComponentMap`](DefaultSvelteFormComponentMap.md)
