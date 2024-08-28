---
id: FormValidator
title: FormValidator
---

# Type Alias: FormValidator\<TFormData, TType, TFn\>

```ts
type FormValidator<TFormData, TType, TFn>: object;
```

## Type Parameters

• **TFormData**

• **TType**

• **TFn** = `unknown`

## Type declaration

### validate()

#### Parameters

• **options**

• **options.value**: `TType`

• **fn**: `TFn`

#### Returns

[`ValidationError`](validationerror.md)

### validateAsync()

#### Parameters

• **options**

• **options.value**: `TType`

• **fn**: `TFn`

#### Returns

`Promise`\<`FormValidationError`\<`TFormData`\>\>

## Defined in

[packages/form-core/src/FormApi.ts:59](https://github.com/TanStack/form/blob/ab5a89b11f2af9f11c720387ff2da9e9d2b82764/packages/form-core/src/FormApi.ts#L59)
