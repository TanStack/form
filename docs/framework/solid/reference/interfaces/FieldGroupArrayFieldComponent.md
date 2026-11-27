---
id: FieldGroupArrayFieldComponent
title: FieldGroupArrayFieldComponent
---

Defined in: [packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts:40](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts#L40)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

```ts
FieldGroupArrayFieldComponent<TFieldName>(props): Element;
```

Defined in: [packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts:44](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts#L44)

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

## Parameters

### props

[`SolidFormFieldProps`](SolidFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ScopedErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `unknown`, `ScopedErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `TFieldComponents`\>

## Returns

`Element`
