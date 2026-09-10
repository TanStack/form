---
id: UseAppFormHook
title: UseAppFormHook
---

# Type Alias: UseAppFormHook\<TComponents\>

```ts
type UseAppFormHook<TComponents> = <TFormData, TFormValidators, TSubmitReturn>(options) => PreactAppFormApi<TFormData, ToFormErrorTypes<TFormValidators, TSubmitReturn>, TComponents>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:98](https://github.com/TanStack/form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L98)

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

`FormOptions`\<`TFormData`, `TFormValidators`, `TSubmitReturn`, `unknown`\>

## Returns

[`PreactAppFormApi`](PreactAppFormApi.md)\<`TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>, `TComponents`\>
