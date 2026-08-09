---
id: form-validation
title: Form and Field Validation
---

TanStack Form supports synchronous, asynchronous, field-level, form-level, and
Standard Schema validation. Every validator is an ordered object with a `run`
implementation and explicit `triggers`.

## Choose when validation runs

Use `change` for immediate feedback and `blur` for feedback after leaving an
input. Submission runs validators by default regardless of their configured
change and blur triggers.

```svelte
<form.Field
  name="age"
  validators={[
    {
      triggers: ['change'],
      run: ({ value }) =>
        value >= 13 ? undefined : 'You must be at least 13',
    },
    {
      triggers: ['blur'],
      run: ({ value }) =>
        value >= 0 ? undefined : 'Age cannot be negative',
    },
  ]}
>
  {#snippet children(field)}
    <label>
      Age
      <input
        name={field.name}
        type="number"
        value={field.value}
        onblur={field.handleBlur}
        oninput={(event) =>
          field.handleChange(event.currentTarget.valueAsNumber)}
        aria-invalid={field.meta.isInvalid}
      />
      {#each field.errors as error}
        <span role="alert">{error.message}</span>
      {/each}
    </label>
  {/snippet}
</form.Field>
```

Additional controls include:

- `runOnMount`: run once when the form is constructed or when a field or form
  group first mounts.
- `runOnSubmit`: disable or conditionally enable submit-time execution.
- `triggerDebounceMs`: debounce change and blur execution.
- `bailIfInvalid`: skip this and subsequent validators when an earlier one
  failed.
- trigger objects with `when`: enable a trigger conditionally.
- `watchFields`: rerun a field validator when related fields trigger it.

## Control when errors are visible

Validation and presentation are separate. `errorVisibility` decides when field
issues appear in `field.errors`:

```svelte
<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'

  const form = createForm(() => ({
    defaultValues: { email: '' },
    errorVisibility: ({ fieldState, state }) =>
      fieldState.meta.isBlurred || state.submissionAttempts > 0,
  }))
</script>
```

Use `field.meta.original.errors` for the unfiltered issues when debugging or
building a custom visibility system.

## Form-level validation

A form validator can produce a form issue and route issues to typed field paths
with `createErrorMap`:

```svelte
<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'

  const form = createForm(() => ({
    defaultValues: {
      email: '',
      phone: '',
    },
    validators: [
      {
        triggers: ['change'],
        run: ({ value, createErrorMap }) => {
          const errors = createErrorMap()

          if (!value.email && !value.phone) {
            errors.form = 'Provide an email address or phone number'
            errors.fields.email = 'Email is required when phone is empty'
            errors.fields.phone = 'Phone is required when email is empty'
          }

          return errors
        },
      },
    ],
  }))
</script>
```

Use `form.Subscribe` to reactively select form-level issues from
`form.state.errors`. Lower-level integrations can subscribe to `form.atom`.
Field-routed issues appear in the corresponding `field.errors`.

## Asynchronous validation and debouncing

`run` may return a promise. Put cheap synchronous checks first and use
`bailIfInvalid` to avoid unnecessary requests:

```svelte
<form.Field
  name="username"
  validators={[
    {
      triggers: ['change'],
      run: ({ value }) =>
        value.length >= 3 ? undefined : 'Use at least 3 characters',
    },
    {
      triggers: ['change'],
      triggerDebounceMs: 500,
      bailIfInvalid: true,
      run: async ({ value }) => {
        const available = await checkUsername(value)
        return available ? undefined : 'That username is already taken'
      },
    },
  ]}
>
  {#snippet children(field)}
    <input
      name={field.name}
      value={field.value}
      oninput={(event) => field.handleChange(event.currentTarget.value)}
    />
  {/snippet}
</form.Field>
```

Submit validation always runs immediately, even when a trigger is debounced.
`field.meta.isValidating` and `form.state.isValidating` expose pending work.

## Standard Schema validation

Any Standard Schema implementation can be supplied as `run`:

```svelte
<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'
  import { z } from 'zod'

  const accountSchema = z.object({
    email: z.string().email(),
    age: z.number().min(13),
  })

  const form = createForm(() => ({
    defaultValues: { email: '', age: 0 },
    validators: [
      {
        triggers: ['change'],
        run: accountSchema,
      },
    ],
  }))
</script>
```

Schema paths are routed to matching fields. Parsed outputs are available by
validator index in `schemaOutputs` during submit, for example
`schemaOutputs[0]`. `value` remains the form's raw editable state rather than
the parsed output.

For custom schema routing, call a schema's safe parse API inside `run` and pass
its issues to the provided `parseIssues` helper.

## Validate related fields

Use `watchFields` when one field's validity depends on another:

```svelte
<form.Field
  name="endDate"
  validators={[
    {
      triggers: ['change', 'blur'],
      watchFields: ['startDate'],
      run: ({ value, formApi }) =>
        value >= formApi.getFieldValue('startDate')
          ? undefined
          : 'End date must be on or after the start date',
    },
  ]}
>
  {#snippet children(field)}
    <input
      name={field.name}
      type="date"
      value={field.value}
      onblur={field.handleBlur}
      oninput={(event) => field.handleChange(event.currentTarget.value)}
      aria-invalid={field.meta.isInvalid}
    />
  {/snippet}
</form.Field>
```

## Return errors from submission

Endpoint validation belongs in `onSubmit`. Return
`createValidationError(...)` to feed server issues back into normal form state:

```svelte
<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'

  const form = createForm(() => ({
    defaultValues: { email: '' },
    onSubmit: async ({ value, createValidationError }) => {
      const result = await saveProfile(value)

      if (!result.ok) {
        return createValidationError({
          form: 'Could not save the profile',
          fields: { email: 'This email is already registered' },
        })
      }

      return null
    },
  }))
</script>
```

## Prevent invalid submission

`form.handleSubmit()` skips `onSubmit` when validation fails and resolves with
the validation errors. `onSubmitInvalid` is currently available on form groups;
root-form support is planned but not yet implemented. Subscribe to `canSubmit`
and `isSubmitting` to reflect that state in the submit UI:

```svelte
<form.Subscribe
  selector={(state) => [state.canSubmit, state.isSubmitting]}
>
  {#snippet children([canSubmit, isSubmitting])}
    <button type="submit" disabled={!canSubmit || isSubmitting}>
      {isSubmitting ? 'Submitting…' : 'Submit'}
    </button>
  {/snippet}
</form.Subscribe>
```

If a disabled submit button would hide useful validation feedback, keep it
focusable with `aria-disabled` and let `handleSubmit()` report the issues.
