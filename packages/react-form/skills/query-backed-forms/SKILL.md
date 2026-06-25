---
name: query-backed-forms
description: >
  Use when combining TanStack React Form v2 with query-like async defaults,
  maybe-undefined incoming data, gated form or field mounting, emptyFormValues
  fallbacks, async onSubmit mutation calls, createValidationError, parseIssues,
  isSubmitting, isSubmitSuccessful, transient errors, and validation errors.
metadata:
  type: composition
  library: '@tanstack/react-form'
  library_version: '0.0.0'
requires:
  - react-form-composition-setup
sources:
  - TanStack/form-v2:packages/react-form/tests/useForm.spec.tsx
  - TanStack/form-v2:packages/form-core/src/FormApi/FormApi.lib.ts
  - TanStack/form-v2:packages/form-core/src/FormApi/FormApi.public.ts
  - TanStack/form-v2:packages/form-core/src/FormApi/handleSubmit.lib.ts
  - TanStack/form-v2:packages/form-core/tests/FormApi/submission-handling.spec.ts
---

This skill builds on `react-form-composition-setup`. Read it first for React form wiring and subscriptions.

# TanStack React Form - Query Backed Forms

Always choose a default-values plan. Do not pass maybe-undefined query data alone into `defaultValues`.

## Setup

```tsx
import { useForm } from '@tanstack/react-form'

type ProfileValues = {
  name: string
  email: string
}

const emptyProfileValues: ProfileValues = {
  name: '',
  email: '',
}

async function saveProfile(value: ProfileValues) {
  if (value.email.endsWith('@taken.test')) {
    return {
      kind: 'validation' as const,
      fields: {
        email: 'Email is already taken',
      },
    }
  }

  return { kind: 'ok' as const }
}

export function ProfileForm({ profile }: { profile?: ProfileValues }) {
  const form = useForm({
    defaultValues: profile ?? emptyProfileValues,
    onSubmit: async ({ value, createValidationError }) => {
      const result = await saveProfile(value)

      if (result.kind === 'validation') {
        return createValidationError({
          fields: result.fields,
        })
      }
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.Field name="email">
        {(field) => (
          <input
            value={field.value}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => <button disabled={isSubmitting}>Save</button>}
      </form.Subscribe>
    </form>
  )
}
```

## Core Integration Patterns

### Gate fields until data is ready

```tsx
export function GatedProfileForm({
  profile,
  isLoading,
}: {
  profile?: ProfileValues
  isLoading: boolean
}) {
  if (isLoading || profile === undefined) {
    return <p>Loading profile</p>
  }

  return <ProfileForm profile={profile} />
}
```

Gating means mounted fields start with the loaded data, but the visual loading language is different.

### Render immediately with an empty fallback

```tsx
const form = useForm({
  defaultValues: profile ?? emptyProfileValues,
  onSubmit: async ({ value }) => {
    await saveProfile(value)
  },
})
```

The fallback object must be static and shape-complete.

### Let transient failures stay transient

```ts
onSubmit: async ({ value, createValidationError }) => {
  const result = await saveProfile(value)

  if (result.kind === 'validation') {
    return createValidationError({ fields: result.fields })
  }
}
```

Only catch or convert validation-shaped responses. Retryable network failures can reject so the query or framework layer keeps the transient error.

## Common Mistakes

### HIGH Passing maybe-undefined data as defaults

Wrong:

```tsx
const form = useForm({
  defaultValues: profile,
})
```

Correct:

```tsx
const form = useForm({
  defaultValues: profile ?? emptyProfileValues,
})
```

Initial query data is often undefined; the form needs either gated mounting or a shape-complete fallback.

Source: maintainer interview

### HIGH Starting async submit without returning it

Wrong:

```ts
onSubmit: ({ value }) => {
  saveProfile(value)
}
```

Correct:

```ts
onSubmit: async ({ value }) => {
  await saveProfile(value)
}
```

Return or await the endpoint promise so `isSubmitting` covers the request.

Source: TanStack/form-v2:packages/form-core/tests/FormApi/submission-handling.spec.ts

### HIGH Storing transient failures as validation

Wrong:

```ts
onSubmit: async ({ createValidationError }) => {
  return createValidationError('The server is offline')
}
```

Correct:

```ts
onSubmit: async ({ value }) => {
  await saveProfile(value)
}
```

Validation errors block submission. Keep transient query, network, and framework failures in the query/framework layer.

Source: maintainer interview

### HIGH Throwing validation errors

Wrong:

```ts
onSubmit: async () => {
  throw new Error('Email is already taken')
}
```

Correct:

```ts
onSubmit: async ({ createValidationError }) => {
  return createValidationError({
    fields: {
      email: 'Email is already taken',
    },
  })
}
```

Validation failures are returned values; thrown or rejected errors are submit failures.

Source: TanStack/form-v2:packages/form-core/src/FormApi/FormApi.public.ts

### MEDIUM Ignoring the loading UI tradeoff

Wrong:

```tsx
return <ProfileForm profile={profile} />
```

Correct:

```tsx
if (profile === undefined) {
  return <p>Loading profile</p>
}

return <ProfileForm profile={profile} />
```

If you gate mounting, the UI must represent that fields do not exist until data is ready.

Source: maintainer interview

## References

- [Query-backed defaults and submit](references/query-backed-defaults-and-submit.md)
