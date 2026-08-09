---
id: FieldGroupArrayFieldComponent
title: FieldGroupArrayFieldComponent
---

# Interface: FieldGroupArrayFieldComponent()\<TFieldData, TFieldComponents\>

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:42](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L42)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

```ts
FieldGroupArrayFieldComponent<TFieldName>(props): ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:46](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L46)

## Type Parameters

### TFieldName

`TFieldName` *extends* `never`

## Parameters

### props

[`ReactFormFieldProps`](ReactFormFieldProps.md)\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>, `FieldValidators`\<`TFieldData`, `TFieldName`, `DeepValue`\<`TFieldData`, `TFieldName`\>\>, `ValidationIssue`, `unknown`, `FormErrorTypes`\<`ValidationIssue`, `ValidationIssue`\>, `TFieldComponents`\>

## Returns

`ReactNode` \| `Promise`\<`ReactNode`\>
