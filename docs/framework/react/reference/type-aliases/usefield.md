---
id: UseField
title: UseField
---

# Type Alias: UseField()\<TParentData, TFormValidator, TParentMetaExtension\>

```ts
type UseField<TParentData, TFormValidator, TParentMetaExtension> = <TName, TFieldValidator, TData>(opts) => FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>;
```

Defined in: [packages/react-form/src/useField.tsx:27](https://github.com/TanStack/form/blob/main/packages/react-form/src/useField.tsx#L27)

A type representing a hook for using a field in a form with the given form data type.

A function that takes an optional object with a `name` property and field options, and returns a `FieldApi` instance for the specified field.

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TParentMetaExtension** = `never`

## Type Parameters

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TFieldValidator** *extends* 
  \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\>
  \| `undefined` = `undefined`

• **TData** *extends* `DeepValue`\<`TParentData`, `TName`\> = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

### opts

`Omit`\<`UseFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>, `"form"`\>

## Returns

`FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>
