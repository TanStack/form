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

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

## Type Parameters

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* `DeepValue`\<`TParentData`, `TName`\> = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

• **\{
  children,
  ...fieldOptions
\}**: `Omit`\<`FieldComponentProps`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>, `"form"`\>

## Returns

`JSXElement`

## Defined in

[createField.tsx:160](https://github.com/TanStack/form/blob/782e82ea1fb36627b62d0f588484b4a9c3249fed/packages/solid-form/src/createField.tsx#L160)
