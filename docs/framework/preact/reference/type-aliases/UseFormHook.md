---
id: UseFormHook
title: UseFormHook
---

# Type Alias: UseFormHook\<TComponents\>

```ts
type UseFormHook<TComponents> = <TFormData, TFormValidators, TSubmitReturn>(options) => PreactFormApi<TFormData, ToFormErrorTypes<TFormValidators, TSubmitReturn>, TComponents>;
```

Defined in: [packages/preact-form/src/PreactForm/useForm.public.ts:13](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/PreactForm/useForm.public.ts#L13)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyPreactFormComponentMap`](AnyPreactFormComponentMap.md)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* `FormValidators`\<`TFormData`\>

### TSubmitReturn

`TSubmitReturn`

## Parameters

### options

`FormOptions`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

## Returns

[`PreactFormApi`](PreactFormApi.md)\<`TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>, `TComponents`\>
