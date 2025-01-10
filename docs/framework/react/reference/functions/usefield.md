---
id: useField
title: useField
---

# Function: useField()

```ts
function useField<TParentData, TName, TFieldValidator, TFormValidator, TData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn>(opts): FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn> & ReactFieldApi<TParentData, TFormValidator>
```

Defined in: [packages/react-form/src/useField.tsx:121](https://github.com/TanStack/form/blob/main/packages/react-form/src/useField.tsx#L121)

A hook for managing a field in a form.

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

## Parameters

### opts

`UseFieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`, `TFormOnMountReturn`, `TFormOnChangeReturn`, `TFormOnChangeAsyncReturn`, `TFormOnBlurReturn`, `TFormOnBlurAsyncReturn`, `TFormOnSubmitReturn`, `TFormOnSubmitAsyncReturn`\>

An object with field options.

## Returns

`FieldApi`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`, `TFormOnMountReturn`, `TFormOnChangeReturn`, `TFormOnChangeAsyncReturn`, `TFormOnBlurReturn`, `TFormOnBlurAsyncReturn`, `TFormOnSubmitReturn`, `TFormOnSubmitAsyncReturn`\> & `ReactFieldApi`\<`TParentData`, `TFormValidator`\>

The `FieldApi` instance for the specified field.
