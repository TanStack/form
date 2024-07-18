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

[useField.tsx:163](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/react-form/src/useField.tsx#L163)
