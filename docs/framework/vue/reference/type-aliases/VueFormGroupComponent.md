---
id: VueFormGroupComponent
title: VueFormGroupComponent
---

```ts
type VueFormGroupComponent<TFormData, TFormError, TFieldComponents> = <TGroupName, TGroupValue, TGroupValidators, TSubmitReturn>(props) => VueComponentInstance<VueFormGroupProps<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormError, TFieldComponents, TSubmitReturn>, {
  default: {
     group: VueFormGroupApi<TFormData, TGroupName, TGroupValue, ToFormGroupErrorTypes<NoInfer<TGroupValidators>, NoInfer<TSubmitReturn>>, TFormError, TFieldComponents>;
  };
}>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:387](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L387)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Parameters

### props

[`VueFormGroupProps`](../interfaces/VueFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`, `TFieldComponents`, `TSubmitReturn`\> & `PublicProps`

## Returns

`VueComponentInstance`\<[`VueFormGroupProps`](../interfaces/VueFormGroupProps.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`, `TFieldComponents`, `TSubmitReturn`\>, \{
  `default`: \{
     `group`: [`VueFormGroupApi`](../interfaces/VueFormGroupApi.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupErrorTypes`\<`NoInfer`\<`TGroupValidators`\>, `NoInfer`\<`TSubmitReturn`\>\>, `TFormError`, `TFieldComponents`\>;
  \};
\}\>
