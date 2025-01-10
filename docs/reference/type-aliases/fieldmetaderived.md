---
id: FieldMetaDerived
title: FieldMetaDerived
---

# Type Alias: FieldMetaDerived\<TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn\>

```ts
type FieldMetaDerived<TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn> = object;
```

Defined in: [packages/form-core/src/FieldApi.ts:560](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L560)

## Type Parameters

• **TOnMountReturn** = `undefined`

• **TOnChangeReturn** = `undefined`

• **TOnChangeAsyncReturn** = `undefined`

• **TOnBlurReturn** = `undefined`

• **TOnBlurAsyncReturn** = `undefined`

• **TOnSubmitReturn** = `undefined`

• **TOnSubmitAsyncReturn** = `undefined`

## Type declaration

### errors

```ts
errors: (
  | TOnMountReturn
  | TOnChangeReturn
  | TOnChangeAsyncReturn
  | TOnBlurReturn
  | TOnBlurAsyncReturn
  | TOnSubmitReturn
  | TOnSubmitAsyncReturn)[];
```

An array of errors related to the field value.

### isPristine

```ts
isPristine: boolean;
```

A flag that is `true` if the field's value has not been modified by the user. Opposite of `isDirty`.
