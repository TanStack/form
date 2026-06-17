---
id: ReactFormApi
title: ReactFormApi
---

# Type Alias: ReactFormApi\<TFormData, TFormValidatorMetas, TSubmitReturn, TComponents\>

```ts
type ReactFormApi<TFormData, TFormValidatorMetas, TSubmitReturn, TComponents> = unknown extends TComponents["formComponents"] ? ExtendedFormApi<TFormData, TFormValidatorMetas, TSubmitReturn, TComponents["fieldComponents"]> : ExtendedFormApi<TFormData, TFormValidatorMetas, TSubmitReturn, TComponents["fieldComponents"]> & TComponents["formComponents"];
```

Defined in: [packages/react-form/src/ReactForm/formApiTypes.public.ts:23](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/formApiTypes.public.ts#L23)

## Type Parameters

### TFormData

`TFormData`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* `FormValidatorMetas`

### TSubmitReturn

`TSubmitReturn`

### TComponents

`TComponents` *extends* [`AnyReactFormComponentMap`](AnyReactFormComponentMap.md)
