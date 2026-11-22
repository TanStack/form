---
id: ValidationOutput
title: ValidationOutput
---

Defined in: [validation/results/results.public.ts:42](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L42)

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

Defined in: [validation/results/results.public.ts:43](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L43)
