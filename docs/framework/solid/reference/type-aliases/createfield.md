---
id: CreateField
title: CreateField
---

# Type Alias: CreateField()\<TParentData, TFormValidator\>

```ts
type CreateField<TParentData, TFormValidator>: <TName, TFieldValidator, TData>(opts) => () => FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData> & SolidFieldApi<TParentData, TFormValidator>;
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

() => `object` & `Omit`\<`CreateFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>, `"form"`\>

## Returns

`Function`

### Returns

`FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\> & `SolidFieldApi`\<`TParentData`, `TFormValidator`\>

## Defined in

[createField.tsx:29](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createField.tsx#L29)
