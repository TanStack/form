---
id: VueFormGroupFieldComponent
title: VueFormGroupFieldComponent
---

# Type Alias: VueFormGroupFieldComponent\<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents\>

```ts
type VueFormGroupFieldComponent<TFormData, TGroupValue, TGroupErrorTypes, TFormErrorTypes, TFieldComponents> = <TFieldName, TFieldValidators>(props) => VueComponentInstance<VueFormFieldProps<TGroupValue, TFieldName, DeepValue<TGroupValue, TFieldName>, TFieldValidators, TGroupErrorTypes["fieldError"], TFormData, TFormErrorTypes, TFieldComponents>, {
  default: {
     field: VueFieldApi<TFieldName, DeepValue<TGroupValue, TFieldName>, ToFieldError<NoInfer<TFieldValidators>, TGroupErrorTypes["fieldError"], TFormErrorTypes>, TFormData, TFormErrorTypes, TFieldComponents>;
  };
}>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:235](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L235)

## Type Parameters

### TFormData

`TFormData`

### TGroupValue

`TGroupValue`

### TGroupErrorTypes

`TGroupErrorTypes` *extends* `FormErrorTypes`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Parameters

### props

[`VueFormFieldProps`](../interfaces/VueFormFieldProps.md)\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupErrorTypes`\[`"fieldError"`\], `TFormData`, `TFormErrorTypes`, `TFieldComponents`\> & `PublicProps`

## Returns

`VueComponentInstance`\<[`VueFormFieldProps`](../interfaces/VueFormFieldProps.md)\<`TGroupValue`, `TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `TFieldValidators`, `TGroupErrorTypes`\[`"fieldError"`\], `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>, \{
  `default`: \{
     `field`: [`VueFieldApi`](VueFieldApi.md)\<`TFieldName`, `DeepValue`\<`TGroupValue`, `TFieldName`\>, `ToFieldError`\<`NoInfer`\<`TFieldValidators`\>, `TGroupErrorTypes`\[`"fieldError"`\], `TFormErrorTypes`\>, `TFormData`, `TFormErrorTypes`, `TFieldComponents`\>;
  \};
\}\>
