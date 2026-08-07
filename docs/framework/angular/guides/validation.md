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
ageValidators = [
  {
    triggers: ['change'] as const,
    run: ({ value }: { value: number }) =>
      value >= 13 ? undefined : 'You must be at least 13',
  },
  {
    triggers: ['blur'] as const,
    run: ({ value }: { value: number }) =>
      value >= 0 ? undefined : 'Age cannot be negative',
  },
]
```

```html
<ng-container
  [tanstackField]="form"
  name="age"
  [validators]="ageValidators"
  #field="field"
>
  <label>
    Age
    <input
      type="number"
      [name]="field.api.name"
      [value]="field.api.value"
      (blur)="field.api.handleBlur()"
      (input)="field.api.handleChange($any($event).target.valueAsNumber)"
      [attr.aria-invalid]="field.api.meta.isInvalid"
    />
    @for (error of field.api.errors; track error) {
    <span role="alert">{{ error.message }}</span>
    }
  </label>
</ng-container>
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

Validation and presentation are separate. `errorVisibility` decides when
field issues appear in `field.api.errors`:

```ts
import { injectForm } from '@tanstack/angular-form'

form = injectForm({
  defaultValues: { email: '' },
  errorVisibility: ({ fieldState, state }) =>
    fieldState.meta.isBlurred || state.submissionAttempts > 0,
})
```

Use `field.api.meta.original.errors` for the unfiltered issues when debugging
or building a custom visibility system.

## Form-level validation

A form validator can produce a form issue and route issues to typed field paths
with `createErrorMap`:

```ts
import { injectForm, injectSelector } from '@tanstack/angular-form'

form = injectForm({
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

formErrors = injectSelector(this.form, (state) => state.errors)
```

`injectSelector` exposes form-level issues as an Angular signal. Lower-level
integrations can subscribe to `form.atom` directly. Field-routed issues appear
in the corresponding `field.api.errors`.

## Asynchronous validation and debouncing

`run` may return a promise. Put cheap synchronous checks first and use
`bailIfInvalid` to avoid unnecessary requests:

```ts
usernameValidators = [
  {
    triggers: ['change'] as const,
    run: ({ value }: { value: string }) =>
      value.length >= 3 ? undefined : 'Use at least 3 characters',
  },
  {
    triggers: ['change'] as const,
    triggerDebounceMs: 500,
    bailIfInvalid: true,
    run: async ({ value }: { value: string }) => {
      const available = await checkUsername(value)
      return available ? undefined : 'That username is already taken'
    },
  },
]
```

Pass this array to the field with `[validators]="usernameValidators"`.
Submit validation always runs immediately, even when a trigger is debounced.
`field.api.meta.isValidating` and `form.state.isValidating` expose pending
work.

## Standard Schema validation

Any Standard Schema implementation can be supplied as `run`:

```ts
import { injectForm } from '@tanstack/angular-form'
import { z } from 'zod'

const accountSchema = z.object({
  email: z.string().email(),
  age: z.number().min(13),
})

form = injectForm({
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
`schemaOutputs[0]`. `value` remains the form's raw editable state rather than
the parsed output.

For custom schema routing, call a schema's safe parse API inside `run` and pass
its issues to the provided `parseIssues` helper.

## Validate related fields

Use `watchFields` when one field's validity depends on another:

```ts
import type { FieldValidators } from '@tanstack/angular-form'

type DateFormValues = { startDate: string; endDate: string }

endDateValidators = [
  {
    triggers: ['change', 'blur'],
    watchFields: ['startDate'],
    run: ({ value, formApi }) =>
      value >= formApi.getFieldValue('startDate')
        ? undefined
        : 'End date must be on or after the start date',
  },
] satisfies FieldValidators<DateFormValues, 'endDate', string>
```

```html
<ng-container
  [tanstackField]="form"
  name="endDate"
  [validators]="endDateValidators"
  #field="field"
>
  <input
    type="date"
    [name]="field.api.name"
    [value]="field.api.value"
    (blur)="field.api.handleBlur()"
    (input)="field.api.handleChange($any($event).target.value)"
    [attr.aria-invalid]="field.api.meta.isInvalid"
  />
</ng-container>
```

## Validate a scoped form group

`TanStackFormGroup` creates a v2 group for one concrete section of a form. The
directive exports its API as `formGroup`, and `fieldName` resolves a
group-relative name to the concrete form path:

```ts
import { TanStackField, TanStackFormGroup } from '@tanstack/angular-form'
import type { FormGroupValidators } from '@tanstack/angular-form'

profileValidators = [
  {
    triggers: [],
    run: ({ value }: { value: { name: string } }) =>
      value.name.length >= 2 ? undefined : 'Enter a name',
  },
] satisfies FormGroupValidators<{ name: string }>

submitGroup(event: SubmitEvent, group: { handleSubmit: () => unknown }) {
  event.preventDefault()
  void group.handleSubmit()
}
```

```html
<ng-container
  [tanstackFormGroup]="form"
  name="profile"
  [validators]="profileValidators"
  #profile="formGroup"
>
  <form (submit)="submitGroup($event, profile.api)">
    <ng-container
      [tanstackField]="form"
      [name]="profile.fieldName('name')"
      #name="field"
    >
      <input
        [name]="name.api.name"
        [value]="name.api.value"
        (input)="name.api.handleChange($any($event).target.value)"
      />
    </ng-container>

    @for (error of profile.api.state.errors; track error) {
    <span role="alert">{{ error.message }}</span>
    }
    <button type="submit">Continue</button>
  </form>
</ng-container>
```

Import both directives in the standalone component. Use a Form Group for a
scoped section of one form; use reusable field mappings when a component must
work with different concrete field paths.

## Return errors from submission

Endpoint validation belongs in `onSubmit`. Return
`createValidationError(...)` to feed server issues back into normal form state:

```ts
form = injectForm({
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

`form.handleSubmit()` skips `onSubmit` when validation fails and resolves with
the validation errors. `onSubmitInvalid` is currently available on form
groups; root-form support is planned but not yet implemented. Select
`canSubmit` and `isSubmitting` as Angular signals to reflect that state in the
submit UI:

```ts
canSubmit = injectSelector(this.form, (state) => state.canSubmit)
isSubmitting = injectSelector(this.form, (state) => state.isSubmitting)
```

```html
<button type="submit" [disabled]="!canSubmit() || isSubmitting()">
  {{ isSubmitting() ? 'Submitting…' : 'Submit' }}
</button>
```

If a disabled submit button would hide useful validation feedback, keep it
focusable with `aria-disabled` and let `handleSubmit()` report the issues.
