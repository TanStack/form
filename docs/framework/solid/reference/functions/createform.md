---
id: createForm
title: createForm
---

# Function: createForm()

```ts
function createForm<TParentData, TFormValidator, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn>(opts?): FormApi<TParentData, TFormValidator, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn> & SolidFormApi<TParentData, TFormValidator, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn>
```

Defined in: [packages/solid-form/src/createForm.tsx:112](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L112)

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TParentData`, `unknown`\> = `undefined`

• **TFormOnMountReturn** = `undefined`

• **TFormOnChangeReturn** = `undefined`

• **TFormOnChangeAsyncReturn** = `undefined`

• **TFormOnBlurReturn** = `undefined`

• **TFormOnBlurAsyncReturn** = `undefined`

• **TFormOnSubmitReturn** = `undefined`

• **TFormOnSubmitAsyncReturn** = `undefined`

• **TFormOnServerReturn** = `undefined`

## Parameters

### opts?

() => `FormOptions`\<`TParentData`, `TFormValidator`, `TFormOnMountReturn`, `TFormOnChangeReturn`, `TFormOnChangeAsyncReturn`, `TFormOnBlurReturn`, `TFormOnBlurAsyncReturn`, `TFormOnSubmitReturn`, `TFormOnSubmitAsyncReturn`, `TFormOnServerReturn`\>

## Returns

`FormApi`\<`TParentData`, `TFormValidator`, `TFormOnMountReturn`, `TFormOnChangeReturn`, `TFormOnChangeAsyncReturn`, `TFormOnBlurReturn`, `TFormOnBlurAsyncReturn`, `TFormOnSubmitReturn`, `TFormOnSubmitAsyncReturn`, `TFormOnServerReturn`\> & [`SolidFormApi`](../interfaces/solidformapi.md)\<`TParentData`, `TFormValidator`, `TFormOnMountReturn`, `TFormOnChangeReturn`, `TFormOnChangeAsyncReturn`, `TFormOnBlurReturn`, `TFormOnBlurAsyncReturn`, `TFormOnSubmitReturn`, `TFormOnSubmitAsyncReturn`, `TFormOnServerReturn`\>
