---
name: schema-driven-forms
description: >
  Use when wiring Standard Schema-compatible schemas into TanStack React Form v2
  validators, schemaOutputs, parseIssues, createValidationError, field errors,
  nested issue paths, runOnSubmit behavior, and typed submit output. Load after
  choosing form option mode for schema-driven React forms.
metadata:
  type: framework
  library: '@tanstack/react-form'
  framework: react
  library_version: '2.0.0-alpha.0'
requires:
  - choosing-form-options-modes
sources:
  - TanStack/form:packages/form-core/src/standardSchema.public.ts
  - TanStack/form:packages/form-core/src/standardSchema.lib.ts
  - TanStack/form:packages/form-core/src/FormApi/FormApi.public.ts
  - TanStack/form:packages/form-core/tests/validation.test.ts
  - TanStack/form:packages/form-core/tests/FormApi/submission-handling.spec.ts
---

This skill builds on `choosing-form-options-modes`. Read it first to pick default, strict schema, or loose schema mode.

# TanStack React Form - Schema Driven Forms

Put Standard Schema-compatible schemas in validators. Read parsed schema output from `schemaOutputs`; keep raw `value` as editable form state.

## Setup

```tsx
import { formOptions, useForm } from '@tanstack/react-form'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Email is invalid'),
})

const profileOptions = formOptions.strictSchema({
  defaultValues: {
    name: '',
    email: '',
  },
  validators: [{ run: profileSchema, triggers: ['blur'] }],
  onSubmit: ({ schemaOutputs }) => {
    const parsedProfile = schemaOutputs[0]
    console.log(parsedProfile.email)
  },
})

export function ProfileForm() {
  const form = useForm(profileOptions)

  return (
    <form.Field name="email">
      {(field) => (
        <label>
          <input
            value={field.value}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
          />
          <small>{field.errors.map((error) => error.message).join('\n')}</small>
        </label>
      )}
    </form.Field>
  )
}
```

## Hooks And Components

### Return server validation values from onSubmit

```ts
const form = useForm({
  defaultValues: {
    email: '',
  },
  onSubmit: async ({ value, createValidationError }) => {
    const result = await saveEmail(value.email)

    if (result.kind === 'validation') {
      return createValidationError({
        fields: {
          email: result.message,
        },
      })
    }
  },
})

async function saveEmail(email: string) {
  return email.endsWith('@taken.test')
    ? { kind: 'validation' as const, message: 'Email is already taken' }
    : { kind: 'ok' as const }
}
```

Validation errors are returned values. Throw only transient failures.

### Convert Standard Schema issues from submit

```ts
onSubmit: ({ value, parseIssues }) => {
  const result = profileSchema.safeParse(value)

  if (!result.success) {
    return parseIssues(result.error.issues)
  }
}
```

Use `parseIssues` when an endpoint or local schema check returns Standard Schema-shaped issues.

### Exclude a schema from submit output

```ts
const validateWhileEditing = {
  run: profileSchema,
  triggers: ['change'],
  runOnSubmit: false,
}
```

`runOnSubmit: false` means that validator does not contribute a parsed submit output.

## Common Mistakes

### HIGH Expecting schema output to replace value

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

Schema output is stored separately so form state can remain editable.

Source: TanStack/form:packages/form-core/tests/validation.test.ts

### HIGH Throwing validation errors

Wrong:

```ts
onSubmit: () => {
  throw new Error('Email is already taken')
}
```

Correct:

```ts
onSubmit: ({ createValidationError }) => {
  return createValidationError({
    fields: {
      email: 'Email is already taken',
    },
  })
}
```

Thrown errors are submit failures; validation errors must be returned values.

Source: TanStack/form:packages/form-core/tests/FormApi/submission-handling.spec.ts

### HIGH Returning raw schema errors

Wrong:

```ts
onSubmit: ({ value }) => {
  const result = profileSchema.safeParse(value)
  return result.success ? null : result.error
}
```

Correct:

```ts
onSubmit: ({ value, parseIssues }) => {
  const result = profileSchema.safeParse(value)
  return result.success ? null : parseIssues(result.error.issues)
}
```

`parseIssues` maps Standard Schema issue paths into form and field validation state.

Source: TanStack/form:packages/form-core/src/FormApi/FormApi.public.ts

### MEDIUM Mapping paths by hand

Wrong:

```ts
return createValidationError({
  fields: {
    users: 'Second user email is invalid',
  },
})
```

Correct:

```ts
return parseIssues([
  {
    message: 'Email is invalid',
    path: ['users', 1, 'email'],
  },
])
```

Let Standard Schema issue paths route nested and array errors when possible.

Source: TanStack/form:packages/form-core/src/standardSchema.public.ts

### MEDIUM Inferring UI metadata from Standard Schema

Wrong:

```ts
const required = Boolean(profileSchema.shape.email)
```

Correct:

```ts
const emailLabel = 'Email address'
const emailRequired = true
```

Standard Schema standardizes validation, not UI metadata such as required labels.

Source: maintainer interview

## References

- [Schema validation and submit output](references/schema-validation-and-submit-output.md)
