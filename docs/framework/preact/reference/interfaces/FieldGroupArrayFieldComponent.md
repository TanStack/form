---
id: FieldGroupArrayFieldComponent
title: FieldGroupArrayFieldComponent
---

# Interface: FieldGroupArrayFieldComponent()\<TFieldData, TFieldComponents\>

Defined in: [packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts:42](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts#L42)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

```ts
FieldGroupArrayFieldComponent<TFieldName>(props): ComponentChildren;
```

Defined in: [packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts:46](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts#L46)

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

## Parameters

### props

[`PreactFormFieldProps`](PreactFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ValidationIssue`, `unknown`, `FormErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `TFieldComponents`\>

## Returns

`ComponentChildren`
