---
id: FieldApi
title: FieldApi
---

# Interface: FieldApi\<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes\>

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:100](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L100)

## Type Parameters

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldError

`TFieldError`

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

## Properties

### atom

```ts
atom: ReadonlyAtom<FieldState<TFieldValue, TFieldError>>;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:174](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L174)

***

### clearValues

```ts
clearValues: FieldClearValuesFn;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:156](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L156)

Clear all values from this field's array.
If this field is not an array, this method will be ignored.

#### Param

Optional update options

***

### errors

```ts
errors: FieldErrors<TFieldError>;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:180](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L180)

***

### filterValues

```ts
filterValues: FieldFilterValuesFn<TFieldValue>;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:172](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L172)

Filter the values in this field's array using a predicate function.
If this field is not an array, this method will be ignored.

#### Param

The predicate function to filter values. Returns true to keep the value, false to remove it.

#### Param

Optional update options including a custom `thisArg` for the predicate

***

### form

```ts
form: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:110](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L110)

The form that owns this field.

***

### handleBlur

```ts
handleBlur: FieldVoidFn;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:184](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L184)

***

### handleChange

```ts
handleChange: FieldHandleChangeFn<TFieldValue>;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:182](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L182)

***

### insertValue

```ts
insertValue: FieldInsertValueFn<TFieldValue>;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:149](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L149)

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
meta: FieldMeta<TFieldError>;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:178](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L178)

***

### moveValue

```ts
moveValue: FieldMoveValueFn;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:132](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L132)

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

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:140](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L140)

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

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:164](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L164)

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

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:186](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L186)

***

### swapValues()

```ts
swapValues: (indexA, indexB) => void;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:123](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L123)

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

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:176](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L176)

## Accessors

### name

#### Get Signature

```ts
get name(): TFieldName;
```

Defined in: [packages/form-core/src/FieldApi/FieldApi.public.ts:115](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L115)

The name of the field.

##### Returns

`TFieldName`
