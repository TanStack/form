---
id: UseField
title: UseField
---

# Type Alias: UseField()\<TParentData, TFormValidator, TParentMetaExtension\>

```ts
type UseField<TParentData, TFormValidator, TParentMetaExtension> = <TName, TFieldValidator, TData>(opts) => object;
```

Defined in: [packages/vue-form/src/useField.tsx:18](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useField.tsx#L18)

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TParentMetaExtension** = `never`

## Type Parameters

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TFieldValidator** *extends* 
  \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\>
  \| `undefined` = `undefined`

• **TData** *extends* `DeepValue`\<`TParentData`, `TName`\> = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

### opts

`Omit`\<`UseFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>, `"form"`\>

## Returns

`object`

### api

```ts
api: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension> & VueFieldApi<TParentData, TFormValidator, TParentMetaExtension>;
```

### state

```ts
state: Readonly<Ref<FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>["state"]>>;
```
