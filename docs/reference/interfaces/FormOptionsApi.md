---
id: FormOptionsApi
title: FormOptionsApi
---

# Interface: FormOptionsApi()\<TComponents\>

Defined in: [utils.public.ts:205](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L205)

The callable API exposed by `formOptions`, including its schema-driven
inference modes.

Use `formOptions` directly instead of naming this interface in application
code.

## Type Parameters

### TComponents

`TComponents`

Library-managed. Do not specify explicitly.

```ts
FormOptionsApi<TFormData, TFormValidators, TSubmitReturn>(options): FormOptions<TFormData, TFormValidators, TSubmitReturn, TComponents>;
```

Defined in: [utils.public.ts:226](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L226)

Keeps types inferred from `defaultValues`, validators, and submission
callbacks when form options are declared separately.

`defaultValues` determine the form data shape in this mode. At runtime,
this returns the original options object and does not create a form or run
validation.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](../type-aliases/FormValidators.md)\<`TFormData`\>

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

Library-managed. Do not specify explicitly.

## Parameters

### options

[`FormOptions`](FormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`, `unknown`\>

## Returns

[`FormOptions`](FormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`, `TComponents`\>

The original options object, normalized to `FormOptions` with its
inferred form data, validator, and submission types.

## Remarks

**Important:** Although this returns the original object unchanged at
runtime, its type is normalized to `FormOptions`. Optional properties such
as `validators` therefore remain optional even when supplied. This
tradeoff enables safer inference and reuse.

## Properties

### looseSchema

```ts
looseSchema: FormOptionsLooseSchemaFn<TComponents>;
```

Defined in: [utils.public.ts:332](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L332)

Infers the form data shape from a Standard Schema validator while allowing
editable defaults to omit properties or contain `null` or `undefined`
values.

Use this when the schema represents the final valid shape but the UI needs
intermediate empty states, such as an unselected date. Raw form state
remains available as `value`; read each validator's parsed output from the
corresponding `schemaOutputs` entry during submission.

Pass the schema as the first argument and the options as the second.
`defaultValues` infer an editable form shape constrained by the schema
input, and callbacks receive that shape merged with the schema input. The
first argument is ignored at runtime; include the schema in `validators`
when it should run.

#### Remarks

**Important:** Although this returns the original object unchanged at
runtime, its type is normalized to `FormOptions`. Optional properties such
as `validators` therefore remain optional even when supplied. This
tradeoff enables safer inference and reuse.

#### Example

```ts
const bookingSchema = z.object({ startDate: z.date() })
const bookingOptions = formOptions.looseSchema(bookingSchema, {
  defaultValues: { startDate: null },
  validators: [
    {
      triggers: ['blur'],
      run: bookingSchema,
    },
    {
      triggers: ['change'],
      run: ({ value }) =>
        value.startDate === null ? 'Choose a date' : undefined,
    },
  ],
  onSubmit: ({ schemaOutputs }) => saveBooking(schemaOutputs[0]),
})
```

#### Returns

The original options object, normalized to `FormOptions` with
omitted, nullable, and undefined editable states merged into the schema's
input shape.

#### Type Param

**TSchema**

Library-managed. Do not specify explicitly.

#### Type Param

**TFormValidators**

Library-managed. Do not specify explicitly.

#### Type Param

**TFormData**

Library-managed. Do not specify explicitly.

#### Type Param

**TSubmitReturn**

Library-managed. Do not specify explicitly.

***

### strictSchema

```ts
strictSchema: FormOptionsStrictSchemaFn<TComponents>;
```

Defined in: [utils.public.ts:280](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L280)

Infers the form data type from a Standard Schema validator and requires
`defaultValues` to match the schema input.

Use this when the schema represents an input-to-output pipeline. Raw form
state remains available as `value`; read each validator's parsed output
from the corresponding `schemaOutputs` entry during submission.

Pass the schema as the first argument and the options as the second. This
fixes the form data to the schema input before the options are inferred, so
each callback receives a typed `value`. The first argument is ignored at
runtime; include the schema in `validators` when it should run.

#### Remarks

**Important:** Although this returns the original object unchanged at
runtime, its type is normalized to `FormOptions`. Optional properties such
as `validators` therefore remain optional even when supplied. This
tradeoff enables safer inference and reuse.

#### Example

```ts
const profileSchema = z.object({ name: z.string().min(1) })
const profileOptions = formOptions.strictSchema(profileSchema, {
  defaultValues: { name: '' },
  validators: [
    {
      triggers: ['change'],
      run: profileSchema,
    },
    {
      triggers: ['change'],
      run: ({ value }) =>
        value.name.length === 0 ? 'Name is required' : undefined,
    },
  ],
  onSubmit: ({ schemaOutputs }) => saveProfile(schemaOutputs[0]),
})
```

#### Returns

The original options object, normalized to `FormOptions` with the
schema's input shape.

#### Type Param

**TSchema**

Library-managed. Do not specify explicitly.

#### Type Param

**TFormValidators**

Library-managed. Do not specify explicitly.

#### Type Param

**TFormData**

Library-managed. Do not specify explicitly.

#### Type Param

**TSubmitReturn**

Library-managed. Do not specify explicitly.
