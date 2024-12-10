---
id: UseField
title: UseField
---

# Type Alias: UseField()\<TParentData, TFormValidator\>

```ts
type UseField<TParentData, TFormValidator>: <TName, TFieldValidator, TData>(opts) => object;
```

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

## Type Parameters

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* `DeepValue`\<`TParentData`, `TName`\> = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

### opts

`Omit`\<`UseFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>, `"form"`\>

## Returns

`object`

### api

```ts
api: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData> & VueFieldApi<TParentData, TFormValidator>;
```

### state

```ts
state: Readonly<Ref<FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>["state"]>>;
```

## Defined in

[packages/vue-form/src/useField.tsx:17](https://github.com/TanStack/Formblob/main/packages/vue-form/src/useField.tsx#L17)
