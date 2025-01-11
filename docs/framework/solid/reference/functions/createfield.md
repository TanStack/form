---
id: createField
title: createField
---

# Function: createField()

```ts
function createField<TParentData, TName, TFieldValidator, TFormValidator, TData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn>(opts): () => FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn> & SolidFieldApi<TParentData, TFormValidator, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn>
```

Defined in: [packages/solid-form/src/createField.tsx:237](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createField.tsx#L237)

## Type Parameters

• **TParentData**

• **TName** *extends* `string` \| `number`

• **TFieldValidator** *extends* 
  \| `undefined`
  \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `undefined`

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

• **TData** = `DeepValue`\<`TParentData`, `TName`\>

• **TOnMountReturn** = `undefined`

• **TOnChangeReturn** = `undefined`

• **TOnChangeAsyncReturn** = `undefined`

• **TOnBlurReturn** = `undefined`

• **TOnBlurAsyncReturn** = `undefined`

• **TOnSubmitReturn** = `undefined`

• **TOnSubmitAsyncReturn** = `undefined`

• **TFormOnMountReturn** = `undefined`

• **TFormOnChangeReturn** = `undefined`

• **TFormOnChangeAsyncReturn** = `undefined`

• **TFormOnBlurReturn** = `undefined`

• **TFormOnBlurAsyncReturn** = `undefined`

• **TFormOnSubmitReturn** = `undefined`

• **TFormOnSubmitAsyncReturn** = `undefined`

• **TFormOnServerReturn** = `undefined`

## Parameters

### opts

() => `CreateFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`, `TFormOnMountReturn`, `TFormOnChangeReturn`, `TFormOnChangeAsyncReturn`, `TFormOnBlurReturn`, `TFormOnBlurAsyncReturn`, `TFormOnSubmitReturn`, `TFormOnSubmitAsyncReturn`, `TFormOnServerReturn`\>

## Returns

`Function`

### Returns

`FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`, `TFormOnMountReturn`, `TFormOnChangeReturn`, `TFormOnChangeAsyncReturn`, `TFormOnBlurReturn`, `TFormOnBlurAsyncReturn`, `TFormOnSubmitReturn`, `TFormOnSubmitAsyncReturn`, `TFormOnServerReturn`\> & `SolidFieldApi`\<`TParentData`, `TFormValidator`, `TFormOnMountReturn`, `TFormOnChangeReturn`, `TFormOnChangeAsyncReturn`, `TFormOnBlurReturn`, `TFormOnBlurAsyncReturn`, `TFormOnSubmitReturn`, `TFormOnSubmitAsyncReturn`, `TFormOnServerReturn`\>
