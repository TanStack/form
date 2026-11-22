---
id: FieldGroupFieldComponent
title: FieldGroupFieldComponent
---

Defined in: [packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts:18](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts#L18)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

```ts
FieldGroupFieldComponent<TFieldName>(props): Element;
```

Defined in: [packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts:22](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts#L22)

## Type Parameters

### TFieldName

`TFieldName` *extends* `string`

## Parameters

### props

[`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ScopedErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `unknown`, `ScopedErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `TFieldComponents`\>

## Returns

`Element`
