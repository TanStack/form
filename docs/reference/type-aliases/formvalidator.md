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

[packages/form-core/src/FormApi.ts:59](https://github.com/TanStack/form/blob/096bbc41b8af89898a5cd7700fd416a5eaa03028/packages/form-core/src/FormApi.ts#L59)
