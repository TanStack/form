---
id: SolidFormApi
title: SolidFormApi
---

# Type Alias: SolidFormApi\<TFormData, TFormErrorTypes, TComponents\>

```ts
type SolidFormApi<TFormData, TFormErrorTypes, TComponents> = unknown extends TComponents["formComponents"] ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents["fieldComponents"]> : ExtendedFormApi<TFormData, TFormErrorTypes, TComponents["fieldComponents"]> & TComponents["formComponents"];
```

Defined in: [packages/solid-form/src/formApiTypes.public.ts:16](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/formApiTypes.public.ts#L16)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TComponents

`TComponents` *extends* [`AnySolidFormComponentMap`](AnySolidFormComponentMap.md) = [`DefaultSolidFormComponentMap`](DefaultSolidFormComponentMap.md)
