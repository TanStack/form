---
id: ReactFormType
title: ReactFormType
---

# Type Alias: ReactFormType\<TOptions\>

```ts
type ReactFormType<TOptions> = TOptions extends AppFormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn, infer TComponents> ? ReactFormApi<TFormData, ReactFormTypeErrorTypes<TFormValidators, TSubmitReturn>, TComponents> : TOptions extends FormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn> ? ReactFormApi<TFormData, ReactFormTypeErrorTypes<TFormValidators, TSubmitReturn>, DefaultReactFormComponentMap> : never;
```

Defined in: [packages/react-form/src/ReactForm/formType.public.ts:27](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/formType.public.ts#L27)

## Type Parameters

### TOptions

`TOptions` *extends* 
  \| `AnyFormOptions`
  \| [`AppFormOptions`](../interfaces/AppFormOptions.md)\<`any`, `any`, `any`, [`AnyReactFormComponentMap`](AnyReactFormComponentMap.md)\>
