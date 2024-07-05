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
readonly api: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData> & VueFieldApi<TParentData, TFormValidator> = fieldApi;
```

### state

```ts
readonly state: Readonly<Ref<FieldState<TData>>> = fieldState;
```

## Source

[packages/vue-form/src/useField.tsx:49](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/vue-form/src/useField.tsx#L49)
