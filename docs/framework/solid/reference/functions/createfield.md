---
id: createField
title: createField
---

# Function: createField()

```ts
function createField<TParentData, TName, TFieldValidator, TFormValidator, TData>(opts): () => never
```

## Type Parameters

• **TParentData**

• **TName** *extends* `string` \| `number`

• **TFieldValidator** *extends* `undefined` \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `undefined`

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

• **TData** = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

• **opts**

## Returns

`Function`

### Returns

`never`

## Defined in

[createField.tsx:87](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/solid-form/src/createField.tsx#L87)
