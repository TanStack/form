---
id: FormApiArrayMethods
title: FormApiArrayMethods
---

# Interface: FormApiArrayMethods\<TFormData\>

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:290](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L290)

Methods for adding, removing, moving, and filtering array field elements.

## Extended by

- [`FormApi`](FormApi.md)

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Properties

### clearFieldValues

```ts
clearFieldValues: ClearFieldValuesFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:378](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L378)

Removes every element from an array field.

A runtime value that is not an array produces a warning and is left
unchanged. By default, the update marks the array field as touched and
dirty, notifies change listeners, and runs change validation.

#### Example

```ts
// items: ['first', 'second']
formApi.clearFieldValues('items')
// items: []
```

***

### filterFieldValues

```ts
filterFieldValues: FilterFieldValuesFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:414](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L414)

Keeps the elements that satisfy a predicate.

`options.thisArg` sets the predicate's `this` value. A runtime value that is
not an array produces a warning and is left unchanged. By default, the
update marks the array field as touched and dirty, notifies change
listeners, and runs change validation.

#### Example

```ts
// items: [1, 2, 3, 4]
formApi.filterFieldValues('items', (item) => item % 2 === 0)
// items: [2, 4]
```

***

### insertFieldValue

```ts
insertFieldValue: InsertFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:362](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L362)

Inserts an element at an index in an array field.

The index must be between `0` and `array.length`; passing `array.length`
appends the element. An out-of-range index or a runtime value that is not
an array produces a warning and leaves the value unchanged.

By default, the update marks the array field as touched and dirty, notifies
change listeners, and runs change validation.

#### Example

```ts
// items: ['first', 'second']
formApi.insertFieldValue('items', 1, 'new item')
// items: ['first', 'new item', 'second']
```

***

### moveFieldValue

```ts
moveFieldValue: MoveFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:327](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L327)

Moves an element to another index in an array field.

Both indices must be between `0` and `array.length - 1`. Passing equal
indices does nothing. Out-of-range indices or a runtime value that is not
an array produce a warning and leave the value unchanged.

By default, the update marks the array field as touched and dirty, notifies
change listeners, and runs change validation.

#### Example

```ts
// items: ['first', 'second', 'third']
formApi.moveFieldValue('items', 0, 2)
// items: ['second', 'third', 'first']
```

***

### pushFieldValue

```ts
pushFieldValue: PushFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:343](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L343)

Appends an element to an array field.

A runtime value that is not an array produces a warning and is left
unchanged. By default, the update marks the array field as touched and
dirty, notifies change listeners, and runs change validation.

#### Example

```ts
// items: ['first', 'second']
formApi.pushFieldValue('items', 'new item')
// items: ['first', 'second', 'new item']
```

***

### removeFieldValue

```ts
removeFieldValue: RemoveFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:397](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L397)

Removes an element from an array field.

The index must be between `0` and `array.length - 1`. An out-of-range index
or a runtime value that is not an array produces a warning and leaves the
value unchanged.

By default, the update marks the array field as touched and dirty, notifies
change listeners, and runs change validation.

#### Example

```ts
// items: ['first', 'second', 'third']
formApi.removeFieldValue('items', 1)
// items: ['first', 'third']
```

***

### swapFieldValues

```ts
swapFieldValues: SwapFieldValuesFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:308](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L308)

Swaps two elements in an array field.

Both indices must be between `0` and `array.length - 1`. Passing equal
indices does nothing. Out-of-range indices or a runtime value that is not
an array produce a warning and leave the value unchanged.

By default, the update marks the array field as touched and dirty, notifies
change listeners, and runs change validation.

#### Example

```ts
// items: ['first', 'second', 'third']
formApi.swapFieldValues('items', 0, 2)
// items: ['third', 'second', 'first']
```
