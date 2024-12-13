---
id: Field
title: Field
---

# Function: Field()

```ts
function Field<TParentData, TName, TFieldValidator, TFormValidator, TData>(__namedParameters): ReactNode
```

A function component that takes field options and a render function as children and returns a React component.

The `Field` component uses the `useField` hook internally to manage the field instance.

## Type Parameters

• **TParentData**

• **TName** *extends* `string` \| `number`

• **TFieldValidator** *extends* `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `StandardSchemaV1`\<`DeepValue`\<`TParentData`, `TName`\>\>\>

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> = `Validator`\<`TParentData`, `StandardSchemaV1`\<`TParentData`\>\>

• **TData** = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

### \_\_namedParameters

`FieldComponentProps`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Returns

`ReactNode`

## Defined in

[packages/react-form/src/useField.tsx:190](https://github.com/TanStack/form/blob/main/packages/react-form/src/useField.tsx#L190)
