---
id: PreactFormType
title: PreactFormType
---

# Type Alias: PreactFormType\<TOptions\>

```ts
type PreactFormType<TOptions> = TOptions extends AppFormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn, infer TComponents> ? PreactFormApi<TFormData, PreactFormTypeErrorTypes<TFormValidators, TSubmitReturn>, TComponents> : TOptions extends FormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn> ? PreactFormApi<TFormData, PreactFormTypeErrorTypes<TFormValidators, TSubmitReturn>, DefaultPreactFormComponentMap> : never;
```

Defined in: [packages/preact-form/src/PreactForm/formType.public.ts:27](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/PreactForm/formType.public.ts#L27)

## Type Parameters

### TOptions

`TOptions` *extends* 
  \| `AnyFormOptions`
  \| [`AppFormOptions`](../interfaces/AppFormOptions.md)\<`any`, `any`, `any`, [`AnyPreactFormComponentMap`](AnyPreactFormComponentMap.md)\>
