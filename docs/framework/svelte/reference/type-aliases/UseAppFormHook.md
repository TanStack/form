---
id: UseAppFormHook
title: UseAppFormHook
---

```ts
type UseAppFormHook<TComponents> = <TFormData, TValidatorConfig, TValidators, TSubmitReturn>(options) => SvelteAppFormApi<TFormData, GetFormErrorTypes<TValidators, TSubmitReturn>, TComponents>;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:97](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L97)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnySvelteFormComponentMap`](AnySvelteFormComponentMap.md)

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

[`SvelteAppFormApi`](SvelteAppFormApi.md)\<`TFormData`, `GetFormErrorTypes`\<`TValidators`, `TSubmitReturn`\>, `TComponents`\>
