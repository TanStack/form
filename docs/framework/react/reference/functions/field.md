---
id: Field
title: Field
---

# Function: Field()

```ts
function Field<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>(__namedParameters): ReactNode
```

Defined in: [packages/react-form/src/useField.tsx:194](https://github.com/TanStack/form/blob/main/packages/react-form/src/useField.tsx#L194)

A function component that takes field options and a render function as children and returns a React component.

The `Field` component uses the `useField` hook internally to manage the field instance.

## Type Parameters

• **TParentData**

• **TName** *extends* `string` \| `number`

• **TFieldValidator** *extends* 
  \| `undefined`
  \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `undefined`

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

• **TData** = `DeepValue`\<`TParentData`, `TName`\>

• **TParentMetaExtension** *extends* `object` = `never`

## Parameters

### \_\_namedParameters

`FieldComponentProps`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>

## Returns

`ReactNode`
