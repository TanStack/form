---
id: FormOptionsApi
title: FormOptionsApi
---

# Interface: FormOptionsApi()\<TComponents\>

Defined in: [utils.public.ts:219](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L219)

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

Defined in: [utils.public.ts:240](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L240)

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

Defined in: [utils.public.ts:331](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L331)

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

#### Remarks

**Important:** Although schema-mode inputs require `validators`, this
returns a type normalized to `FormOptions`, where `validators` is optional.
This tradeoff enables safer inference and reuse.

#### Example

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

#### Returns

The original options object, normalized to `FormOptions` with
omitted, nullable, and undefined editable states merged into the schema's
input shape.

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

Defined in: [utils.public.ts:287](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L287)

Infers the form data type from a Standard Schema validator and requires
`defaultValues` to match the schema input.

Use this when the schema represents an input-to-output pipeline. Raw form
state remains available as `value`; read each validator's parsed output
from the corresponding `schemaOutputs` entry during submission.

At runtime, this returns the original options object and does not run the
schema.

`validators` must contain at least one Standard Schema to provide the type
inference and perform validation.

#### Remarks

**Important:** Although schema-mode inputs require `validators`, this
returns a type normalized to `FormOptions`, where `validators` is optional.
This tradeoff enables safer inference and reuse.

#### Example

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

#### Returns

The original options object, normalized to `FormOptions` with the
schema's input shape.

#### Type Param

**TFormValidators**

Library-managed. Do not specify explicitly.

#### Type Param

**TFormData**

Library-managed. Do not specify explicitly.

#### Type Param

**TSubmitReturn**

Library-managed. Do not specify explicitly.
