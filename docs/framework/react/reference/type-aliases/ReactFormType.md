---
id: ReactFormType
title: ReactFormType
---

# Type Alias: ReactFormType\<TOptions\>

```ts
type ReactFormType<TOptions> = TOptions extends AppFormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn, infer TComponents> ? ReactFormApi<TFormData, ToFormValidatorMetas<TFormValidators>, ReactFormTypeSubmitMeta<TSubmitReturn>, TComponents> : TOptions extends FormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn> ? ReactFormApi<TFormData, ToFormValidatorMetas<TFormValidators>, ReactFormTypeSubmitMeta<TSubmitReturn>, DefaultReactFormComponentMap> : never;
```

Defined in: [packages/react-form/src/ReactForm/formType.public.ts:24](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/formType.public.ts#L24)

## Type Parameters

### TOptions

`TOptions` *extends* 
  \| `AnyFormOptions`
  \| [`AppFormOptions`](../interfaces/AppFormOptions.md)\<`any`, `any`, `any`, [`AnyReactFormComponentMap`](AnyReactFormComponentMap.md)\>
