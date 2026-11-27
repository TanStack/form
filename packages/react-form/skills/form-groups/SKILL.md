---
name: form-groups
description: Use when building multi-step React TanStack Form wizards with
  per-step validation, scoped form-group submission, or final validation across
  unmounted steps.
metadata:
  purpose: Build multi-step React forms with scoped step validation and complete final submission.
  type: framework
  framework: React
  library: '@tanstack/react-form'
  library_version: '2.0.0-alpha.3'
requires: []
sources:
  - TanStack/form:examples/react/multi-step-wizard/src/features/wizard/*
  - TanStack/form:packages/form-core/src/FormGroupApi/FormGroupApi.public.ts
  - TanStack/form:packages/react-form/src/ReactForm/Components.public.ts
  - TanStack/form:packages/react-form/tests/public/submission-handling/group-submission.spec.tsx
  - TanStack/form:packages/react-form/tests/public/group-events/FullPathGroupField.tsx
---

Keep one parent form mounted for the whole wizard. Put each step's values under its own path, then render that step with `form.FormGroup`. This workflow needs no other skill.

## Validate a step before advancing

Use the project's existing schema provider. This example uses Zod, as the repository's wizard does. Keep the complete schema on the parent form so final validation includes unmounted steps.

```tsx
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
})

export function CheckoutWizard() {
  const [step, setStep] = useState<'shipping' | 'billing'>('shipping')
  const [message, setMessage] = useState('')
  const form = useForm({
    defaultValues: {
      shipping: { street: '' },
      billing: { street: '' },
    },
    validators: [
      {
        triggers: [],
        run: z.object({ shipping: addressSchema, billing: addressSchema }),
      },
    ],
    onSubmit: ({ value }) => {
      console.log('Save the complete checkout', value)
      setMessage('Checkout saved')
    },
    onSubmitInvalid: () => {
      setMessage('Check every step and try again')
    },
  })

  return (
    <>
      <form.FormGroup
        key={step}
        name={step}
        validators={[{ triggers: ['blur'], run: addressSchema }]}
        onSubmit={async () => {
          setMessage('')
          if (step === 'shipping') {
            setStep('billing')
          } else {
            await form.handleSubmit()
          }
        }}
      >
        {(group) => (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              group.handleSubmit().catch(console.error)
            }}
          >
            <h2>{step === 'shipping' ? 'Shipping' : 'Billing'}</h2>
            <group.Field name="street">
              {(field) => (
                <>
                  <label>
                    Street
                    <input
                      name={field.name}
                      value={field.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                      aria-invalid={field.meta.isInvalid}
                    />
                  </label>
                  {field.errors.map((error) => (
                    <span key={error.message} role="alert">
                      {error.message}
                    </span>
                  ))}
                </>
              )}
            </group.Field>
            <group.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <>
                  {step === 'billing' && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setStep('shipping')}
                    >
                      Back
                    </button>
                  )}
                  <button type="submit" disabled={isSubmitting}>
                    {step === 'shipping' ? 'Next' : 'Save'}
                  </button>
                </>
              )}
            </group.Subscribe>
          </form>
        )}
      </form.FormGroup>
      <p role="status">{message}</p>
    </>
  )
}
```

The two address steps have the same value shape, so they share one rendered group and schema. Use distinct group components and schemas when steps have different fields. Keep a stable React key per step when switching group names at the same render position.

`group.handleSubmit()` validates the group's fields and group validators. Invalid results prevent its `onSubmit` callback, so navigation belongs in that callback. Group submission leaves unrelated fields and parent validators out of that attempt. `triggers: []` disables interaction validation, but still runs on submission.

The last group's callback awaits `form.handleSubmit()`. Only the parent's `onSubmit` saves the complete form. A successful group submission does not prove the complete form is valid. Do not use the group's `isSubmitSuccessful` to declare the wizard complete.

## Keep paths and lifecycle scoped

For a group named `shipping`, `<group.Field name="street">` edits `shipping.street`. Rendering `<form.Field name="shipping.street">` is also supported. Render only one field consumer for that path.

Group validator values, submission `value`, schema issue paths, and error-map field paths are relative to the group. A group error targets `street`. A parent form error targets `shipping.street`. The `form` entry in a group error map targets the group itself.

Keep groups as siblings. Do not nest form groups or render a field at the group's own path. Unmount the group's rendered subfields with the group. The mounted parent retains values across step navigation, so Back does not require copying or resetting data.

`form.FormGroup` provides an API through its render callback. It does not render an HTML form. Use the callback's HTML `<form>` for Enter-key and submit-button handling, as above. Do not nest HTML forms. Back and other navigation buttons need `type="button"`.

## Cover final validation and errors

Parent form submission does not execute group validators, even for mounted groups. Field validators from unmounted steps are also unavailable. Keep a parent validator that checks the entire value shape. Reuse the step schemas there, then add any rules that compare different steps.

The example reports a failed final submission and provides Back navigation. For a longer wizard, route users to the failing step or provide an error summary. Keep the parent form mounted during that navigation.

Render step status with `group.Subscribe` or `useSelector(group.atom, selector)`. Its state has group-relative `values`, `errors`, `submissionAttempts`, and submission flags. `form.Subscribe` reports parent state. Imperative reads of `group.state` do not subscribe React. Read [subscriptions](../subscriptions/SKILL.md) when choosing a reactive read.

For callback validators or server failures, return the result of `createErrorMap`, `createValidationError`, or `parseIssues` from the group's `onSubmit`. Merely calling a helper does not report its errors. Render group-level messages through `group.Subscribe` selecting `state.errors`, and field messages through `field.errors`.

Validation failures resolve `handleSubmit()` with formatted errors. Exceptions reject unless `onSubmitInvalid` calls `preventThrow()`. Handle the promise at the event boundary. Do not advance only because the promise resolved: reset or cancellation can also return an empty error array. Use the validated `onSubmit` callback for advancing.

Submission `value` is the group's captured input. Parsed or transformed group data comes from its positional `validatorOutputs`. For provider setup or transformed outputs, load `@tanstack/form-core#schema-validation` through Intent. For conditional triggers, async checks, or error visibility, load `@tanstack/form-core#validation`.

For reusable sections mapped into different form shapes, read [field groups](../field-groups/SKILL.md). That feature does not create a submission boundary. Preserve an existing application form hook and registered controls. Read [app forms](../app-forms/SKILL.md) only when configuring those controls.

## Check the wizard

- Submit an empty step and confirm it stays visible with field errors.
- Fill the current step and confirm Next works while later steps remain invalid.
- Edit the next step, go Back, and confirm both steps retain their values.
- Invalidate an earlier step through the public form API after it unmounts. Confirm final submission still blocks saving.
- Submit valid data and confirm the parent callback receives the complete form exactly once.
- Check both group-relative and parent-qualified error paths when adding server errors.

The [wizard example](https://github.com/TanStack/form/tree/main/examples/react/multi-step-wizard/src/features/wizard), [public group API](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi/FormGroupApi.public.ts), and [submission checks](https://github.com/TanStack/form/blob/main/packages/react-form/tests/public/submission-handling/group-submission.spec.tsx) establish these patterns for v2.0.0-alpha.3.
