---
id: FormValidator
title: FormValidator
---

# Type Alias: FormValidator\<TFormData, TType, TFn\>

```ts
type FormValidator<TFormData, TType, TFn> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:144](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L144)

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

Defined in: [packages/form-core/src/FormApi.ts:145](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L145)

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

Defined in: [packages/form-core/src/FormApi.ts:146](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L146)

#### Parameters

##### options

###### value

`TType`

##### fn

`TFn`

#### Returns

`Promise`\<`unknown`\>
