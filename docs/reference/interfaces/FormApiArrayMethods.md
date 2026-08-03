---
id: FormApiArrayMethods
title: FormApiArrayMethods
---

# Interface: FormApiArrayMethods\<TFormData\>

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:90](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L90)

## Extended by

- [`FormApi`](FormApi.md)

## Type Parameters

### TFormData

`TFormData`

## Properties

### clearFieldValues

```ts
clearFieldValues: ClearFieldValuesFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:134](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L134)

Clear all values from an array field.
If the field is not an array, this method will be ignored.

#### Param

The name of the array field

***

### filterFieldValues

```ts
filterFieldValues: FilterFieldValuesFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:152](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L152)

Filter the values in an array field using a predicate function.
If the field is not an array, this method will be ignored.

#### Param

The name of the array field

#### Param

The predicate function to filter values. Returns true to keep the value, false to remove it.

#### Param

Optional update options including a custom `thisArg` for the predicate

***

### insertFieldValue

```ts
insertFieldValue: InsertFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:127](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L127)

Insert a value into an array field at the specified index.
If the field is not an array, this method will be ignored.

#### Param

The name of the array field

#### Param

The index at which to insert the value

#### Param

The value to insert

#### Param

Optional update options

***

### moveFieldValue

```ts
moveFieldValue: MoveFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:108](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L108)

Move a value in an array field from one index to another.
If the field is not an array, this method will be ignored.

#### Param

The name of the array field

#### Param

The current index of the value to move

#### Param

The index to move the value to

#### Param

Optional update options

***

### pushFieldValue

```ts
pushFieldValue: PushFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:117](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L117)

Push a value into an array field.
If the field is not an array, this method will be ignored.

#### Param

The name of the array field

#### Param

The value to push

#### Param

Optional update options

***

### removeFieldValue

```ts
removeFieldValue: RemoveFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:143](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L143)

Remove a value from an array field at the specified index.
If the field is not an array, this method will be ignored.

#### Param

The name of the array field

#### Param

The index of the value to remove

#### Param

Optional update options

***

### swapFieldValues

```ts
swapFieldValues: SwapFieldValuesFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:98](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L98)

Swap two values in an array field.
If the field is not an array, this method will be ignored.

#### Param

The name of the array field

#### Param

The index of the first value to swap

#### Param

The index of the second value to swap
