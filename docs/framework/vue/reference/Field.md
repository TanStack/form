# Function: Field()

```ts
function Field<TParentData, TName, TFieldValidator, TFormValidator, TData>(props): any
```

## Type parameters

• **TParentData**

• **TName** *extends* `string` \| `number`

• **TFieldValidator** *extends* `undefined` \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `undefined`

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

• **TData** = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

• **props**: `FieldApiOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\> & `object` & `object` \| `object`

## Returns

`any`

## Source

[packages/vue-form/src/useField.tsx:184](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/vue-form/src/useField.tsx#L184)
