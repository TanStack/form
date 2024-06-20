# Type alias: FieldComponent()\<TParentData, TFormValidator\>

```ts
type FieldComponent<TParentData, TFormValidator>: <TName, TFieldValidator, TData>({
  children,
  ...fieldOptions
}) => JSXElement;
```

## Type parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

## Type parameters

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

## Source

[createField.tsx:141](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/solid-form/src/createField.tsx#L141)
