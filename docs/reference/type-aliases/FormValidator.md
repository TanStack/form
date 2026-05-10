---
id: FormValidator
title: FormValidator
---

# Type Alias: FormValidator\<TFormData, TType, TFn\>

```ts
type FormValidator<TFormData, TType, TFn> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:151](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L151)

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

Defined in: [packages/form-core/src/FormApi.ts:152](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L152)

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

Defined in: [packages/form-core/src/FormApi.ts:153](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L153)

#### Parameters

##### options

###### value

`TType`

##### fn

`TFn`

#### Returns

`Promise`\<`unknown`\>
