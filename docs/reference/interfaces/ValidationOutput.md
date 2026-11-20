---
id: ValidationOutput
title: ValidationOutput
---

Defined in: [validation/state.public.ts:46](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L46)

The result of `createOutput`. Return it from a validator to store its data
during submission.

## Example

```ts
formOptions({
  defaultValues: { name: '' },
  validators: [
    {
      run: ({ createOutput, value }) => {
        return createOutput({ displayName: value.name.trim() })
      },
    },
    {
      // Schemas pass their output data by default.
      run: mySchema,
    },
  ],
  onSubmit: ({ validatorOutputs }) => {
    // Outputs follow the same order as the validators array.
    const [customData, schemaOutput] = validatorOutputs
    console.log(customData.displayName)
  },
})
```

## Type Parameters

### TOutput

`TOutput`

Library-managed. Do not specify explicitly.

## Properties

### \[VALIDATION\_OUTPUT\]

```ts
readonly [VALIDATION_OUTPUT]: TOutput;
```

Defined in: [validation/state.public.ts:47](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L47)
