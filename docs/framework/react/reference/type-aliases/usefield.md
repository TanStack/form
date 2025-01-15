---
id: UseField
title: UseField
---

# Type Alias: UseField()\<TParentData, TFormValidator\>

```ts
type UseField<TParentData, TFormValidator> = <TName, TFieldValidator, TData>(opts) => FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

Defined in: [packages/react-form/src/useField.tsx:26](https://github.com/TanStack/form/blob/main/packages/react-form/src/useField.tsx#L26)

A type representing a hook for using a field in a form with the given form data type.

A function that takes an optional object with a `name` property and field options, and returns a `FieldApi` instance for the specified field.

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

## Type Parameters

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TFieldValidator** *extends* 
  \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\>
  \| `undefined` = `undefined`

• **TData** *extends* `DeepValue`\<`TParentData`, `TName`\> = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

### opts

`Omit`\<`UseFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>, `"form"`\>

## Returns

`FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>
