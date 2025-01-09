---
id: ReactFormExtendedApi
title: ReactFormExtendedApi
---

# Type Alias: ReactFormExtendedApi\<TFormData, TFormValidator, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn\>

```ts
type ReactFormExtendedApi<TFormData, TFormValidator, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>: FormApi<TFormData, TFormValidator, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn> & ReactFormApi<TFormData, TFormValidator, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>;
```

An extended version of the `FormApi` class that includes React-specific functionalities from `ReactFormApi`

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

• **TOnMountReturn** = `undefined`

• **TOnChangeReturn** = `undefined`

• **TOnChangeAsyncReturn** = `undefined`

• **TOnBlurReturn** = `undefined`

• **TOnBlurAsyncReturn** = `undefined`

• **TOnSubmitReturn** = `undefined`

• **TOnSubmitAsyncReturn** = `undefined`

## Defined in

[packages/react-form/src/useForm.tsx:78](https://github.com/TanStack/form/blob/main/packages/react-form/src/useForm.tsx#L78)
