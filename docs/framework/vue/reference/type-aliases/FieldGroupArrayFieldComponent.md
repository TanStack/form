---
id: FieldGroupArrayFieldComponent
title: FieldGroupArrayFieldComponent
---

```ts
type FieldGroupArrayFieldComponent<TFieldData, TFieldComponents> = <TFieldName>(props) => VueComponentInstance<VueFormFieldProps<TFieldData, TFieldName, DeepValue<TFieldData, TFieldName>, FieldValidators<TFieldData, TFieldName, DeepValue<TFieldData, TFieldName>>, ScopedErrorTypes, unknown, ScopedErrorTypes, TFieldComponents>, {
  default: {
     field: VueFieldApi<TFieldName, DeepValue<TFieldData, TFieldName>, ToFieldError<FieldValidators<TFieldData, TFieldName, DeepValue<TFieldData, TFieldName>>, ScopedErrorTypes, ScopedErrorTypes>, unknown, ScopedErrorTypes, TFieldComponents>;
  };
}>;
```

Defined in: [packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts:69](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts#L69)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\>

## Parameters

### props

[`VueFormFieldProps`](../interfaces/VueFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ScopedErrorTypes`, `unknown`, `ScopedErrorTypes`, `TFieldComponents`\> & `PublicProps`

## Returns

`VueComponentInstance`\<[`VueFormFieldProps`](../interfaces/VueFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ScopedErrorTypes`, `unknown`, `ScopedErrorTypes`, `TFieldComponents`\>, \{
  `default`: \{
     `field`: [`VueFieldApi`](VueFieldApi.md)\<`TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `ToFieldError`\<`FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ScopedErrorTypes`, `ScopedErrorTypes`\>, `unknown`, `ScopedErrorTypes`, `TFieldComponents`\>;
  \};
\}\>
