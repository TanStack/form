---
id: FieldComponent
title: FieldComponent
---

# Type Alias: FieldComponent()\<TParentData, TFormValidator, TParentMetaExtension\>

```ts
type FieldComponent<TParentData, TFormValidator, TParentMetaExtension> = <TName, TFieldValidator, TData>(fieldOptions, context) => any;
```

Defined in: [packages/vue-form/src/useField.tsx:145](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useField.tsx#L145)

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

### fieldOptions

`Omit`\<`FieldComponentProps`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>, `"form"`\>

### context

`SetupContext`\<\{\}, `SlotsType`\<\{
  `default`: \{
     `field`: `FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>;
     `state`: `FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>\[`"state"`\];
    \};
 \}\>\>

## Returns

`any`
