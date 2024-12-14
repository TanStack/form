---
id: FieldComponent
title: FieldComponent
---

# Type Alias: FieldComponent()\<TParentData, TFormValidator\>

```ts
type FieldComponent<TParentData, TFormValidator>: <TName, TFieldValidator, TData>({
  children,
  ...fieldOptions
}) => JSXElement;
```

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> = `StandardSchemaValidator`

## Type Parameters

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `StandardSchemaValidator`

• **TData** *extends* `DeepValue`\<`TParentData`, `TName`\> = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

### \{
  children,
  ...fieldOptions
\}

`Omit`\<`FieldComponentProps`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>, `"form"`\>

## Returns

`JSXElement`

## Defined in

[packages/solid-form/src/createField.tsx:170](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createField.tsx#L170)
