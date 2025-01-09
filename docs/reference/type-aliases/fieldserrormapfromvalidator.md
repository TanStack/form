---
id: FieldsErrorMapFromValidator
title: FieldsErrorMapFromValidator
---

# Type Alias: FieldsErrorMapFromValidator\<TFormData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn\>

```ts
type FieldsErrorMapFromValidator<TFormData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>: Partial<Record<DeepKeys<TFormData>, ValidationErrorMap<TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>>>;
```

## Type Parameters

• **TFormData**

• **TOnMountReturn** = `undefined`

• **TOnChangeReturn** = `undefined`

• **TOnChangeAsyncReturn** = `undefined`

• **TOnBlurReturn** = `undefined`

• **TOnBlurAsyncReturn** = `undefined`

• **TOnSubmitReturn** = `undefined`

• **TOnSubmitAsyncReturn** = `undefined`

## Defined in

[packages/form-core/src/FormApi.ts:33](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L33)
