---
id: PreactFormApi
title: PreactFormApi
---

# Type Alias: PreactFormApi\<TFormData, TFormErrorTypes, TComponents\>

```ts
type PreactFormApi<TFormData, TFormErrorTypes, TComponents> = unknown extends TComponents["formComponents"] ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents["fieldComponents"]> : ExtendedFormApi<TFormData, TFormErrorTypes, TComponents["fieldComponents"]> & TComponents["formComponents"];
```

Defined in: [packages/preact-form/src/PreactForm/formApiTypes.public.ts:13](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/PreactForm/formApiTypes.public.ts#L13)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TComponents

`TComponents` *extends* [`AnyPreactFormComponentMap`](AnyPreactFormComponentMap.md)
