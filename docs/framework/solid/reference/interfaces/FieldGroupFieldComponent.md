---
id: FieldGroupFieldComponent
title: FieldGroupFieldComponent
---

# Interface: FieldGroupFieldComponent()\<TFieldData, TFieldComponents\>

Defined in: [packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts:19](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts#L19)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

```ts
FieldGroupFieldComponent<TFieldName>(props): Element;
```

Defined in: [packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts:23](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts#L23)

## Type Parameters

### TFieldName

`TFieldName` *extends* `string`

## Parameters

### props

[`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ValidationIssue`, `unknown`, `FormErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `TFieldComponents`\>

## Returns

`Element`
