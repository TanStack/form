---
id: FieldGroupFieldComponent
title: FieldGroupFieldComponent
---

Defined in: [packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts:22](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts#L22)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

```ts
FieldGroupFieldComponent<TFieldName>(props): ComponentChildren;
```

Defined in: [packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts:26](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts#L26)

## Type Parameters

### TFieldName

`TFieldName` *extends* `string`

## Parameters

### props

[`PreactFormFieldProps`](PreactFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ScopedErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `unknown`, `ScopedErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `TFieldComponents`\>

## Returns

`ComponentChildren`
