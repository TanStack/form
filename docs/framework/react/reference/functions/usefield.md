---
id: useField
title: useField
---

# Function: useField()

```ts
function useField<TParentData, TName, TFieldValidator, TFormValidator, TData>(opts): FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData> & ReactFieldApi<TParentData, TFormValidator>
```

A hook for managing a field in a form.

## Type Parameters

• **TParentData**

• **TName** *extends* `string` \| `number`

• **TFieldValidator** *extends* `undefined` \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `undefined`

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

• **TData** = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

• **opts**: `UseFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

An object with field options.

## Returns

`FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\> & `ReactFieldApi`\<`TParentData`, `TFormValidator`\>

The `FieldApi` instance for the specified field.

## Defined in

[useField.tsx:49](https://github.com/TanStack/form/blob/bde3b1cb3de955b47034f0bfaa43dec13c67999a/packages/react-form/src/useField.tsx#L49)
