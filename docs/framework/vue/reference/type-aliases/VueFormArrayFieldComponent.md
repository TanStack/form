---
id: VueFormArrayFieldComponent
title: VueFormArrayFieldComponent
---

# Type Alias: VueFormArrayFieldComponent()\<TFormData, TFormErrorTypes, TFieldComponents\>

```ts
type VueFormArrayFieldComponent<TFormData, TFormErrorTypes, TFieldComponents> = <TFieldName, TFieldValidators>(props) => VueComponentInstance<VueFormFieldProps<TFormData, TFieldName, DeepValue<TFormData, TFieldName>, TFieldValidators, never, TFormData, TFormErrorTypes, TFieldComponents>, {
  default: {
     field: VueFieldApi<TFieldName, DeepValue<TFormData, TFieldName>, ToFieldError<NoInfer<TFieldValidators>, never, TFormErrorTypes>, TFormData, TFormErrorTypes, TFieldComponents>;
  };
}>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:170](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L170)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Parameters

### props

[`VueFormFieldProps`](../interfaces/VueFormFieldProps.md)\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormErrorTypes`, `TFieldComponents`\> & `PublicProps`

## Returns

`VueComponentInstance`\<[`VueFormFieldProps`](../interfaces/VueFormFieldProps.md)\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>, \{
  `default`: \{
     `field`: [`VueFieldApi`](VueFieldApi.md)\<`TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `ToFieldError`\<`NoInfer`\<`TFieldValidators`\>, `never`, `TFormErrorTypes`\>, `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>;
  \};
\}\>
