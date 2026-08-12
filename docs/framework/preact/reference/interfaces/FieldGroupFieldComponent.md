---
id: FieldGroupFieldComponent
title: FieldGroupFieldComponent
---

# Interface: FieldGroupFieldComponent()\<TFieldData, TFieldComponents\>

Defined in: [packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts:20](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts#L20)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

```ts
FieldGroupFieldComponent<TFieldName>(props): ComponentChildren;
```

Defined in: [packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts:24](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts#L24)

## Type Parameters

### TFieldName

`TFieldName` *extends* `string`

## Parameters

### props

[`PreactFormFieldProps`](PreactFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ValidationIssue`, `unknown`, `FormErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `TFieldComponents`\>

## Returns

`ComponentChildren`
