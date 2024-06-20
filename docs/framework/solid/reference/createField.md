# Function: createField()

```ts
function createField<TParentData, TName, TFieldValidator, TFormValidator, TData>(opts): () => FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>
```

## Type parameters

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

`FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Source

[createField.tsx:72](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/solid-form/src/createField.tsx#L72)
