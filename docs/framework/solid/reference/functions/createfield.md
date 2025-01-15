---
id: createField
title: createField
---

# Function: createField()

```ts
function createField<TParentData, TName, TFieldValidator, TFormValidator, TData>(opts): () => never
```

Defined in: [packages/solid-form/src/createField.tsx:87](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createField.tsx#L87)

## Type Parameters

• **TParentData**

• **TName** *extends* `string` \| `number`

• **TFieldValidator** *extends* 
  \| `undefined`
  \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `undefined`

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

• **TData** = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

### opts

() => `CreateFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Returns

`Function`

### Returns

`never`
