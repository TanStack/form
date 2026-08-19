---
id: UseAppFormHook
title: UseAppFormHook
---

# Type Alias: UseAppFormHook\<TComponents\>

```ts
type UseAppFormHook<TComponents> = <TFormData, TFormValidators, TSubmitReturn>(options) => SolidAppFormApi<TFormData, ToFormErrorTypes<TFormValidators, TSubmitReturn>, TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:98](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L98)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnySolidFormComponentMap`](AnySolidFormComponentMap.md)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* `FormValidators`\<`TFormData`\>

### TSubmitReturn

`TSubmitReturn`

## Parameters

### options

`Accessor`\<`FormOptions`\<`TFormData`, `TFormValidators`, `TSubmitReturn`, `unknown`\>\>

## Returns

[`SolidAppFormApi`](SolidAppFormApi.md)\<`TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>, `TComponents`\>
