---
id: SvelteFormType
title: SvelteFormType
---

# Type Alias: SvelteFormType\<TOptions\>

```ts
type SvelteFormType<TOptions> = TOptions extends AppFormOptions<infer TData, infer TValidators, infer TSubmitReturn, infer TComponents> ? SvelteFormApi<TData, SvelteFormTypeErrorTypes<TValidators, TSubmitReturn>, TComponents> : TOptions extends FormOptions<infer TData, infer TValidators, infer TSubmitReturn> ? SvelteFormApi<TData, SvelteFormTypeErrorTypes<TValidators, TSubmitReturn>, DefaultSvelteFormComponentMap> : never;
```

Defined in: [packages/svelte-form/src/formType.public.ts:21](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/formType.public.ts#L21)

## Type Parameters

### TOptions

`TOptions` *extends* 
  \| `AnyFormOptions`
  \| [`AppFormOptions`](../interfaces/AppFormOptions.md)\<`any`, `any`, `any`, [`AnySvelteFormComponentMap`](AnySvelteFormComponentMap.md)\>
