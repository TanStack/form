---
id: FieldGroupArrayFieldComponent
title: FieldGroupArrayFieldComponent
---

Defined in: [packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts:44](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts#L44)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

```ts
FieldGroupArrayFieldComponent<TFieldName>(props): ComponentChildren;
```

Defined in: [packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts:48](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts#L48)

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

## Parameters

### props

[`PreactFormFieldProps`](PreactFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ScopedErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `unknown`, `ScopedErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `TFieldComponents`\>

## Returns

`ComponentChildren`
