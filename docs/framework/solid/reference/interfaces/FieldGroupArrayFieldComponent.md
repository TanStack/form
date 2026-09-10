---
id: FieldGroupArrayFieldComponent
title: FieldGroupArrayFieldComponent
---

# Interface: FieldGroupArrayFieldComponent()\<TFieldData, TFieldComponents\>

Defined in: [packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts:41](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts#L41)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

```ts
FieldGroupArrayFieldComponent<TFieldName>(props): Element;
```

Defined in: [packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts:45](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts#L45)

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

## Parameters

### props

[`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ValidationIssue`, `unknown`, `FormErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `TFieldComponents`\>

## Returns

`Element`
