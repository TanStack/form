---
id: FieldComponent
title: FieldComponent
---

# Type Alias: FieldComponent()\<TParentData, TFormValidator\>

```ts
type FieldComponent<TParentData, TFormValidator> = <TName, TFieldValidator, TData>(fieldOptions, context) => any;
```

Defined in: [packages/vue-form/src/useField.tsx:117](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useField.tsx#L117)

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

## Type Parameters

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TFieldValidator** *extends* 
  \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\>
  \| `undefined` = `undefined`

• **TData** *extends* `DeepValue`\<`TParentData`, `TName`\> = `DeepValue`\<`TParentData`, `TName`\>

## Parameters

### fieldOptions

`Omit`\<`FieldComponentProps`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>, `"form"`\>

### context

`SetupContext`\<\{\}, `SlotsType`\<\{
  `default`: \{
     `field`: `FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>;
     `state`: `FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>\[`"state"`\];
    \};
 \}\>\>

## Returns

`any`
