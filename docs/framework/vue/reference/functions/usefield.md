---
id: useField
title: useField
---

# Function: useField()

```ts
function useField<TParentData, TName, TFieldValidator, TFormValidator, TData>(opts): object
```

## Type Parameters

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

## Defined in

[packages/vue-form/src/useField.tsx:49](https://github.com/TanStack/form/blob/782e82ea1fb36627b62d0f588484b4a9c3249fed/packages/vue-form/src/useField.tsx#L49)
