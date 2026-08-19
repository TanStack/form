---
id: FormOptionsLooseSchemaFn
title: FormOptionsLooseSchemaFn
---

# Type Alias: FormOptionsLooseSchemaFn\<TComponents\>

```ts
type FormOptionsLooseSchemaFn<TComponents> = <TFormValidators, TFormData, TSubmitReturn>(options) => FormOptions<InferUnion<TFormData, FormValidatorData<TFormValidators>>, TFormValidators, TSubmitReturn, TComponents>;
```

Defined in: [utils.public.ts:192](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L192)

Infers the form data shape from a Standard Schema validator while allowing
editable defaults to omit properties or contain `null` or `undefined`
values.

Use this when the schema represents the final valid shape but the UI needs
intermediate empty states, such as an unselected date. Raw form state
remains available as `value`; read each validator's parsed output from the
corresponding `schemaOutputs` entry during submission.

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

`TFormData` *extends* [`NullableSchemaData`](NullableSchemaData.md)\<`TFormValidators`\>

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

Library-managed. Do not specify explicitly.

## Parameters

### options

[`StandardSchemaFormOptions`](StandardSchemaFormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`, `unknown`\>

## Returns

[`FormOptions`](../interfaces/FormOptions.md)\<[`InferUnion`](InferUnion.md)\<`TFormData`, [`FormValidatorData`](FormValidatorData.md)\<`TFormValidators`\>\>, `TFormValidators`, `TSubmitReturn`, `TComponents`\>

The original options object, normalized to `FormOptions` with
omitted, nullable, and undefined editable states merged into the schema's
input shape.

## Remarks

**Important:** Although schema-mode inputs require `validators`, this
returns a type normalized to `FormOptions`, where `validators` is optional.
This tradeoff enables safer inference and reuse.

## Example

```ts
const bookingOptions = formOptions.looseSchema({
  defaultValues: { startDate: null },
  validators: [
    {
      triggers: ['blur'],
      run: z.object({ startDate: z.date() }),
    },
  ],
  onSubmit: ({ schemaOutputs }) => saveBooking(schemaOutputs[0]),
})
```
