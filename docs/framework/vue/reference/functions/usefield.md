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

• **TFieldValidator** *extends* `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `Validator`\<`unknown`, `StandardSchemaV1`\>

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> = `Validator`\<`unknown`, `StandardSchemaV1`\>

• **TData** = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

### opts

`UseFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Returns

`object`

### api

```ts
readonly api: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData> & VueFieldApi<TParentData, TFormValidator> = fieldApi;
```

### state

```ts
readonly state: Readonly<Ref<FieldState<TData>, FieldState<TData>>> = fieldState;
```

## Defined in

[packages/vue-form/src/useField.tsx:57](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useField.tsx#L57)
