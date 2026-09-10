---
id: FormValidator
title: FormValidator
---

# Type Alias: FormValidator\<TFormData, TType, TFn\>

```ts
type FormValidator<TFormData, TType, TFn> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:155](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L155)

## Type Parameters

### TFormData

`TFormData`

### TType

`TType`

### TFn

`TFn` = `unknown`

## Methods

### validate()

```ts
validate(options, fn): unknown;
```

Defined in: [packages/form-core/src/FormApi.ts:156](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L156)

#### Parameters

##### options

###### value

`TType`

##### fn

`TFn`

#### Returns

`unknown`

***

### validateAsync()

```ts
validateAsync(options, fn): Promise<unknown>;
```

Defined in: [packages/form-core/src/FormApi.ts:157](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L157)

#### Parameters

##### options

###### value

`TType`

##### fn

`TFn`

#### Returns

`Promise`\<`unknown`\>
