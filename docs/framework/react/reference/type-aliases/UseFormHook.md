---
id: UseFormHook
title: UseFormHook
---

# Type Alias: UseFormHook()\<TComponents\>

```ts
type UseFormHook<TComponents> = <TFormData, TFormValidators, TSubmitReturn>(options) => ReactFormApi<TFormData, ToFormErrorTypes<TFormValidators, TSubmitReturn>, TComponents>;
```

Defined in: [packages/react-form/src/ReactForm/useForm.public.ts:13](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/useForm.public.ts#L13)

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

[`ReactFormApi`](ReactFormApi.md)\<`TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>, `TComponents`\>
