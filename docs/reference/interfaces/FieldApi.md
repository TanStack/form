---
id: FieldApi
title: FieldApi
---

# Interface: FieldApi\<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes\>

Defined in: [FieldApi/FieldApi.public.ts:117](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L117)

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

Defined in: [FieldApi/FieldApi.public.ts:191](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L191)

***

### clearValues

```ts
clearValues: FieldClearValuesFn;
```

Defined in: [FieldApi/FieldApi.public.ts:173](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L173)

Clear all values from this field's array.
If this field is not an array, this method will be ignored.

#### Param

**options**

Optional update options

***

### errors

```ts
errors: FieldErrors<TFieldError>;
```

Defined in: [FieldApi/FieldApi.public.ts:197](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L197)

***

### filterValues

```ts
filterValues: FieldFilterValuesFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:189](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L189)

Filter the values in this field's array using a predicate function.
If this field is not an array, this method will be ignored.

#### Param

**predicate**

The predicate function to filter values. Returns true to keep the value, false to remove it.

#### Param

**options**

Optional update options including a custom `thisArg` for the predicate

***

### form

```ts
form: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [FieldApi/FieldApi.public.ts:127](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L127)

The form that owns this field.

***

### handleBlur

```ts
handleBlur: FieldVoidFn;
```

Defined in: [FieldApi/FieldApi.public.ts:201](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L201)

***

### handleChange

```ts
handleChange: FieldHandleChangeFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:199](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L199)

***

### insertValue

```ts
insertValue: FieldInsertValueFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:166](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L166)

Insert a new value into this field's array at the specified index.
If this field is not an array, this method will be ignored.

#### Param

**index**

The index at which to insert the value

#### Param

**value**

The value to insert

#### Param

**options**

Optional update options

***

### meta

```ts
meta: FieldMeta<TFieldError>;
```

Defined in: [FieldApi/FieldApi.public.ts:195](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L195)

***

### moveValue

```ts
moveValue: FieldMoveValueFn;
```

Defined in: [FieldApi/FieldApi.public.ts:149](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L149)

Move an element in this field's array from one index to another.
If this field is not an array, this method will be ignored.

#### Param

**fromIndex**

The current index of the element to move

#### Param

**toIndex**

The index to move the element to

#### Param

**options**

Optional update options

***

### pushValue

```ts
pushValue: FieldPushValueFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:157](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L157)

Push a new value into this field's array.
If this field is not an array, this method will be ignored.

#### Param

**value**

The value to push into the array

#### Param

**options**

Optional update options

***

### removeValue

```ts
removeValue: FieldRemoveValueFn;
```

Defined in: [FieldApi/FieldApi.public.ts:181](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L181)

Remove a value from this field's array at the specified index.
If this field is not an array, this method will be ignored.

#### Param

**index**

The index of the value to remove

#### Param

**options**

Optional update options

***

### reset

```ts
reset: FieldVoidFn;
```

Defined in: [FieldApi/FieldApi.public.ts:203](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L203)

***

### swapValues

```ts
swapValues: (indexA, indexB) => void;
```

Defined in: [FieldApi/FieldApi.public.ts:140](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L140)

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

Defined in: [FieldApi/FieldApi.public.ts:193](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L193)

## Accessors

### name

#### Get Signature

```ts
get name(): TFieldName;
```

Defined in: [FieldApi/FieldApi.public.ts:132](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L132)

The name of the field.

##### Returns

`TFieldName`
