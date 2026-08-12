---
id: FormApi
title: FormApi
---

# Interface: FormApi\<TFormData, TFormErrorTypes\>

Defined in: [FormApi/FormApi.public.ts:311](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L311)

## Extends

- [`FormApiFieldMethods`](FormApiFieldMethods.md)\<`TFormData`\>.[`FormApiArrayMethods`](FormApiArrayMethods.md)\<`TFormData`\>

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

## Properties

### atom

```ts
atom: ReadonlyAtom<FormState<TFormData, TFormErrorTypes>>;
```

Defined in: [FormApi/FormApi.public.ts:316](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L316)

***

### clearFieldValues

```ts
clearFieldValues: ClearFieldValuesFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:134](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L134)

Clear all values from an array field.
If the field is not an array, this method will be ignored.

#### Param

**arrayFieldName**

The name of the array field

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`clearFieldValues`](FormApiArrayMethods.md#clearfieldvalues)

***

### defaultValues

```ts
readonly defaultValues: TFormData;
```

Defined in: [FormApi/FormApi.public.ts:319](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L319)

The current baseline values used by `reset()` and `isDefaultValue`.

***

### filterFieldValues

```ts
filterFieldValues: FilterFieldValuesFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:152](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L152)

Filter the values in an array field using a predicate function.
If the field is not an array, this method will be ignored.

#### Param

**arrayFieldName**

The name of the array field

#### Param

**predicate**

The predicate function to filter values. Returns true to keep the value, false to remove it.

#### Param

**options**

Optional update options including a custom `thisArg` for the predicate

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`filterFieldValues`](FormApiArrayMethods.md#filterfieldvalues)

***

### formId

```ts
readonly formId: string;
```

Defined in: [FormApi/FormApi.public.ts:320](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L320)

***

### getFieldValue

```ts
getFieldValue: GetFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiFieldMethods.types.public.ts:37](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiFieldMethods.types.public.ts#L37)

TODO

#### Param

**DeepKeys**

#### Returns

#### Inherited from

[`FormApiFieldMethods`](FormApiFieldMethods.md).[`getFieldValue`](FormApiFieldMethods.md#getfieldvalue)

***

### handleSubmit

```ts
handleSubmit: () => Promise<FormValidationError<TFormData>[]>;
```

Defined in: [FormApi/FormApi.public.ts:337](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L337)

TODO for later: submit meta

#### Returns

`Promise`\<[`FormValidationError`](../type-aliases/FormValidationError.md)\<`TFormData`\>[]\>

***

### insertFieldValue

```ts
insertFieldValue: InsertFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:127](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L127)

Insert a value into an array field at the specified index.
If the field is not an array, this method will be ignored.

#### Param

**arrayFieldName**

The name of the array field

#### Param

**index**

The index at which to insert the value

#### Param

**value**

The value to insert

#### Param

**options**

Optional update options

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`insertFieldValue`](FormApiArrayMethods.md#insertfieldvalue)

***

### moveFieldValue

```ts
moveFieldValue: MoveFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:108](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L108)

Move a value in an array field from one index to another.
If the field is not an array, this method will be ignored.

#### Param

**arrayFieldName**

The name of the array field

#### Param

**fromIndex**

The current index of the value to move

#### Param

**toIndex**

The index to move the value to

#### Param

**options**

Optional update options

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`moveFieldValue`](FormApiArrayMethods.md#movefieldvalue)

***

### pushFieldValue

```ts
pushFieldValue: PushFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:117](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L117)

Push a value into an array field.
If the field is not an array, this method will be ignored.

#### Param

**arrayFieldName**

The name of the array field

#### Param

**value**

The value to push

#### Param

**options**

Optional update options

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`pushFieldValue`](FormApiArrayMethods.md#pushfieldvalue)

***

### removeFieldValue

```ts
removeFieldValue: RemoveFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:143](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L143)

Remove a value from an array field at the specified index.
If the field is not an array, this method will be ignored.

#### Param

**arrayFieldName**

The name of the array field

#### Param

**index**

The index of the value to remove

#### Param

**options**

Optional update options

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`removeFieldValue`](FormApiArrayMethods.md#removefieldvalue)

***

### reset

```ts
reset: (values?, opts?) => void;
```

Defined in: [FormApi/FormApi.public.ts:349](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L349)

Reset form values, metadata, validation state, and mounted fields.

`reset()` restores the current `defaultValues`.

`reset(values)` sets the current values and also updates `defaultValues`
to those values.

`reset(values, { updateDefaultValues: false })` sets the current values
while preserving the previous `defaultValues` baseline.

#### Parameters

##### values?

`TFormData`

##### opts?

[`FormResetOptions`](FormResetOptions.md)

#### Returns

`void`

***

### resetField

```ts
resetField: ResetFieldFn<TFormData>;
```

Defined in: [FormApi/FormApiFieldMethods.types.public.ts:39](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiFieldMethods.types.public.ts#L39)

#### Inherited from

[`FormApiFieldMethods`](FormApiFieldMethods.md).[`resetField`](FormApiFieldMethods.md#resetfield)

***

### setFieldValue

```ts
setFieldValue: SetFieldValueFn<TFormData>;
```

Defined in: [FormApi/FormApiFieldMethods.types.public.ts:30](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiFieldMethods.types.public.ts#L30)

TODO

#### Param

**DeepKeys**

#### Param

**updater**

#### Inherited from

[`FormApiFieldMethods`](FormApiFieldMethods.md).[`setFieldValue`](FormApiFieldMethods.md#setfieldvalue)

***

### state

```ts
readonly state: FormState<TFormData, TFormErrorTypes>;
```

Defined in: [FormApi/FormApi.public.ts:317](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L317)

***

### swapFieldValues

```ts
swapFieldValues: SwapFieldValuesFn<TFormData>;
```

Defined in: [FormApi/FormApiArrayMethods.types.public.ts:98](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiArrayMethods.types.public.ts#L98)

Swap two values in an array field.
If the field is not an array, this method will be ignored.

#### Param

**arrayFieldName**

The name of the array field

#### Param

**indexA**

The index of the first value to swap

#### Param

**indexB**

The index of the second value to swap

#### Inherited from

[`FormApiArrayMethods`](FormApiArrayMethods.md).[`swapFieldValues`](FormApiArrayMethods.md#swapfieldvalues)

***

### validate

```ts
validate: (signal) => Promise<FormValidationError<TFormData>[]>;
```

Defined in: [FormApi/FormApi.public.ts:329](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L329)

TODO expand on it

Validates with the given validation signal and returns
errors if they appeared. It will automatically populate the
form's error state.

#### Parameters

##### signal

[`ConfigurableValidationTrigger`](../type-aliases/ConfigurableValidationTrigger.md)

#### Returns

`Promise`\<[`FormValidationError`](../type-aliases/FormValidationError.md)\<`TFormData`\>[]\>
