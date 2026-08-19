---
id: UseFormHook
title: UseFormHook
---

# Type Alias: UseFormHook\<TComponents\>

```ts
type UseFormHook<TComponents> = <TFormData, TFormValidators, TSubmitReturn>(options) => VueFormApi<TFormData, ToFormErrorTypes<TFormValidators, TSubmitReturn>, TComponents>;
```

Defined in: [packages/vue-form/src/VueForm/useForm.public.ts:13](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/useForm.public.ts#L13)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyVueFormComponentMap`](AnyVueFormComponentMap.md)

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

[`VueFormApi`](VueFormApi.md)\<`TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>, `TComponents`\>
