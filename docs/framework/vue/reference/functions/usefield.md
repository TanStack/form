---
id: useField
title: useField
---

# Function: useField()

```ts
function useField<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>(opts): object
```

Defined in: [packages/vue-form/src/useField.tsx:66](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useField.tsx#L66)

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

`UseFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>

## Returns

`object`

### api

```ts
readonly api: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension> & VueFieldApi<TParentData, TFormValidator, TParentMetaExtension> = fieldApi;
```

### state

```ts
readonly state: Readonly<Ref<FieldState<TData>, FieldState<TData>>> = fieldState;
```
