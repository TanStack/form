---
id: FormApiFieldMethods
title: FormApiFieldMethods
---

# Interface: FormApiFieldMethods\<TFormData\>

Defined in: [FormApi/FormApiFieldMethods.types.public.ts:85](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApiFieldMethods.types.public.ts#L85)

Type-safe methods for reading, updating, and resetting individual field
values.

## Extended by

- [`FormApi`](FormApi.md)

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Properties

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
