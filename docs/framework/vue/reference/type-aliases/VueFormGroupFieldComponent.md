---
id: VueFormGroupFieldComponent
title: VueFormGroupFieldComponent
---

```ts
type VueFormGroupFieldComponent<TFormData, TGroupValue, TGroupError, TFormError, TFieldComponents> = <TFieldName, TFieldValidators>(props) => VueComponentInstance<VueFormFieldProps<TGroupValue, TFieldName, DeepValue<TGroupValue, TFieldName>, TFieldValidators, TGroupError, TFormData, TFormError, TFieldComponents>, {
  default: {
     field: VueFieldApi<TFieldName, DeepValue<TGroupValue, TFieldName>, ToFieldError<NoInfer<TFieldValidators>, TGroupError, TFormError>, TFormData, TFormError, TFieldComponents>;
  };
}>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:234](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L234)

## Type Parameters

### TFormData

`TFormData`

### TGroupValue

`TGroupValue`

### TGroupError

`TGroupError` *extends* `ScopedErrorTypes`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Parameters

### props

[`VueFormFieldProps`](../interfaces/VueFormFieldProps.md)\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupError`, `TFormData`, `TFormError`, `TFieldComponents`\> & `PublicProps`

## Returns

`VueComponentInstance`\<[`VueFormFieldProps`](../interfaces/VueFormFieldProps.md)\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupError`, `TFormData`, `TFormError`, `TFieldComponents`\>, \{
  `default`: \{
     `field`: [`VueFieldApi`](VueFieldApi.md)\<`TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `ToFieldError`\<`NoInfer`\<`TFieldValidators`\>, `TGroupError`, `TFormError`\>, `TFormData`, `TFormError`, `TFieldComponents`\>;
  \};
\}\>
