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

• **TFieldValidator** *extends* `undefined` \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `undefined`

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

• **TData** = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

• **\_\_namedParameters**: `FieldComponentProps`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Returns

`ReactNode`

## Defined in

[useField.tsx:163](https://github.com/TanStack/form/blob/ab5a89b11f2af9f11c720387ff2da9e9d2b82764/packages/react-form/src/useField.tsx#L163)
