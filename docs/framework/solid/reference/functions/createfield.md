---
id: createField
title: createField
---

# Function: createField()

```ts
function createField<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>(opts): () => never
```

Defined in: [packages/solid-form/src/createField.tsx:100](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createField.tsx#L100)

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

### opts

() => `CreateFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>

## Returns

`Function`

### Returns

`never`
