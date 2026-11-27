---
id: VueFormApi
title: VueFormApi
---

```ts
type VueFormApi<TFormData, TFormError, TComponents> = unknown extends TComponents["formComponents"] ? ExtendedFormApi<TFormData, TFormError, TComponents["fieldComponents"]> : ExtendedFormApi<TFormData, TFormError, TComponents["fieldComponents"]> & TComponents["formComponents"];
```

Defined in: [packages/vue-form/src/VueForm/formApiTypes.public.ts:16](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/formApiTypes.public.ts#L16)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TComponents

`TComponents` *extends* [`AnyVueFormComponentMap`](AnyVueFormComponentMap.md) = [`DefaultVueFormComponentMap`](DefaultVueFormComponentMap.md)
