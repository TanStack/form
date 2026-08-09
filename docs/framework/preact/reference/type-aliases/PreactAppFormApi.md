---
id: PreactAppFormApi
title: PreactAppFormApi
---

# Type Alias: PreactAppFormApi\<TFormData, TFormErrorTypes, TComponents\>

```ts
type PreactAppFormApi<TFormData, TFormErrorTypes, TComponents> = PreactFormApi<TFormData, TFormErrorTypes, TComponents> & object;
```

Defined in: [packages/preact-form/src/AppForm/PreactAppFormApi.public.tsx:11](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/AppForm/PreactAppFormApi.public.tsx#L11)

## Type Declaration

### AppForm

```ts
AppForm: AppFormComponent;
```

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TComponents

`TComponents` *extends* [`AnyPreactFormComponentMap`](AnyPreactFormComponentMap.md)
