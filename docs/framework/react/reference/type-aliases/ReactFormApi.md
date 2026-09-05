---
id: ReactFormApi
title: ReactFormApi
---

# Type Alias: ReactFormApi\<TFormData, TFormErrorTypes, TComponents\>

```ts
type ReactFormApi<TFormData, TFormErrorTypes, TComponents> = unknown extends TComponents["formComponents"] ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents["fieldComponents"]> : ExtendedFormApi<TFormData, TFormErrorTypes, TComponents["fieldComponents"]> & TComponents["formComponents"];
```

Defined in: [packages/react-form/src/ReactForm/formApiTypes.public.ts:15](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/formApiTypes.public.ts#L15)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TComponents

`TComponents` *extends* [`AnyReactFormComponentMap`](AnyReactFormComponentMap.md)
