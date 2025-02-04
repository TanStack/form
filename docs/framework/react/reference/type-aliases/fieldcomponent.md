---
id: FieldComponent
title: FieldComponent
---

# Type Alias: FieldComponent()\<TParentData, TFormValidator, TParentMetaExtension\>

```ts
type FieldComponent<TParentData, TFormValidator, TParentMetaExtension> = <TName, TFieldValidator, TData>({
  children,
  ...fieldOptions
}) => ReactNode;
```

Defined in: [packages/react-form/src/useField.tsx:162](https://github.com/TanStack/form/blob/main/packages/react-form/src/useField.tsx#L162)

A type alias representing a field component for a specific form data type.

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TParentMetaExtension** *extends* `object` = `never`

## Type Parameters

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TFieldValidator** *extends* 
  \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\>
  \| `undefined` = `undefined`

• **TData** *extends* `DeepValue`\<`TParentData`, `TName`\> = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

### \{
  children,
  ...fieldOptions
\}

`Omit`\<`FieldComponentProps`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>, `"form"`\>

## Returns

`ReactNode`
