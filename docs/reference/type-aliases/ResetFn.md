---
id: ResetFn
title: ResetFn
---

# Type Alias: ResetFn\<TFormData\>

```ts
type ResetFn<TFormData> = (values?, opts?) => void;
```

Defined in: [FormApi/FormApi.public.ts:596](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L596)

Resets form values, metadata, validation state, and mounted fields.

Calling without values restores the current `defaultValues`. Supplying
values sets the current values and also updates `defaultValues` to those
values. This can apply expected values immediately while fresh data is
fetched from the backend.

Results from validation or submission work pending at reset are discarded.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Parameters

### values?

`TFormData`

Values to apply, or omit to restore `defaultValues`.

### opts?

[`FormResetOptions`](../interfaces/FormResetOptions.md)

Options controlling whether supplied values replace
`defaultValues`.

## Returns

`void`
