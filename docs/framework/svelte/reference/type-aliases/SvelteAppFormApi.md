---
id: SvelteAppFormApi
title: SvelteAppFormApi
---

```ts
type SvelteAppFormApi<TFormData, TFormError, TComponents> = SvelteFormApi<TFormData, TFormError, TComponents> & object;
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

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TComponents

`TComponents` *extends* [`AnySvelteFormComponentMap`](AnySvelteFormComponentMap.md)
