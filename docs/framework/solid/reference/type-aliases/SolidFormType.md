---
id: SolidFormType
title: SolidFormType
---

# Type Alias: SolidFormType\<TOptions\>

```ts
type SolidFormType<TOptions> = TOptions extends AppFormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn, infer TComponents> ? SolidFormApi<TFormData, SolidFormTypeErrorTypes<TFormValidators, TSubmitReturn>, TComponents> : TOptions extends FormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn> ? SolidFormApi<TFormData, SolidFormTypeErrorTypes<TFormValidators, TSubmitReturn>, DefaultSolidFormComponentMap> : never;
```

Defined in: [packages/solid-form/src/formType.public.ts:21](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/formType.public.ts#L21)

## Type Parameters

### TOptions

`TOptions` *extends* 
  \| `AnyFormOptions`
  \| [`AppFormOptions`](../interfaces/AppFormOptions.md)\<`any`, `any`, `any`, [`AnySolidFormComponentMap`](AnySolidFormComponentMap.md)\>
