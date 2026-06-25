---
name: reusable-form-policies
description: >
  Use when extracting TanStack React Form v2 behavior into named reusable
  helpers: ReactFormType split-form props, shared formOptions or
  appFormOptions, createErrorVisibility callbacks, createValidator or
  createValidators configs, rewardEarlyPunishLate-style policies, and
  reusable visibility or validation workflow comments.
metadata:
  type: framework
  library: '@tanstack/react-form'
  framework: react
  library_version: '0.0.0'
requires:
  - react-form-composition-setup
  - error-visibility-workflows
sources:
  - TanStack/form-v2:examples/react/basic-splitting-form/src/FormSection.tsx
  - TanStack/form-v2:examples/react/basic-splitting-form/src/sharedForm.ts
  - TanStack/form-v2:packages/react-form/tests/submit-return.test-d.tsx
  - TanStack/form-v2:packages/form-core/src/validation.public.ts
  - TanStack/form-v2:examples/react/ui-integration/shadcn/src/app/booking/shared-form.tsx
---

This skill builds on `react-form-composition-setup` and `error-visibility-workflows`. Read those first for composition and visibility fundamentals.

# TanStack React Form - Reusable Form Policies

Extract helpers only when the behavior deserves a name. The helper should explain intent, not just move code around.

## Setup

```tsx
import {
  createErrorVisibility,
  createValidator,
  formOptions,
  type ReactFormType,
} from '@tanstack/react-form'

export const showAfterBlurOrSubmit = createErrorVisibility(
  ({ fieldState, state }) =>
    fieldState.meta.isBlurred || state.submissionAttempts > 0,
)

export const rewardEarlyPunishLate = createValidator({
  triggers: [
    'blur',
    {
      trigger: 'change',
      when: ({ triggerFieldApi }) =>
        triggerFieldApi !== undefined && triggerFieldApi.meta.isInvalid,
    },
  ],
})

export const sharedProfileOptions = formOptions({
  errorVisibility: showAfterBlurOrSubmit,
  defaultValues: {
    name: '',
    email: '',
  },
})

export type ProfileForm = ReactFormType<typeof sharedProfileOptions>
```

## Hooks And Components

### Type split sections from shared options

```tsx
import type { ReactFormType } from '@tanstack/react-form'
import type { sharedProfileOptions } from './sharedProfileOptions'

type ProfileForm = ReactFormType<typeof sharedProfileOptions>

export function ContactSection({ form }: { form: ProfileForm }) {
  return (
    <form.Field name="email">
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

Use `ReactFormType` for one known form. Use field groups for reusable sections across different forms.

### Name workflow callbacks

```ts
import { createErrorVisibility } from '@tanstack/react-form'

/** Keep the first pass calm, then reveal errors after blur or submit. */
export const waitForBlurOrSubmit = createErrorVisibility(
  ({ fieldState, state }) =>
    fieldState.meta.isBlurred || state.submissionAttempts > 0,
)
```

Named helpers are useful when the name or JSDoc explains user workflow.

### Package validator timing

```ts
import { createValidator } from '@tanstack/react-form'

export const validateAfterBlurThenWhileInvalid = createValidator({
  triggers: [
    'blur',
    {
      trigger: 'change',
      when: ({ triggerFieldApi }) =>
        triggerFieldApi !== undefined && triggerFieldApi.meta.isInvalid,
    },
  ],
  triggerDebounceMs: 250,
})
```

Use helper configs when trigger timing, debounce, `bailIfInvalid`, or `runOnSubmit` is a reusable policy.

## Common Mistakes

### HIGH Hand-writing split form prop types

Wrong:

```ts
interface ContactSectionProps {
  form: {
    Field: unknown
    handleSubmit: () => void
  }
}
```

Correct:

```ts
import type { ReactFormType } from '@tanstack/react-form'
import type { sharedProfileOptions } from './sharedProfileOptions'

interface ContactSectionProps {
  form: ReactFormType<typeof sharedProfileOptions>
}
```

Hand-written form shapes drop field-name inference and usually miss submit variance.

Source: TanStack/form-v2:examples/react/basic-splitting-form/src/FormSection.tsx

### HIGH Reusing sections through form unions

Wrong:

```ts
interface SharedProps {
  form: ReactFormType<typeof formAOptions> | ReactFormType<typeof formBOptions>
}
```

Correct:

```tsx
const { defineFields, helper, withFields } = getFieldGroupHelpers()

const sharedFields = defineFields({
  value: helper.strict<string>(),
})

function SharedImpl({ fields }: { fields: typeof sharedFields }) {
  return (
    <fields.Field name="value">
      {(field) => <input value={field.value} />}
    </fields.Field>
  )
}

export const SharedField = withFields(sharedFields, SharedImpl, 'fields')
```

Different form APIs do not form a useful union for field names and methods.

Source: maintainer interview

### HIGH Scattering showErrors expressions

Wrong:

```tsx
const showErrors = field.meta.isTouched && field.meta.isInvalid

return showErrors ? <small>{field.errors[0]?.message}</small> : null
```

Correct:

```ts
export const showAfterBlurOrSubmit = createErrorVisibility(
  ({ fieldState, state }) =>
    fieldState.meta.isBlurred || state.submissionAttempts > 0,
)
```

Form-level visibility makes the default workflow explicit and reusable.

Source: TanStack/form-v2:packages/form-core/src/validation.public.ts

### MEDIUM Reading concrete values in reusable visibility

Wrong:

```ts
const policy = createErrorVisibility(({ state }) => state.values.email !== '')
```

Correct:

```ts
const policy = createErrorVisibility(
  ({ fieldState, state }) =>
    fieldState.meta.isBlurred || state.submissionAttempts > 0,
)
```

Reusable visibility receives `values: unknown`; use an inline `errorVisibility` when the policy needs typed form values.

Source: TanStack/form-v2:packages/form-core/src/validation.public.ts

### MEDIUM Copying validator config without intent

Wrong:

```ts
validators: [
  { run: emailSchema, triggers: ['blur', 'change'], triggerDebounceMs: 300 },
]
```

Correct:

```ts
const validateAfterBlurThenWhileInvalid = createValidator({
  triggers: [
    'blur',
    {
      trigger: 'change',
      when: ({ triggerFieldApi }) =>
        triggerFieldApi !== undefined && triggerFieldApi.meta.isInvalid,
    },
  ],
  triggerDebounceMs: 300,
})
```

A semantic helper preserves why the timing exists when examples evolve.

Source: TanStack/form-v2:examples/react/ui-integration/shadcn/src/app/booking/shared-form.tsx

## References

- [Reusable policy boundaries](references/reusable-policy-boundaries.md)
