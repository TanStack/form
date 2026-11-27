---
id: UseAppFormHook
title: UseAppFormHook
---

```ts
type UseAppFormHook<TComponents> = <TFormData, TValidatorConfig, TValidators, TSubmitReturn>(options) => PreactAppFormApi<TFormData, GetFormErrorTypes<TValidators, TSubmitReturn>, TComponents>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:97](https://github.com/TanStack/form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L97)

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

[`PreactAppFormApi`](PreactAppFormApi.md)\<`TFormData`, `GetFormErrorTypes`\<`TValidators`, `TSubmitReturn`\>, `TComponents`\>
