---
id: VueFormArrayFieldComponent
title: VueFormArrayFieldComponent
---

```ts
type VueFormArrayFieldComponent<TFormData, TFormError, TFieldComponents> = <TFieldName, TFieldValidators>(props) => VueComponentInstance<VueFormFieldProps<TFormData, TFieldName, DeepValue<TFormData, TFieldName>, TFieldValidators, never, TFormData, TFormError, TFieldComponents>, {
  default: {
     field: VueFieldApi<TFieldName, DeepValue<TFormData, TFieldName>, ToFieldError<NoInfer<TFieldValidators>, never, TFormError>, TFormData, TFormError, TFieldComponents>;
  };
}>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:169](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L169)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Parameters

### props

[`VueFormFieldProps`](../interfaces/VueFormFieldProps.md)\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormError`, `TFieldComponents`\> & `PublicProps`

## Returns

`VueComponentInstance`\<[`VueFormFieldProps`](../interfaces/VueFormFieldProps.md)\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormError`, `TFieldComponents`\>, \{
  `default`: \{
     `field`: [`VueFieldApi`](VueFieldApi.md)\<`TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `ToFieldError`\<`NoInfer`\<`TFieldValidators`\>, `never`, `TFormError`\>, `TFormData`, `TFormError`, `TFieldComponents`\>;
  \};
\}\>
