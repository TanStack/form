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

• **TFieldValidator** *extends* `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `Validator`\<`unknown`, `StandardSchemaV1`\>

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> = `Validator`\<`unknown`, `StandardSchemaV1`\>

• **TData** = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

### \_\_namedParameters

`FieldComponentProps`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Returns

`ReactNode`

## Defined in

[packages/react-form/src/useField.tsx:178](https://github.com/TanStack/form/blob/main/packages/react-form/src/useField.tsx#L178)
