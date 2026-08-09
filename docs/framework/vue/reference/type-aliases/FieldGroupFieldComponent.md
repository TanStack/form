---
id: FieldGroupFieldComponent
title: FieldGroupFieldComponent
---

# Type Alias: FieldGroupFieldComponent\<TFieldData, TFieldComponents\>

```ts
type FieldGroupFieldComponent<TFieldData, TFieldComponents> = <TFieldName>(props) => VueComponentInstance<VueFormFieldProps<TFieldData, TFieldName, DeepValue<TFieldData, TFieldName>, FieldValidators<TFieldData, TFieldName, DeepValue<TFieldData, TFieldName>>, ValidationIssue, unknown, FormErrorTypes, TFieldComponents>, {
  default: {
     field: VueFieldApi<TFieldName, DeepValue<TFieldData, TFieldName>, ToFieldError<FieldValidators<TFieldData, TFieldName, DeepValue<TFieldData, TFieldName>>, ValidationIssue, FormErrorTypes>, unknown, FormErrorTypes, TFieldComponents>;
  };
}>;
```

Defined in: [packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts:22](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts#L22)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Parameters

### props

[`VueFormFieldProps`](../interfaces/VueFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ValidationIssue`, `unknown`, `FormErrorTypes`, `TFieldComponents`\> & `PublicProps`

## Returns

`VueComponentInstance`\<[`VueFormFieldProps`](../interfaces/VueFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ValidationIssue`, `unknown`, `FormErrorTypes`, `TFieldComponents`\>, \{
  `default`: \{
     `field`: [`VueFieldApi`](VueFieldApi.md)\<`TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `ToFieldError`\<`FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ValidationIssue`, `FormErrorTypes`\>, `unknown`, `FormErrorTypes`, `TFieldComponents`\>;
  \};
\}\>
