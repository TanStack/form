---
name: error-visibility-workflows
description: >
  Use when implementing TanStack React Form v2 errorVisibility callbacks,
  createErrorVisibility helpers, show-after-blur, show-after-submit,
  show-after-blur-or-submit, fieldState.meta visibility, state.submissionAttempts,
  form group scoped submission attempts, and reusable validator trigger policies.
metadata:
  type: framework
  library: '@tanstack/react-form'
  framework: react
  library_version: '0.0.0'
requires: []
sources:
  - TanStack/form-v2:packages/form-core/src/validation.public.ts
  - TanStack/form-v2:packages/form-core/src/FieldApi/fieldState.lib.ts
  - TanStack/form-v2:packages/form-core/tests/validation.test-d.ts
  - TanStack/form-v2:packages/form-core/tests/FormGroupApi/FormGroupApi.spec.ts
  - TanStack/form-v2:examples/react/ui-integration/shadcn/src/app/booking/shared-form.tsx
---

# TanStack React Form - Error Visibility Workflows

Use `errorVisibility` to define when validation errors become visible. It is a callback, not a string preset.

## Setup

```tsx
import { createErrorVisibility, useForm } from '@tanstack/react-form'

const showAfterBlurOrSubmit = createErrorVisibility(
  ({ fieldState, state }) =>
    fieldState.meta.isBlurred || state.submissionAttempts > 0,
)

export function LoginForm() {
  const form = useForm({
    defaultValues: {
      email: '',
    },
    errorVisibility: showAfterBlurOrSubmit,
  })

  return (
    <form.Field
      name="email"
      validators={[
        {
          run: ({ value }) =>
            value.length === 0 ? 'Email is required' : undefined,
          triggers: ['change', 'blur'],
        },
      ]}
    >
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

### Show after blur or submit

```ts
const showAfterBlurOrSubmit = createErrorVisibility(
  ({ fieldState, state }) =>
    fieldState.meta.isBlurred || state.submissionAttempts > 0,
)
```

Use this for workflows that avoid showing errors before the user interacts or submits.

### Keep form-specific logic inline

```ts
const form = useForm({
  defaultValues: {
    mode: 'business',
    companyName: '',
  },
  errorVisibility: ({ state, fieldState }) =>
    state.values.mode === 'business' && fieldState.meta.isBlurred,
})
```

Inline callbacks can use the consuming form's typed `values`.

### Use trigger policies with visibility policies

```ts
import { createValidator } from '@tanstack/react-form'

const rewardEarlyPunishLate = createValidator({
  triggers: [
    'blur',
    {
      trigger: 'change',
      when: ({ triggerFieldApi }) =>
        triggerFieldApi !== undefined && triggerFieldApi.meta.isInvalid,
    },
  ],
})
```

Visibility controls display. Validator config controls when validation runs.

## Common Mistakes

### HIGH Writing string visibility presets

Wrong:

```ts
const form = useForm({
  defaultValues: { email: '' },
  errorVisibility: 'touched',
})
```

Correct:

```ts
const form = useForm({
  defaultValues: { email: '' },
  errorVisibility: ({ fieldState }) => fieldState.meta.isTouched,
})
```

`errorVisibility` is callback-based.

Source: TanStack/form-v2:packages/form-core/src/validation.public.ts

### HIGH Checking visible errors inside visibility

Wrong:

```ts
errorVisibility: ({ fieldState }) => fieldState.meta.errors.length > 0
```

Correct:

```ts
errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred
```

Visibility receives pre-filter meta; visible errors are the result of the callback.

Source: TanStack/form-v2:packages/form-core/src/FieldApi/fieldState.lib.ts

### HIGH Repeating local showErrors conditions

Wrong:

```tsx
const showErrors = field.meta.isTouched && field.meta.isInvalid

return showErrors ? <small>{field.errors[0]?.message}</small> : null
```

Correct:

```ts
const form = useForm({
  defaultValues: { email: '' },
  errorVisibility: ({ fieldState }) => fieldState.meta.isTouched,
})
```

Use form-level policy when the same display workflow applies across fields.

Source: maintainer interview

### MEDIUM Reusable policy expects typed values

Wrong:

```ts
const showBusinessErrors = createErrorVisibility(
  ({ state }) => state.values.mode === 'business',
)
```

Correct:

```ts
const form = useForm({
  defaultValues: { mode: 'business', companyName: '' },
  errorVisibility: ({ state }) => state.values.mode === 'business',
})
```

Reusable visibility policies are form-agnostic and receive `values: unknown`.

Source: TanStack/form-v2:packages/form-core/src/validation.public.ts

### MEDIUM Ignoring group-scoped submissions

Wrong:

```ts
errorVisibility: ({ state }) => state.submissionAttempts > 0
```

Correct:

```ts
errorVisibility: ({ state, fieldState }) =>
  fieldState.meta.isBlurred || state.submissionAttempts > 0
```

Inside a registered form group, scalar state reads are scoped to the nearest group.

Source: TanStack/form-v2:packages/form-core/src/validation.public.ts

## References

- [Error visibility policies](references/error-visibility-policies.md)
