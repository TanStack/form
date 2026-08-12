---
id: VueFormApi
title: VueFormApi
---

# Type Alias: VueFormApi\<TFormData, TFormErrorTypes, TComponents\>

```ts
type VueFormApi<TFormData, TFormErrorTypes, TComponents> = unknown extends TComponents["formComponents"] ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents["fieldComponents"]> : ExtendedFormApi<TFormData, TFormErrorTypes, TComponents["fieldComponents"]> & TComponents["formComponents"];
```

Defined in: [packages/vue-form/src/VueForm/formApiTypes.public.ts:16](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/VueForm/formApiTypes.public.ts#L16)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TComponents

`TComponents` *extends* [`AnyVueFormComponentMap`](AnyVueFormComponentMap.md) = [`DefaultVueFormComponentMap`](DefaultVueFormComponentMap.md)
