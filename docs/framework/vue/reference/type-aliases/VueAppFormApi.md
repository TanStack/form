---
id: VueAppFormApi
title: VueAppFormApi
---

# Type Alias: VueAppFormApi\<TFormData, TFormErrorTypes, TComponents\>

```ts
type VueAppFormApi<TFormData, TFormErrorTypes, TComponents> = VueFormApi<TFormData, TFormErrorTypes, TComponents> & object;
```

Defined in: [packages/vue-form/src/AppForm/VueAppFormApi.public.ts:11](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/AppForm/VueAppFormApi.public.ts#L11)

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

`TComponents` *extends* [`AnyVueFormComponentMap`](AnyVueFormComponentMap.md)
