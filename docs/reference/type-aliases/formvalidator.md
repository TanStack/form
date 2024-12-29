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

##### options

###### value

`TType`

##### fn

`TFn`

#### Returns

`string`

### validateAsync()

#### Parameters

##### options

###### value

`TType`

##### fn

`TFn`

#### Returns

`Promise`\<[`ValidationResult`](validationresult.md) \| `FormValidationResult`\<`TFormData`\>\>

## Defined in

[packages/form-core/src/FormApi.ts:74](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L74)
