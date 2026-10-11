---
id: CreateOutputFn
title: CreateOutputFn
---

```ts
type CreateOutputFn = <TOutput>(value) => ValidationOutput<TOutput>;
```

Defined in: [validation.public.ts:702](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L702)

Creates a successful validation result with data for `validatorOutputs`.

Return this result from a form or group validator. The payload appears at that
validator's index during submission or server validation and is forwarded
without mutation. Outputs from change, blur, and mount validation are **not**
retained for later submission.

## Type Parameters

### TOutput

`TOutput`

Library-managed. Do not specify explicitly.

## Parameters

### value

`TOutput`

The payload to expose at this validator's index.

## Returns

[`ValidationOutput`](../interfaces/ValidationOutput.md)\<`TOutput`\>

A successful validator result containing the original payload.

## Example

```ts
formOptions({
  defaultValues: { name: '' },
  validators: [{
    triggers: [],
    run: ({ value, createOutput }) => createOutput(value.name.trim()),
  }],
  onSubmit: ({ validatorOutputs }) => {
    const trimmedName = validatorOutputs[0]
    // ...
  },
})
```
