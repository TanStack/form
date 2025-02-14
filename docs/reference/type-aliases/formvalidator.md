---
id: FormValidator
title: FormValidator
---

# Type Alias: FormValidator\<TFormData, TType, TFn\>

```ts
type FormValidator<TFormData, TType, TFn> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:70](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L70)

## Type Parameters

• **TFormData**

• **TType**

• **TFn** = `unknown`

## Type declaration

### validate()

#### Parameters

##### options

###### value

`TType`

##### fn

`TFn`

#### Returns

[`ValidationError`](validationerror.md)

### validateAsync()

#### Parameters

##### options

###### value

`TType`

##### fn

`TFn`

#### Returns

`Promise`\<`FormValidationError`\<`TFormData`\>\>
