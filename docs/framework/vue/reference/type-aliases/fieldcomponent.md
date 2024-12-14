---
id: FieldComponent
title: FieldComponent
---

# Type Alias: FieldComponent()\<TParentData, TFormValidator\>

```ts
type FieldComponent<TParentData, TFormValidator>: <TName, TFieldValidator, TData>(fieldOptions, context) => any;
```

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> = `StandardSchemaValidator`

## Type Parameters

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `StandardSchemaValidator`

• **TData** *extends* `DeepValue`\<`TParentData`, `TName`\> = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

### fieldOptions

`Omit`\<`FieldComponentProps`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>, `"form"`\>

### context

`SetupContext`\<`object`, `SlotsType`\<`object`\>\>

## Returns

`any`

## Defined in

[packages/vue-form/src/useField.tsx:129](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useField.tsx#L129)
