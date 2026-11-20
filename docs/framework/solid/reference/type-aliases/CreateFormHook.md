---
id: CreateFormHook
title: CreateFormHook
---

```ts
type CreateFormHook = <TFormData, TValidatorConfig, TValidators, TSubmitReturn>(options) => SolidFormApi<TFormData, GetFormErrorTypes<TValidators, TSubmitReturn>, DefaultSolidFormComponentMap>;
```

Defined in: [packages/solid-form/src/createForm.public.ts:11](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.public.ts#L11)

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

`Accessor`\<`FormOptions`\<`TFormData`, `TValidatorConfig`, `TValidators`, `TSubmitReturn`, `unknown`\>\>

## Returns

[`SolidFormApi`](SolidFormApi.md)\<`TFormData`, `GetFormErrorTypes`\<`TValidators`, `TSubmitReturn`\>, [`DefaultSolidFormComponentMap`](DefaultSolidFormComponentMap.md)\>
