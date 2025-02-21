---
id: FormValidator
title: FormValidator
---

# Type Alias: FormValidator\<TFormData, TType, TFn\>

```ts
type FormValidator<TFormData, TType, TFn> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:117](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L117)

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

`unknown`

### validateAsync()

#### Parameters

##### options

###### value

`TType`

##### fn

`TFn`

#### Returns

`Promise`\<`unknown`\>
