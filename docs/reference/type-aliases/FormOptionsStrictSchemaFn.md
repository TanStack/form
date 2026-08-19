---
id: FormOptionsStrictSchemaFn
title: FormOptionsStrictSchemaFn
---

# Type Alias: FormOptionsStrictSchemaFn\<TComponents\>

```ts
type FormOptionsStrictSchemaFn<TComponents> = <TFormValidators, TFormData, TSubmitReturn>(options) => FormOptions<FormValidatorData<TFormValidators>, TFormValidators, TSubmitReturn, TComponents>;
```

Defined in: [utils.public.ts:128](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L128)

Infers the form data type from a Standard Schema validator and requires
`defaultValues` to match the schema input.

Use this when the schema represents an input-to-output pipeline. Raw form
state remains available as `value`; read each validator's parsed output
from the corresponding `schemaOutputs` entry during submission.

At runtime, this returns the original options object and does not run the
schema.

`validators` must contain at least one Standard Schema to provide the type
inference and perform validation.

## Type Parameters

### TComponents

`TComponents`

Library-managed. Do not specify explicitly.

## Type Parameters

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`any`\>

Library-managed. Do not specify explicitly.

### TFormData

`TFormData` *extends* [`FormValidatorData`](FormValidatorData.md)\<`TFormValidators`\>

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

Library-managed. Do not specify explicitly.

## Parameters

### options

[`StandardSchemaFormOptions`](StandardSchemaFormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`, `unknown`\>

## Returns

[`FormOptions`](../interfaces/FormOptions.md)\<[`FormValidatorData`](FormValidatorData.md)\<`TFormValidators`\>, `TFormValidators`, `TSubmitReturn`, `TComponents`\>

The original options object, normalized to `FormOptions` with the
schema's input shape.

## Remarks

**Important:** Although schema-mode inputs require `validators`, this
returns a type normalized to `FormOptions`, where `validators` is optional.
This tradeoff enables safer inference and reuse.

## Example

```ts
const profileOptions = formOptions.strictSchema({
  defaultValues: { name: '' },
  validators: [
    {
      triggers: ['change'],
      run: z.object({ name: z.string().min(1) }),
    },
  ],
  onSubmit: ({ schemaOutputs }) => saveProfile(schemaOutputs[0]),
})
```
