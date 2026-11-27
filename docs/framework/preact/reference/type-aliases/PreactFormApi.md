---
id: PreactFormApi
title: PreactFormApi
---

```ts
type PreactFormApi<TFormData, TFormError, TComponents> = unknown extends TComponents["formComponents"] ? ExtendedFormApi<TFormData, TFormError, TComponents["fieldComponents"]> : ExtendedFormApi<TFormData, TFormError, TComponents["fieldComponents"]> & TComponents["formComponents"];
```

Defined in: [packages/preact-form/src/PreactForm/formApiTypes.public.ts:13](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/formApiTypes.public.ts#L13)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TComponents

`TComponents` *extends* [`AnyPreactFormComponentMap`](AnyPreactFormComponentMap.md)
