---
id: FieldApi
title: FieldApi
---

# Interface: FieldApi\<TFieldName, TFieldValue, TFieldValidatorMetas, TGroupValidatorMetas, TFormData, TFormValidatorMetas, TSubmitReturn\>

Defined in: [FieldApi/FieldApi.public.ts:137](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L137)

## Type Parameters

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldValidatorMetas

`TFieldValidatorMetas` *extends* [`FieldValidatorMetas`](../type-aliases/FieldValidatorMetas.md)

### TGroupValidatorMetas

`TGroupValidatorMetas` *extends* [`FormGroupValidatorMetas`](../type-aliases/FormGroupValidatorMetas.md)

### TFormData

`TFormData`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* [`FormValidatorMetas`](../type-aliases/FormValidatorMetas.md)

### TSubmitReturn

`TSubmitReturn`

## Properties

### atom

```ts
atom: ReadonlyAtom<FieldState<TFieldValue, TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn>>;
```

Defined in: [FieldApi/FieldApi.public.ts:213](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L213)

***

### clearValues

```ts
clearValues: FieldClearValuesFn;
```

Defined in: [FieldApi/FieldApi.public.ts:195](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L195)

Clear all values from this field's array.
If this field is not an array, this method will be ignored.

#### Param

Optional update options

***

### errors

```ts
errors: FieldErrors<TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [FieldApi/FieldApi.public.ts:232](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L232)

***

### filterValues

```ts
filterValues: FieldFilterValuesFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:211](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L211)

Filter the values in this field's array using a predicate function.
If this field is not an array, this method will be ignored.

#### Param

The predicate function to filter values. Returns true to keep the value, false to remove it.

#### Param

Optional update options including a custom `thisArg` for the predicate

***

### form

```ts
form: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [FieldApi/FieldApi.public.ts:149](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L149)

The form that owns this field.

***

### handleBlur

```ts
handleBlur: FieldVoidFn;
```

Defined in: [FieldApi/FieldApi.public.ts:241](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L241)

***

### handleChange

```ts
handleChange: FieldHandleChangeFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:239](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L239)

***

### insertValue

```ts
insertValue: FieldInsertValueFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:188](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L188)

Insert a new value into this field's array at the specified index.
If this field is not an array, this method will be ignored.

#### Param

The index at which to insert the value

#### Param

The value to insert

#### Param

Optional update options

***

### meta

```ts
meta: FieldMeta<TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [FieldApi/FieldApi.public.ts:225](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L225)

***

### moveValue

```ts
moveValue: FieldMoveValueFn;
```

Defined in: [FieldApi/FieldApi.public.ts:171](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L171)

Move an element in this field's array from one index to another.
If this field is not an array, this method will be ignored.

#### Param

The current index of the element to move

#### Param

The index to move the element to

#### Param

Optional update options

***

### pushValue

```ts
pushValue: FieldPushValueFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:179](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L179)

Push a new value into this field's array.
If this field is not an array, this method will be ignored.

#### Param

The value to push into the array

#### Param

Optional update options

***

### removeValue

```ts
removeValue: FieldRemoveValueFn;
```

Defined in: [FieldApi/FieldApi.public.ts:203](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L203)

Remove a value from this field's array at the specified index.
If this field is not an array, this method will be ignored.

#### Param

The index of the value to remove

#### Param

Optional update options

***

### reset

```ts
reset: FieldVoidFn;
```

Defined in: [FieldApi/FieldApi.public.ts:243](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L243)

***

### swapValues()

```ts
swapValues: (indexA, indexB) => void;
```

Defined in: [FieldApi/FieldApi.public.ts:162](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L162)

Swap two elements in this field's array.
If this field is not an array, this method will be ignored.

#### Parameters

##### indexA

`number`

The index of the first element to swap

##### indexB

`number`

The index of the second element to swap

#### Returns

`void`

***

### value

```ts
value: TFieldValue;
```

Defined in: [FieldApi/FieldApi.public.ts:223](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L223)

## Accessors

### name

#### Get Signature

```ts
get name(): TFieldName;
```

Defined in: [FieldApi/FieldApi.public.ts:154](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L154)

The name of the field.

##### Returns

`TFieldName`
