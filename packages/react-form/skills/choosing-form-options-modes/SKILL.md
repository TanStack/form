---
name: choosing-form-options-modes
description: >
  Use when choosing TanStack React Form v2 formOptions, formOptions.strictSchema,
  formOptions.looseSchema, appFormOptions, appFormOptions.strictSchema, or
  appFormOptions.looseSchema. Covers defaultValues-first inference, schema-source
  typing, Standard Schema validators, pipeline schemas, ruleset schemas, nullish
  editable defaults, and schemaOutputs in onSubmit.
metadata:
  type: framework
  library: "@tanstack/react-form"
  framework: react
  library_version: "0.0.0"
requires: []
sources:
  - TanStack/form-v2:packages/form-core/src/utils.public.ts
  - TanStack/form-v2:packages/react-form/src/AppForm/appFormOptions.public.ts
  - TanStack/form-v2:packages/form-core/tests/validation.test-d.ts
  - TanStack/form-v2:examples/react/ui-integration/shadcn/src/app/booking/schema.ts
---

# TanStack React Form - Choosing Form Options Modes

Choose the option mode before fighting type errors. The mode defines which source owns the form value type.

## Setup

```tsx
import { formOptions, useForm } from '@tanstack/react-form'

const profileOptions = formOptions({
  defaultValues: {
    name: '',
    email: '',
  },
})

export function ProfileForm() {
  const form = useForm({
    ...profileOptions,
    onSubmit: ({ value }) => {
      console.log(value.name)
    },
  })

  return (
    <form.Field name="name">
      {(field) => (
        <input
          value={field.value}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
        />
      )}
    </form.Field>
  )
}
```

## Hooks And Components

### Default formOptions: defaults own the type

```ts
import { formOptions } from '@tanstack/react-form'

export const personOptions = formOptions({
  defaultValues: {
    name: '',
    age: 0,
  },
  validators: [
    {
      run: ({ value }) => (value.name.length === 0 ? 'Name is required' : undefined),
      triggers: ['change'],
    },
  ],
})
```

Use default `formOptions` when callback validators should infer from the literal default values.

### strictSchema: schema input and output own the boundary

```ts
import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
})

export const strictOptions = formOptions.strictSchema({
  defaultValues: {
    name: '',
  },
  validators: [{ run: schema, triggers: ['change'] }],
  onSubmit: ({ schemaOutputs }) => {
    const parsed = schemaOutputs[0]
    console.log(parsed.name)
  },
})
```

Use strict schema mode when the schema is a pipeline from input to parsed output.

### looseSchema: schema output with editable nullish states

```ts
import { formOptions } from '@tanstack/react-form'
import { z } from 'zod'

const schema = z.object({
  startDate: z.date(),
})

export const looseOptions = formOptions.looseSchema({
  defaultValues: {
    startDate: null,
  },
  validators: [{ run: schema, triggers: ['blur'] }],
  onSubmit: ({ schemaOutputs }) => {
    const parsed = schemaOutputs[0]
    console.log(parsed.startDate.toISOString())
  },
})
```

Use loose schema mode when the schema is a ruleset for final validity but the UI needs nullable or undefined editing states.

## Common Mistakes

### HIGH Expecting option helpers to validate

Wrong:

```ts
const options = formOptions.strictSchema({
  defaultValues: { name: '' },
})
```

Correct:

```ts
const options = formOptions.strictSchema({
  defaultValues: { name: '' },
  validators: [{ run: nameSchema, triggers: ['change'] }],
})
```

`strictSchema` and `looseSchema` are runtime identity helpers with type-level meaning; validators perform validation.

Source: TanStack/form-v2:packages/form-core/src/utils.public.ts

### HIGH Using default options for schema-owned typing

Wrong:

```ts
const options = formOptions({
  defaultValues: {
    name: '',
  },
  validators: [{ run: nameSchema, triggers: ['change'] }],
})
```

Correct:

```ts
const options = formOptions.strictSchema({
  defaultValues: {
    name: '',
  },
  validators: [{ run: nameSchema, triggers: ['change'] }],
})
```

Default `formOptions` takes `defaultValues` at face value; use a schema mode when the schema should own the form type.

Source: maintainer interview

### HIGH Forcing strictSchema through editable nulls

Wrong:

```ts
const options = formOptions.strictSchema({
  defaultValues: {
    startDate: null as unknown as Date,
  },
  validators: [{ run: dateSchema, triggers: ['blur'] }],
})
```

Correct:

```ts
const options = formOptions.looseSchema({
  defaultValues: {
    startDate: null,
  },
  validators: [{ run: dateSchema, triggers: ['blur'] }],
})
```

Use loose schema mode for nullish editable states; do not type assert defaults into strict input.

Source: maintainer interview

### HIGH Reading value as parsed schema output

Wrong:

```ts
onSubmit: ({ value }) => {
  console.log(value.nameLength)
}
```

Correct:

```ts
onSubmit: ({ schemaOutputs }) => {
  const parsed = schemaOutputs[0]
  console.log(parsed.nameLength)
}
```

Raw `value` remains form state; parsed Standard Schema output is exposed through `schemaOutputs`.

Source: TanStack/form-v2:packages/form-core/tests/validation.test.ts

### MEDIUM Treating Zod input as pipeline intent

Wrong:

```ts
const options = formOptions.strictSchema({
  defaultValues: { date: null as unknown as Date },
  validators: [{ run: z.object({ date: z.date() }), triggers: ['change'] }],
})
```

Correct:

```ts
const options = formOptions.looseSchema({
  defaultValues: { date: null },
  validators: [{ run: z.object({ date: z.date() }), triggers: ['change'] }],
})
```

For form work, Zod often behaves like a ruleset unless the specific schema is intentionally a transform pipeline.

Source: maintainer interview, TanStack/form-v2:examples/react/ui-integration/shadcn/src/app/booking/schema.ts

## References

- [Schema option modes](references/schema-option-modes.md)
- [Standard Schema library leanings](references/standard-schema-library-leanings.md)
