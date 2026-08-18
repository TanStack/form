---
id: UseAppFormHook
title: UseAppFormHook
---

# Type Alias: UseAppFormHook\<TComponents\>

```ts
type UseAppFormHook<TComponents> = <TFormData, TFormValidators, TSubmitReturn>(options) => ReactAppFormApi<TFormData, ToFormErrorTypes<TFormValidators, TSubmitReturn>, TComponents>;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:98](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L98)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyReactFormComponentMap`](AnyReactFormComponentMap.md)

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

[`ReactAppFormApi`](ReactAppFormApi.md)\<`TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>, `TComponents`\>
