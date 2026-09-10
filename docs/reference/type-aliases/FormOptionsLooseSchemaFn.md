---
id: FormOptionsLooseSchemaFn
title: FormOptionsLooseSchemaFn
---

# Type Alias: FormOptionsLooseSchemaFn\<TComponents\>

```ts
type FormOptionsLooseSchemaFn<TComponents> = <TSchema, TFormData, TFormValidators, TSubmitReturn>(schema, options) => FormOptions<InferUnion<TFormData, StandardSchemaInput<TSchema>>, TFormValidators, TSubmitReturn, TComponents>;
```

Defined in: [utils.public.ts:174](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L174)

Types loose schema form options using a separate schema as the source of the
final valid form shape.

`defaultValues` infer an editable form shape constrained by the schema input,
so properties may be omitted or contain `null` or `undefined`. Callback
validator `value` parameters use that editable shape merged with the schema
input.

The first argument is used only by TypeScript and is ignored at runtime.
Include the schema in `validators` as well when it should validate the form.
Parsed results are available in the corresponding `schemaOutputs` entries
during submission.

## Type Parameters

### TComponents

`TComponents`

Library-managed. Do not specify explicitly.

## Type Parameters

### TSchema

`TSchema` *extends* [`StandardSchemaV1`](StandardSchemaV1.md)\<`any`, `any`\>

Library-managed. Do not specify explicitly.

### TFormData

`TFormData` *extends* [`Editable`](Editable.md)\<`StandardSchemaInput`\<`TSchema`\>\>

Library-managed. Do not specify explicitly.

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`NoInfer`\<[`InferUnion`](InferUnion.md)\<`TFormData`, `StandardSchemaInput`\<`TSchema`\>\>\>\>

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

Library-managed. Do not specify explicitly.

## Parameters

### schema

`TSchema`

Supplies the final valid form shape without registering a
validator.

### options

`LooseSchemaFormOptions`\<`StandardSchemaInput`\<`TSchema`\>, `TFormData`, `TFormValidators`, `TSubmitReturn`\>

The form options used to infer the editable form shape.

## Returns

[`FormOptions`](../interfaces/FormOptions.md)\<[`InferUnion`](InferUnion.md)\<`TFormData`, `StandardSchemaInput`\<`TSchema`\>\>, `TFormValidators`, `TSubmitReturn`, `TComponents`\>

The original options object, normalized to `FormOptions` with the
editable states merged into the schema input.

## Example

```ts
const bookingSchema = z.object({ startDate: z.date() })
const bookingOptions = formOptions.looseSchema(bookingSchema, {
  defaultValues: { startDate: null },
  validators: [
    { triggers: ['blur'], run: bookingSchema },
    {
      triggers: ['change'],
      run: ({ value }) =>
        value.startDate === null ? 'Choose a date' : undefined,
    },
  ],
})
```
