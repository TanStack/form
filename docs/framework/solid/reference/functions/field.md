---
id: Field
title: Field
---

# Function: Field()

```ts
function Field<TParentData, TName, TFieldValidator, TFormValidator, TData>(props): Element
```

## Type Parameters

• **TParentData**

• **TName** *extends* `string` \| `number`

• **TFieldValidator** *extends* `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `Validator`\<`unknown`, `StandardSchemaV1`\>

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> = `Validator`\<`unknown`, `StandardSchemaV1`\>

• **TData** = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

### props

`object` & `FieldApiOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\> & `object`

## Returns

`Element`

## Defined in

[packages/solid-form/src/createField.tsx:197](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createField.tsx#L197)
