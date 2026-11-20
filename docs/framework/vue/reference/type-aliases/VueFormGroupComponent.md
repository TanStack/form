---
id: VueFormGroupComponent
title: VueFormGroupComponent
---

```ts
type VueFormGroupComponent<TFormData, TFormError, TFieldComponents> = <TGroupName, TGroupValue, TGroupValidators>(props) => VueComponentInstance<VueFormGroupProps<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormError, TFieldComponents>, {
  default: {
     group: VueFormGroupApi<TFormData, TGroupName, TGroupValue, ToFormGroupErrorTypes<NoInfer<TGroupValidators>>, TFormError, TFieldComponents>;
  };
}>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:393](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L393)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Parameters

### props

[`VueFormGroupProps`](../interfaces/VueFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`, `TFieldComponents`\> & `PublicProps`

## Returns

`VueComponentInstance`\<[`VueFormGroupProps`](../interfaces/VueFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`, `TFieldComponents`\>, \{
  `default`: \{
     `group`: [`VueFormGroupApi`](../interfaces/VueFormGroupApi.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupErrorTypes`\<`NoInfer`\<`TGroupValidators`\>\>, `TFormError`, `TFieldComponents`\>;
  \};
\}\>
