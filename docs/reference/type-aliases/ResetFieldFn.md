---
id: ResetFieldFn
title: ResetFieldFn
---

# Type Alias: ResetFieldFn\<TFormData\>

```ts
type ResetFieldFn<TFormData> = <TDeepKeys>(DeepKeys) => void;
```

Defined in: [FormApi/FormApiFieldMethods.types.public.ts:73](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiFieldMethods.types.public.ts#L73)

Restores a field path from `defaultValues` and resets state for its field
subtree.

Existing `FieldApi` instances at or below the path remain mounted. Pending
validation is canceled, field metadata is cleared, and reset listeners are
notified. Form-wide dirty history remains unchanged; use `formApi.reset()`
to clear it.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Type Parameters

### TDeepKeys

`TDeepKeys` *extends* [`DeepKeys`](DeepKeys.md)\<`TFormData`\>

Library-managed. Do not specify explicitly.

## Parameters

### DeepKeys

`TDeepKeys`

The field path to reset.

## Returns

`void`

## Example

```ts
formApi.setFieldValue('profile.name', 'Grace')
formApi.resetField('profile.name')
// `profile.name` is restored from `defaultValues`.
```
