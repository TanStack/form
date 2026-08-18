---
id: UseAppFormHook
title: UseAppFormHook
---

# Type Alias: UseAppFormHook\<TComponents\>

```ts
type UseAppFormHook<TComponents> = <TFormData, TFormValidators, TSubmitReturn>(options) => VueAppFormApi<TFormData, ToFormErrorTypes<TFormValidators, TSubmitReturn>, TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:98](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L98)

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

`FormOptions`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

## Returns

[`VueAppFormApi`](VueAppFormApi.md)\<`TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>, `TComponents`\>
