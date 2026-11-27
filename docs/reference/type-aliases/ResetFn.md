---
id: ResetFn
title: ResetFn
---

```ts
type ResetFn<TFormData> = (values?, opts?) => void;
```

Defined in: [FormApi/FormApi.public.ts:207](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L207)

Resets form values, field metadata, validation errors, and submission state.

- Omitting `values` restores the current `defaultValues`.
- Supplying `values` also replaces `defaultValues` unless
  `opts.updateDefaultValues` is `false`.
- Results from pending validation and submission cannot update the reset state.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Parameters

### values?

`TFormData`

Replacement values for the entire form.

### opts?

[`FormResetOptions`](../interfaces/FormResetOptions.md)

## Returns

`void`

## Remarks

**Important:** Reset aborts submission signals but does not wait for callbacks
that already started. Their submission promises still settle with the
callbacks' results or exceptions.
