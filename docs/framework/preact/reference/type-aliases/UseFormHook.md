---
id: UseFormHook
title: UseFormHook
---

```ts
type UseFormHook<TComponents> = <TFormData, TValidatorConfig, TValidators, TSubmitReturn>(options) => PreactFormApi<TFormData, GetFormErrorTypes<TValidators, TSubmitReturn>, TComponents>;
```

Defined in: [packages/preact-form/src/PreactForm/useForm.public.ts:13](https://github.com/TanStack/form/blob/main/packages/preact-form/src/PreactForm/useForm.public.ts#L13)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyPreactFormComponentMap`](AnyPreactFormComponentMap.md)

## Type Parameters

### TFormData

`TFormData`

### TValidatorConfig

`TValidatorConfig` *extends* `unknown`[]

### TValidators

`TValidators`

### TSubmitReturn

`TSubmitReturn`

## Parameters

### options

`FormOptions`\<`TFormData`, `TValidatorConfig`, `TValidators`, `TSubmitReturn`, `unknown`\>

## Returns

[`PreactFormApi`](PreactFormApi.md)\<`TFormData`, `GetFormErrorTypes`\<`TValidators`, `TSubmitReturn`\>, `TComponents`\>
