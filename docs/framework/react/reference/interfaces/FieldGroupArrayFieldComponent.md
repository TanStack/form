---
id: FieldGroupArrayFieldComponent
title: FieldGroupArrayFieldComponent
---

# Interface: FieldGroupArrayFieldComponent()\<TFieldData, TFieldComponents\>

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:41](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L41)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

```ts
FieldGroupArrayFieldComponent<TFieldName>(props): ReactNode;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:45](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L45)

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

## Parameters

### props

[`ReactFormFieldProps`](ReactFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ValidationIssue`, `unknown`, `FormErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `TFieldComponents`\>

## Returns

`ReactNode`
