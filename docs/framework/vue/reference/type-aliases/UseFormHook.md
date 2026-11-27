---
id: UseFormHook
title: UseFormHook
---

```ts
type UseFormHook<TComponents> = <TFormData, TValidatorConfig, TValidators, TSubmitReturn>(options) => VueFormApi<TFormData, GetFormErrorTypes<TValidators, TSubmitReturn>, TComponents>;
```

Defined in: [packages/vue-form/src/VueForm/useForm.public.ts:13](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/useForm.public.ts#L13)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyVueFormComponentMap`](AnyVueFormComponentMap.md)

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

[`VueFormApi`](VueFormApi.md)\<`TFormData`, `GetFormErrorTypes`\<`TValidators`, `TSubmitReturn`\>, `TComponents`\>
