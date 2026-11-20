---
id: ReactFormApi
title: ReactFormApi
---

```ts
type ReactFormApi<TFormData, TFormError, TComponents> = unknown extends TComponents["formComponents"] ? ExtendedFormApi<TFormData, TFormError, TComponents["fieldComponents"]> : ExtendedFormApi<TFormData, TFormError, TComponents["fieldComponents"]> & TComponents["formComponents"];
```

Defined in: [packages/react-form/src/ReactForm/formApiTypes.public.ts:15](https://github.com/TanStack/form/blob/main/packages/react-form/src/ReactForm/formApiTypes.public.ts#L15)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TComponents

`TComponents` *extends* [`AnyReactFormComponentMap`](AnyReactFormComponentMap.md)
