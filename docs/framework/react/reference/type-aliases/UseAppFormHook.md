---
id: UseAppFormHook
title: UseAppFormHook
---

```ts
type UseAppFormHook<TComponents> = <TFormData, TValidatorConfig, TValidators, TSubmitReturn>(options) => ReactFormApi<TFormData, GetFormErrorTypes<TValidators, TSubmitReturn>, TComponents>;
```

Defined in: [packages/react-form/src/AppForm/createFormHook.public.ts:120](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHook.public.ts#L120)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyReactFormComponentMap`](AnyReactFormComponentMap.md)

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

[`ReactFormApi`](ReactFormApi.md)\<`TFormData`, `GetFormErrorTypes`\<`TValidators`, `TSubmitReturn`\>, `TComponents`\>
