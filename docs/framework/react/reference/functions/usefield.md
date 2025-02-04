---
id: useField
title: useField
---

# Function: useField()

```ts
function useField<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>(opts): FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension> & ReactFieldApi<TParentData, TFormValidator, TParentMetaExtension>
```

Defined in: [packages/react-form/src/useField.tsx:66](https://github.com/TanStack/form/blob/main/packages/react-form/src/useField.tsx#L66)

A hook for managing a field in a form.

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

### opts

`UseFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>

An object with field options.

## Returns

`FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\> & `ReactFieldApi`\<`TParentData`, `TFormValidator`, `TParentMetaExtension`\>

The `FieldApi` instance for the specified field.
