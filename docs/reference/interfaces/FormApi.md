---
id: FormApi
title: FormApi
---

# Interface: FormApi\<TFormData, TFormErrorTypes\>

Defined in: [FormApi/FormApi.public.ts:632](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L632)

Core API for reading and updating state, validating values, and handling
submission.

Framework adapters compose this interface with framework-specific helpers.

## Extends

- [`FormApiFieldMethods`](FormApiFieldMethods.md)\<`TFormData`\>.[`FormApiArrayMethods`](FormApiArrayMethods.md)\<`TFormData`\>

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

Library-managed. Do not specify explicitly.

## Properties

### atom

```ts
atom: ReadonlyAtom<FormState<TFormData, TFormErrorTypes>>;
```

Defined in: [FormApi/FormApi.public.ts:643](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L643)

Read-only atom containing reactive `FormState` snapshots.

Subscribe to this atom to observe state changes. For an imperative read,
use `state`.

***

### clearFieldValues

```ts
clearFieldValues: ClearFieldValuesFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:378](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L378)

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

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`clearFieldValues`](FormApiArrayMethods.md#clearfieldvalues)

***

### defaultValues

```ts
readonly defaultValues: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:647](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L647)

The current baseline values used by `reset()` and `isDefaultValue`.

***

### filterFieldValues

```ts
filterFieldValues: FilterFieldValuesFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:414](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L414)

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

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`filterFieldValues`](FormApiArrayMethods.md#filterfieldvalues)

***

### formId

```ts
readonly formId: string;
```

Defined in: [FormApi/FormApi.public.ts:654](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L654)

Stable identifier supplied by `FormOptions.formId` or generated at
creation.

It is preserved across option updates until a new `formId` is supplied.

***

### getFieldValue

```ts
getFieldValue: GetFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiFieldMethods.types.public.ts:114](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiFieldMethods.types.public.ts#L114)

Reads the current value at a field path.

This is a read-only operation and does not create a `FieldApi` for the path.

#### Example

```ts
const name = formApi.getFieldValue('profile.name')
```

#### Returns

The current value at the path, or `undefined` when the path cannot
be resolved at runtime.

#### Inherited from

[`FormApiFieldMethods`](FormApiFieldMethods.md).[`getFieldValue`](FormApiFieldMethods.md#getfieldvalue)

***

### handleSubmit

```ts
handleSubmit: HandleSubmitFn<TFormData>;
```

Defined in: [FormApi/FormApi.public.ts:692](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L692)

Runs submission validation and submits current values when validation
succeeds.

Registered fields are marked touched, field validators run before form
validators, and `onSubmit` is awaited only when validation succeeds.
Validation error results and errors returned by `onSubmit` through
`createValidationError` are stored as error state. `onSubmitInvalid` is
awaited after a failed attempt.

Calls made while an attempt is in progress return the same promise instead
of starting another attempt.

The returned promise resolves to the error results produced by field and
form validation, plus any validation error returned by `onSubmit` through
`createValidationError`. The array is empty if none are produced.

***

### insertFieldValue

```ts
insertFieldValue: InsertFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:362](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L362)

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

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`insertFieldValue`](FormApiArrayMethods.md#insertfieldvalue)

***

### moveFieldValue

```ts
moveFieldValue: MoveFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:327](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L327)

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

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`moveFieldValue`](FormApiArrayMethods.md#movefieldvalue)

***

### pushFieldValue

```ts
pushFieldValue: PushFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:343](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L343)

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

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`pushFieldValue`](FormApiArrayMethods.md#pushfieldvalue)

***

### removeFieldValue

```ts
removeFieldValue: RemoveFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:397](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L397)

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

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`removeFieldValue`](FormApiArrayMethods.md#removefieldvalue)

***

### reset

```ts
reset: ResetFn<TFormData>;
```

Defined in: [FormApi/FormApi.public.ts:707](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L707)

Reset form values, metadata, validation state, and mounted fields.

`reset()` restores the current `defaultValues`.

`reset(values)` sets the current values and also updates `defaultValues`
to those values. This can apply expected values immediately while fresh
data is fetched from the backend.

Results from validation or submission work pending at reset are discarded.

Pass `{ updateDefaultValues: false }` as the options argument to preserve
the existing `defaultValues` when supplying values.

***

### resetField

```ts
resetField: ResetFieldFn<TFormData>;
```

Defined in: [FormApi/FormApiFieldMethods.types.public.ts:131](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiFieldMethods.types.public.ts#L131)

Restores a field path from `defaultValues` and resets state for its field
subtree.

Existing `FieldApi` instances at or below the path remain mounted.
Form-wide dirty history remains unchanged; use `formApi.reset()` to clear
it.

#### Example

```ts
formApi.setFieldValue('profile.name', 'Grace')
formApi.resetField('profile.name')
// `profile.name` is restored from `defaultValues`.
```

#### Inherited from

[`FormApiFieldMethods`](FormApiFieldMethods.md).[`resetField`](FormApiFieldMethods.md#resetfield)

***

### setFieldValue

```ts
setFieldValue: SetFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiFieldMethods.types.public.ts:99](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiFieldMethods.types.public.ts#L99)

Updates the current value at a field path.

The next value may be supplied directly or calculated from the current
value. By default, the update marks the field as touched and dirty,
notifies change listeners, and runs change validation.

#### Example

```ts
formApi.setFieldValue('profile.name', 'Ada')
formApi.setFieldValue('visitCount', (count) => count + 1)
```

#### Inherited from

[`FormApiFieldMethods`](FormApiFieldMethods.md).[`setFieldValue`](FormApiFieldMethods.md#setfieldvalue)

***

### state

```ts
readonly state: FormState<TFormData, TFormErrorTypes>;
```

Defined in: [FormApi/FormApi.public.ts:645](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L645)

Current values, validation status, and submission metadata.

***

### swapFieldValues

```ts
swapFieldValues: SwapFieldValuesFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:308](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L308)

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

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`swapFieldValues`](FormApiArrayMethods.md#swapfieldvalues)

***

### validate

```ts
validate: (signal) => Promise<FormValidationError<TFormData>[]>;
```

Defined in: [FormApi/FormApi.public.ts:671](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L671)

Runs form-level validators enabled for the specified `'change'` or
`'blur'` trigger.

Prefer configured validator triggers for change and blur validation, and
use `handleSubmit()` for submission validation. Calling this method
directly is rarely necessary.

Results update form-level errors and any errors routed to fields.
Field-level validators are not run by this method.

#### Parameters

##### signal

[`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md)

The trigger used to select validators.

#### Returns

`Promise`\<[`FormValidationError`](../type-aliases/FormValidationError.md)\<`TFormData`\>[]\>

A promise resolving to each error result from the validators that
ran. Unlike `state.errors`, these results are not flattened.
