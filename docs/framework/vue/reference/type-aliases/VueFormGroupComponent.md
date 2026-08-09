---
id: VueFormGroupComponent
title: VueFormGroupComponent
---

# Type Alias: VueFormGroupComponent()\<TFormData, TFormErrorTypes, TFieldComponents\>

```ts
type VueFormGroupComponent<TFormData, TFormErrorTypes, TFieldComponents> = <TGroupName, TGroupValue, TGroupValidators>(props) => VueComponentInstance<VueFormGroupProps<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormErrorTypes, TFieldComponents>, {
  default: {
     group: VueFormGroupApi<TFormData, TGroupName, TGroupValue, ToFormGroupErrorTypes<NoInfer<TGroupValidators>>, TFormErrorTypes, TFieldComponents>;
  };
}>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:394](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L394)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Parameters

### props

[`VueFormGroupProps`](../interfaces/VueFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormErrorTypes`, `TFieldComponents`\> & `PublicProps`

## Returns

`VueComponentInstance`\<[`VueFormGroupProps`](../interfaces/VueFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormErrorTypes`, `TFieldComponents`\>, \{
  `default`: \{
     `group`: [`VueFormGroupApi`](../interfaces/VueFormGroupApi.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupErrorTypes`\<`NoInfer`\<`TGroupValidators`\>\>, `TFormErrorTypes`, `TFieldComponents`\>;
  \};
\}\>
