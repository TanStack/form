---
id: GetFieldValueFn
title: GetFieldValueFn
---

# Type Alias: GetFieldValueFn\<TFormData\>

```ts
type GetFieldValueFn<TFormData> = <TDeepKeys>(DeepKeys) => DeepValue<TFormData, TDeepKeys>;
```

Defined in: [FormApi/FormApiFieldMethods.types.public.ts:47](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApiFieldMethods.types.public.ts#L47)

Reads the current value at a field path.

This is a read-only operation and does not create a `FieldApi` for the path.

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

The field path to read.

## Returns

[`DeepValue`](DeepValue.md)\<`TFormData`, `TDeepKeys`\>

The current value at the path, or `undefined` when the path cannot
be resolved at runtime.

## Example

```ts
const name = formApi.getFieldValue('profile.name')
```
