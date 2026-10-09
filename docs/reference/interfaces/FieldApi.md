---
id: FieldApi
title: FieldApi
---

Defined in: [FieldApi/FieldApi.public.ts:123](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L123)

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

Defined in: [FieldApi/FieldApi.public.ts:206](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L206)

***

### clearValues

```ts
clearValues: FieldClearValuesFn;
```

Defined in: [FieldApi/FieldApi.public.ts:179](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L179)

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

Defined in: [FieldApi/FieldApi.public.ts:212](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L212)

***

### filterValues

```ts
filterValues: FieldFilterValuesFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:204](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L204)

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

Defined in: [FieldApi/FieldApi.public.ts:133](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L133)

The form that owns this field.

***

### handleBlur

```ts
handleBlur: FieldVoidFn;
```

Defined in: [FieldApi/FieldApi.public.ts:216](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L216)

***

### handleChange

```ts
handleChange: FieldHandleChangeFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:214](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L214)

***

### insertValue

```ts
insertValue: FieldInsertValueFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:172](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L172)

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

Defined in: [FieldApi/FieldApi.public.ts:210](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L210)

***

### moveValue

```ts
moveValue: FieldMoveValueFn;
```

Defined in: [FieldApi/FieldApi.public.ts:155](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L155)

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

Defined in: [FieldApi/FieldApi.public.ts:163](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L163)

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

Defined in: [FieldApi/FieldApi.public.ts:196](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L196)

Remove a value from this field's array at the specified index.
If this field is not an array, this method will be ignored.

#### Param

**index**

The index of the value to remove

#### Param

**options**

Optional update options

***

### replaceValue

```ts
replaceValue: FieldReplaceValueFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:188](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L188)

Replace the value at the specified index in this field's array.
If this field is not an array, this method will be ignored.

#### Param

**index**

The index of the value to replace

#### Param

**value**

The new value

#### Param

**options**

Optional update options

***

### reset

```ts
reset: FieldVoidFn;
```

Defined in: [FieldApi/FieldApi.public.ts:218](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L218)

***

### swapValues

```ts
swapValues: (indexA, indexB) => void;
```

Defined in: [FieldApi/FieldApi.public.ts:146](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L146)

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

Defined in: [FieldApi/FieldApi.public.ts:208](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L208)

## Accessors

### name

#### Get Signature

```ts
get name(): TFieldName;
```

Defined in: [FieldApi/FieldApi.public.ts:138](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L138)

The name of the field.

##### Returns

`TFieldName`
