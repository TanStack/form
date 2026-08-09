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

```ts
this.form.field(
  {
    name: 'age',
    validators: [
      {
        triggers: ['change'],
        run: ({ value }) =>
          value >= 13 ? undefined : 'You must be at least 13',
      },
      {
        triggers: ['blur'],
        run: ({ value }) => (value >= 0 ? undefined : 'Age cannot be negative'),
      },
    ],
  },
  (field) => html`
    <label>
      Age
      <input
        name=${field.name}
        type="number"
        .value=${String(field.value)}
        @blur=${() => field.handleBlur()}
        @input=${(event: InputEvent) =>
          field.handleChange(
            (event.currentTarget as HTMLInputElement).valueAsNumber,
          )}
        aria-invalid=${field.meta.isInvalid ? 'true' : 'false'}
      />
      ${field.errors.map(
        (error) => html`<span role="alert">${error.message}</span>`,
      )}
    </label>
  `,
)
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

```ts
private form = new TanStackFormController(this, {
  defaultValues: { email: '' },
  errorVisibility: ({ fieldState, state }) =>
    fieldState.meta.isBlurred || state.submissionAttempts > 0,
})
```

Use `field.meta.original.errors` for unfiltered issues when debugging or
building a custom visibility system.

## Form-level validation

A form validator can produce a form issue and route issues to typed field paths
with `createErrorMap`:

```ts
private form = new TanStackFormController(this, {
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
})
```

Use `form.subscribe(...)` to reactively select form-level issues from
`form.api.state.errors`. Lower-level integrations can subscribe to
`form.api.atom`.
Field-routed issues appear in the corresponding `field.errors`.

```ts
this.form.subscribe(
  (state) => state.errors,
  (errors) => html`
    ${errors.map((error) => html`<p role="alert">${error.message}</p>`)}
  `,
)
```

## Asynchronous validation and debouncing

`run` may return a promise. Put cheap synchronous checks first and use
`bailIfInvalid` to avoid unnecessary requests:

```ts
validators: [
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
]
```

Submit validation always runs immediately, even when a trigger is debounced.
`field.meta.isValidating` and `form.api.state.isValidating` expose pending work.
Render form-wide pending state through `form.subscribe(...)` so it stays
reactive.

## Standard Schema validation

Any Standard Schema implementation can be supplied as `run`:

```ts
import { z } from 'zod'

const accountSchema = z.object({
  email: z.string().email(),
  age: z.number().min(13),
})

private form = new TanStackFormController(this, {
  defaultValues: { email: '', age: 0 },
  validators: [
    {
      triggers: ['change'],
      run: accountSchema,
    },
  ],
})
```

Schema paths are routed to matching fields. Parsed outputs are available by
validator index in `schemaOutputs` during submit, for example
`schemaOutputs[0]`. `value` remains the raw editable state rather than the
parsed output.

For custom schema routing, call a schema's safe-parse API inside `run` and pass
its issues to the provided `parseIssues` helper.

## Validate related fields

Use `watchFields` when one field's validity depends on another:

```ts
this.form.field(
  {
    name: 'endDate',
    validators: [
      {
        triggers: ['change', 'blur'],
        watchFields: ['startDate'],
        run: ({ value, formApi }) =>
          value >= formApi.getFieldValue('startDate')
            ? undefined
            : 'End date must be on or after the start date',
      },
    ],
  },
  (field) => html`
    <input
      name=${field.name}
      type="date"
      .value=${field.value}
      @blur=${() => field.handleBlur()}
      @input=${(event: InputEvent) =>
        field.handleChange((event.currentTarget as HTMLInputElement).value)}
      aria-invalid=${field.meta.isInvalid ? 'true' : 'false'}
    />
  `,
)
```

## Return errors from submission

Endpoint validation belongs in `onSubmit`. Return
`createValidationError(...)` to feed server issues back into normal form state:

```ts
private form = new TanStackFormController(this, {
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
})
```

## Prevent invalid submission

`form.api.handleSubmit()` skips `onSubmit` when validation fails and resolves
with the validation errors. `onSubmitInvalid` is currently available on form
groups; root-form support is planned but not yet implemented. Subscribe to
`canSubmit` and `isSubmitting` to reflect that state in the submit UI:

```ts
this.form.subscribe(
  (state) => [state.canSubmit, state.isSubmitting] as const,
  ([canSubmit, isSubmitting]) => html`
    <button type="submit" ?disabled=${!canSubmit || isSubmitting}>
      ${isSubmitting ? 'Submitting…' : 'Submit'}
    </button>
  `,
)
```

If a disabled submit button would hide useful validation feedback, keep it
focusable with `aria-disabled` and let `handleSubmit()` report the issues.
