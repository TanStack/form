# Function: createField()

```ts
function createField<TParentData, TName, TFieldValidator, TFormValidator, TData>(opts): () => never
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

`never`

## Source

[createField.tsx:87](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/solid-form/src/createField.tsx#L87)
