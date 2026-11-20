---
id: CreateForm
title: CreateForm
---

```ts
type CreateForm = <TFormData, TValidatorConfig, TValidators, TSubmitReturn>(options) => SvelteFormApi<TFormData, GetFormErrorTypes<TValidators, TSubmitReturn>, DefaultSvelteFormComponentMap>;
```

Defined in: [packages/svelte-form/src/createForm.public.ts:10](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/createForm.public.ts#L10)

## Type Parameters

### TFormData

`TFormData`

### TValidatorConfig

`TValidatorConfig` *extends* `unknown`[]

### TValidators

`TValidators`

### TSubmitReturn

`TSubmitReturn`

## Parameters

### options

() => `FormOptions`\<`TFormData`, `TValidatorConfig`, `TValidators`, `TSubmitReturn`, `unknown`\>

## Returns

[`SvelteFormApi`](SvelteFormApi.md)\<`TFormData`, `GetFormErrorTypes`\<`TValidators`, `TSubmitReturn`\>, [`DefaultSvelteFormComponentMap`](DefaultSvelteFormComponentMap.md)\>
