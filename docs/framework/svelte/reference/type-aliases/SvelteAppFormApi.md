---
id: SvelteAppFormApi
title: SvelteAppFormApi
---

# Type Alias: SvelteAppFormApi\<TFormData, TFormErrorTypes, TComponents\>

```ts
type SvelteAppFormApi<TFormData, TFormErrorTypes, TComponents> = SvelteFormApi<TFormData, TFormErrorTypes, TComponents> & object;
```

Defined in: [packages/svelte-form/src/AppForm/SvelteAppFormApi.public.ts:8](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/SvelteAppFormApi.public.ts#L8)

## Type Declaration

### AppForm

```ts
AppForm: AppFormComponent;
```

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TComponents

`TComponents` *extends* [`AnySvelteFormComponentMap`](AnySvelteFormComponentMap.md)
