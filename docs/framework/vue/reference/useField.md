# Function: useField()

```ts
function useField<TParentData, TName, TFieldValidator, TFormValidator, TData>(opts): object
```

## Type parameters

• **TParentData**

• **TName** *extends* `string` \| `number`

• **TFieldValidator** *extends* `undefined` \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `undefined`

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

• **TData** = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

• **opts**: `UseFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Returns

`object`

### api

```ts
api: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

### state

```ts
state: Readonly<Ref<FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>["state"]>>;
```

## Source

[packages/vue-form/src/useField.tsx:61](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/vue-form/src/useField.tsx#L61)
