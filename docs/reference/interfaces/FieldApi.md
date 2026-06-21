---
id: FieldApi
title: FieldApi
---

# Interface: FieldApi\<TFieldName, TFieldValue, TFieldValidatorMetas, TGroupValidatorMetas, TFormData, TFormValidatorMetas, TSubmitReturn\>

Defined in: [FieldApi/FieldApi.public.ts:138](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L138)

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

Defined in: [FieldApi/FieldApi.public.ts:214](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L214)

***

### clearValues

```ts
clearValues: FieldClearValuesFn;
```

Defined in: [FieldApi/FieldApi.public.ts:196](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L196)

Clear all values from this field's array.
If this field is not an array, this method will be ignored.

#### Param

Optional update options

***

### errors

```ts
errors: FieldErrors<TFieldValidatorMetas, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn>;
```

Defined in: [FieldApi/FieldApi.public.ts:233](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L233)

***

### filterValues

```ts
filterValues: FieldFilterValuesFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:212](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L212)

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

Defined in: [FieldApi/FieldApi.public.ts:150](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L150)

The form that owns this field.

***

### handleBlur

```ts
handleBlur: FieldVoidFn;
```

Defined in: [FieldApi/FieldApi.public.ts:242](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L242)

***

### handleChange

```ts
handleChange: FieldHandleChangeFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:240](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L240)

***

### insertValue

```ts
insertValue: FieldInsertValueFn<TFieldValue>;
```

Defined in: [FieldApi/FieldApi.public.ts:189](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L189)

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

Defined in: [FieldApi/FieldApi.public.ts:226](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L226)

***

### moveValue

```ts
moveValue: FieldMoveValueFn;
```

Defined in: [FieldApi/FieldApi.public.ts:172](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L172)

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

Defined in: [FieldApi/FieldApi.public.ts:180](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L180)

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

Defined in: [FieldApi/FieldApi.public.ts:204](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L204)

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

Defined in: [FieldApi/FieldApi.public.ts:244](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L244)

***

### swapValues()

```ts
swapValues: (indexA, indexB) => void;
```

Defined in: [FieldApi/FieldApi.public.ts:163](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L163)

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

Defined in: [FieldApi/FieldApi.public.ts:224](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L224)

## Accessors

### name

#### Get Signature

```ts
get name(): TFieldName;
```

Defined in: [FieldApi/FieldApi.public.ts:155](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FieldApi/FieldApi.public.ts#L155)

The name of the field.

##### Returns

`TFieldName`
