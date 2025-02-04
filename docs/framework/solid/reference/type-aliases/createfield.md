---
id: CreateField
title: CreateField
---

# Type Alias: CreateField()\<TParentData, TFormValidator, TParentMetaExtension\>

```ts
type CreateField<TParentData, TFormValidator, TParentMetaExtension> = <TName, TFieldValidator, TData>(opts) => () => FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension> & SolidFieldApi<TParentData, TFormValidator, TParentMetaExtension>;
```

Defined in: [packages/solid-form/src/createField.tsx:30](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createField.tsx#L30)

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

() => `object` & `Omit`\<`CreateFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>, `"form"`\>

## Returns

`Function`

### Returns

`FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\> & `SolidFieldApi`\<`TParentData`, `TFormValidator`, `TParentMetaExtension`\>
