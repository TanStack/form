---
id: CreateField
title: CreateField
---

# Type Alias: CreateField()\<TParentData, TFormValidator, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn\>

```ts
type CreateField<TParentData, TFormValidator, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn> = <TName, TFieldValidator, TData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>(opts) => () => FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn> & SolidFieldApi<TParentData, TFormValidator, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn>;
```

Defined in: [packages/solid-form/src/createField.tsx:48](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createField.tsx#L48)

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TFormOnMountReturn** = `undefined`

• **TFormOnChangeReturn** = `undefined`

• **TFormOnChangeAsyncReturn** = `undefined`

• **TFormOnBlurReturn** = `undefined`

• **TFormOnBlurAsyncReturn** = `undefined`

• **TFormOnSubmitReturn** = `undefined`

• **TFormOnSubmitAsyncReturn** = `undefined`

• **TFormOnServerReturn** = `undefined`

## Type Parameters

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TFieldValidator** *extends* 
  \| `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\>
  \| `undefined` = `undefined`

• **TData** *extends* `DeepValue`\<`TParentData`, `TName`\> = `DeepValue`\<`TParentData`, `TName`\>

• **TOnMountReturn** = `undefined`

• **TOnChangeReturn** = `undefined`

• **TOnChangeAsyncReturn** = `undefined`

• **TOnBlurReturn** = `undefined`

• **TOnBlurAsyncReturn** = `undefined`

• **TOnSubmitReturn** = `undefined`

• **TOnSubmitAsyncReturn** = `undefined`

## Parameters

### opts

() => `object` & `Omit`\<`CreateFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`, `TFormOnMountReturn`, `TFormOnChangeReturn`, `TFormOnChangeAsyncReturn`, `TFormOnBlurReturn`, `TFormOnBlurAsyncReturn`, `TFormOnSubmitReturn`, `TFormOnSubmitAsyncReturn`, `TFormOnServerReturn`\>, `"form"`\>

## Returns

`Function`

### Returns

`FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`, `TFormOnMountReturn`, `TFormOnChangeReturn`, `TFormOnChangeAsyncReturn`, `TFormOnBlurReturn`, `TFormOnBlurAsyncReturn`, `TFormOnSubmitReturn`, `TFormOnSubmitAsyncReturn`, `TFormOnServerReturn`\> & `SolidFieldApi`\<`TParentData`, `TFormValidator`, `TFormOnMountReturn`, `TFormOnChangeReturn`, `TFormOnChangeAsyncReturn`, `TFormOnBlurReturn`, `TFormOnBlurAsyncReturn`, `TFormOnSubmitReturn`, `TFormOnSubmitAsyncReturn`, `TFormOnServerReturn`\>
