---
id: FormOptionsApi
title: FormOptionsApi
---

# Interface: FormOptionsApi()

Defined in: [utils.public.ts:169](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L169)

The callable API exposed by `formOptions`, including its schema-driven
inference modes.

Use `formOptions` directly instead of naming this interface in application
code.

```ts
FormOptionsApi<TFormData, TFormValidators, TSubmitReturn>(options): FormOptions<TFormData, TFormValidators, TSubmitReturn>;
```

Defined in: [utils.public.ts:190](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L190)

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

[`FormOptions`](FormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

## Returns

[`FormOptions`](FormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

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
looseSchema: FormOptionsLooseSchemaFn;
```

Defined in: [utils.public.ts:282](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L282)

Infers the form data shape from a Standard Schema validator while allowing
editable defaults to contain `null` or `undefined` values.

Use this when the schema represents the final valid shape but the UI needs
intermediate empty states, such as an unselected date. Raw form state
remains available as `value`; read each validator's parsed output from the
corresponding `schemaOutputs` entry during submission.

At runtime, this returns the original options object and does not run the
schema.

Include the schema in `validators` to provide the type inference and
perform validation.

#### Remarks

**Important:** Although this returns the original object unchanged at
runtime, its type is normalized to `FormOptions`. Optional properties such
as `validators` therefore remain optional even when supplied. This
tradeoff enables safer inference and reuse.

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
nullable and undefined editable states merged into the schema's input
shape.

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
strictSchema: FormOptionsStrictSchemaFn;
```

Defined in: [utils.public.ts:238](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L238)

Infers the form data type from a Standard Schema validator and requires
`defaultValues` to match the schema input.

Use this when the schema represents an input-to-output pipeline. Raw form
state remains available as `value`; read each validator's parsed output
from the corresponding `schemaOutputs` entry during submission.

At runtime, this returns the original options object and does not run the
schema.

Include the schema in `validators` to provide the type inference and
perform validation.

#### Remarks

**Important:** Although this returns the original object unchanged at
runtime, its type is normalized to `FormOptions`. Optional properties such
as `validators` therefore remain optional even when supplied. This
tradeoff enables safer inference and reuse.

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
