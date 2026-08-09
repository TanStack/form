---
id: VueFormType
title: VueFormType
---

# Type Alias: VueFormType\<TOptions\>

```ts
type VueFormType<TOptions> = TOptions extends AppFormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn, infer TComponents> ? VueFormApi<TFormData, VueFormTypeErrorTypes<TFormValidators, TSubmitReturn>, TComponents> : TOptions extends FormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn> ? VueFormApi<TFormData, VueFormTypeErrorTypes<TFormValidators, TSubmitReturn>, DefaultVueFormComponentMap> : never;
```

Defined in: [packages/vue-form/src/VueForm/formType.public.ts:21](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/formType.public.ts#L21)

## Type Parameters

### TOptions

`TOptions` *extends* 
  \| `AnyFormOptions`
  \| [`AppFormOptions`](../interfaces/AppFormOptions.md)\<`any`, `any`, `any`, [`AnyVueFormComponentMap`](AnyVueFormComponentMap.md)\>
