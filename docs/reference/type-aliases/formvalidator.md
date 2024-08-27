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

[packages/form-core/src/FormApi.ts:59](https://github.com/TanStack/form/blob/eae56e9e6061dd35d01d0534f88a027f3f957e7f/packages/form-core/src/FormApi.ts#L59)
