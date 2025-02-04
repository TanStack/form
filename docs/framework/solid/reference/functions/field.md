---
id: Field
title: Field
---

# Function: Field()

```ts
function Field<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>(props): Element
```

Defined in: [packages/solid-form/src/createField.tsx:217](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createField.tsx#L217)

## Type Parameters

• **TParentData**

• **TName** *extends* `string` \| `number`

• **TFieldValidator** *extends* 
  \| `undefined`
  \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `undefined`

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

• **TData** = `DeepValue`\<`TParentData`, `TName`\>

• **TParentMetaExtension** = `never`

## Parameters

### props

`object` & `FieldApiOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\> & `object`

## Returns

`Element`
