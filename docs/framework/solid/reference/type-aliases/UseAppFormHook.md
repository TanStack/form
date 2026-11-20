---
id: UseAppFormHook
title: UseAppFormHook
---

```ts
type UseAppFormHook<TComponents> = <TFormData, TValidatorConfig, TValidators, TSubmitReturn>(options) => SolidAppFormApi<TFormData, GetFormErrorTypes<TValidators, TSubmitReturn>, TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:97](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L97)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnySolidFormComponentMap`](AnySolidFormComponentMap.md)

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

[`SolidAppFormApi`](SolidAppFormApi.md)\<`TFormData`, `GetFormErrorTypes`\<`TValidators`, `TSubmitReturn`\>, `TComponents`\>
