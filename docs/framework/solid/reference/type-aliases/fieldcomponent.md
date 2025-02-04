---
id: FieldComponent
title: FieldComponent
---

# Type Alias: FieldComponent()\<TParentData, TFormValidator, TParentMetaExtension\>

```ts
type FieldComponent<TParentData, TFormValidator, TParentMetaExtension> = <TName, TFieldValidator, TData>({
  children,
  ...fieldOptions
}) => JSXElement;
```

Defined in: [packages/solid-form/src/createField.tsx:190](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createField.tsx#L190)

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

### \{
  children,
  ...fieldOptions
\}

`Omit`\<`FieldComponentProps`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>, `"form"`\>

## Returns

`JSXElement`
