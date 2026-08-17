---
id: FormOptionsStrictSchemaFn
title: FormOptionsStrictSchemaFn
---

# Type Alias: FormOptionsStrictSchemaFn

```ts
type FormOptionsStrictSchemaFn = <TFormValidators, TFormData, TSubmitReturn>(options) => FormOptions<FormValidatorData<TFormValidators>, TFormValidators, TSubmitReturn>;
```

Defined in: [utils.public.ts:93](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L93)

Infers the form data type from a Standard Schema validator and requires
`defaultValues` to match the schema input.

Use this when the schema represents an input-to-output pipeline. Raw form
state remains available as `value`; read each validator's parsed output
from the corresponding `schemaOutputs` entry during submission.

At runtime, this returns the original options object and does not run the
schema.

Include the schema in `validators` to provide the type inference and
perform validation.

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

[`FormOptions`](../interfaces/FormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

## Returns

[`FormOptions`](../interfaces/FormOptions.md)\<[`FormValidatorData`](FormValidatorData.md)\<`TFormValidators`\>, `TFormValidators`, `TSubmitReturn`\>

The original options object, normalized to `FormOptions` with the
schema's input shape.

## Remarks

**Important:** Although this returns the original object unchanged at
runtime, its type is normalized to `FormOptions`. Optional properties such
as `validators` therefore remain optional even when supplied. This
tradeoff enables safer inference and reuse.

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
