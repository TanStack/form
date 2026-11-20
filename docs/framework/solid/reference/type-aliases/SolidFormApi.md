---
id: SolidFormApi
title: SolidFormApi
---

```ts
type SolidFormApi<TFormData, TFormError, TComponents> = unknown extends TComponents["formComponents"] ? ExtendedFormApi<TFormData, TFormError, TComponents["fieldComponents"]> : ExtendedFormApi<TFormData, TFormError, TComponents["fieldComponents"]> & TComponents["formComponents"];
```

Defined in: [packages/solid-form/src/formApiTypes.public.ts:16](https://github.com/TanStack/form/blob/main/packages/solid-form/src/formApiTypes.public.ts#L16)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TComponents

`TComponents` *extends* [`AnySolidFormComponentMap`](AnySolidFormComponentMap.md) = [`DefaultSolidFormComponentMap`](DefaultSolidFormComponentMap.md)
