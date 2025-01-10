---
id: FieldState
title: FieldState
---

# Type Alias: FieldState\<TData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn\>

```ts
type FieldState<TData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn> = object;
```

Defined in: [packages/form-core/src/FieldApi.ts:620](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L620)

An object type representing the state of a field.

## Type Parameters

• **TData**

• **TOnMountReturn** = `undefined`

• **TOnChangeReturn** = `undefined`

• **TOnChangeAsyncReturn** = `undefined`

• **TOnBlurReturn** = `undefined`

• **TOnBlurAsyncReturn** = `undefined`

• **TOnSubmitReturn** = `undefined`

• **TOnSubmitAsyncReturn** = `undefined`

## Type declaration

### meta

```ts
meta: FieldMeta<TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>;
```

The current metadata of the field.

### value

```ts
value: TData;
```

The current value of the field.
