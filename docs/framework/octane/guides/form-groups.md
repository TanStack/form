---
id: form-groups
title: Form Groups
---

When building a multi-stage form, each step often needs its own validation and submission behavior:

![Form stepper](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/stepper.png)

Creating a separate form instance for each step makes it harder to validate and submit all the values together. TanStack Form's `form.FormGroup` lets each step validate a portion of one shared form.

## Usage

Create a form with `useForm` or [`useAppForm`](./form-composition.md), then use its `FormGroup` component to select a nested value:

```tsrx
import { useForm } from '@tanstack/octane-form'

function App() @{
  const form = useForm({
    defaultValues: {
      step1: { name: '' },
      step2: { age: 0 },
    },
  })

  <form.FormGroup
    name="step1"
    children={(group) => <pre>{JSON.stringify(group.state.value)}</pre>}
  />
}
```

The `group` exposes form-like methods, such as `deleteField`, `insertFieldValue`, and `handleSubmit`. `group.handleSubmit()` validates and submits that group without submitting the parent form.

Pair a form group with Octane's `useState` and TSRX's `@if` to build a wizard. Field paths on the parent form still include the group name:

```tsrx
// src/Wizard.tsrx
import { useState } from 'octane'
import { useForm } from '@tanstack/octane-form'

export function Wizard() @{
  const [step, setStep] = useState(0)
  const form = useForm({
    defaultValues: {
      step1: { name: '' },
      step2: { age: 0 },
    },
    onSubmit: ({ value }) => {
      console.log(value)
    },
  })

  <div>
    @if (step === 0) {
      <form.FormGroup
        name="step1"
        validators={{
          onSubmit: ({ value }) => value.name.trim()
            ? undefined
            : 'Please enter your name',
        }}
        onGroupSubmit={() => setStep(1)}
        onGroupSubmitInvalid={() => {}}
        children={(group) => <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void group.handleSubmit()
          }}
        >
          <form.Field
            name="step1.name"
            children={(field) => <label>
              <span>Name</span>
              <input
                value={field.state.value}
                onInput={(event) => field.handleChange(
                  event.currentTarget.value,
                )}
                onBlur={field.handleBlur}
              />
            </label>}
          />
          <p role="alert">{group.state.meta.errors.join(', ')}</p>
          <button type="submit" disabled={group.state.meta.isSubmitting}>
            Next
          </button>
        </form>}
      />
    } @else {
      <form.FormGroup
        name="step2"
        children={(group) => <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()

            void form.handleSubmit()
          }}
        >
          <form.Field
            name="step2.age"
            children={(field) => <label>
              <span>Age</span>
              <input
                type="number"
                value={field.state.value}
                onInput={(event) => field.handleChange(
                  event.currentTarget.valueAsNumber,
                )}
                onBlur={field.handleBlur}
              />
            </label>}
          />
          <pre>{JSON.stringify(group.state.value)}</pre>
          <button type="button" onClick={() => setStep(0)}>Back</button>
          <button type="submit">Submit</button>
        </form>}
      />
    }
  </div>
}
```

You can also set `onSubmitMeta` on a group and pass the matching metadata to `group.handleSubmit(meta)`, independently of the parent's submit metadata.

## Form Group Validation

Groups can have their own validators. Read group errors from `group.state.meta.errorMap` and `group.state.meta.errors`:

```tsrx
<form.FormGroup
  name="step1"
  validators={{ onChange: () => 'Group error' }}
  children={(group) => <pre>{JSON.stringify(group.state.meta.errorMap)}</pre>}
/>
```

Group validators can also set errors on individual fields. Error keys are relative to the group's value, so use `name` for `step1.name`:

```tsrx
<form.FormGroup
  name="step1"
  validators={{
    onChange: ({ value }) => ({
      group: value.name === 'error' ? 'Group error' : undefined,
      fields: {
        name: value.name === 'error' ? 'Field error' : undefined,
      },
    }),
  }}
  children={(group) => <pre>{JSON.stringify(group.state.meta.errors)}</pre>}
/>
```

Standard Schema validators work with groups too:

```tsrx
<form.FormGroup
  name="step1"
  validators={{
    onChange: z.object({
      name: z.string().min(2),
    }),
  }}
  children={(group) => <pre>{JSON.stringify(group.state.meta.errors)}</pre>}
/>
```

Relative field paths let you reuse a group's schema inside the parent's schema:

```ts
import { z } from 'zod'

const step1Schema = z.object({ name: z.string().min(2) })
const step2Schema = z.object({ age: z.number().min(18) })
const schema = z.object({
  step1: step1Schema,
  step2: step2Schema,
})
```

Pass `step1Schema` to its group and `schema` to the parent form. Whole-form validation then checks all stages even if a step was bypassed.

### Dynamic Group Validation

With [dynamic validation](./dynamic-validation.md), configure `revalidateLogic()` on the parent and give each group its own `onDynamic` validator:

```tsrx
const form = useForm({
  defaultValues: {
    step1: { name: '' },
    step2: { age: 0 },
  },
  validationLogic: revalidateLogic(),
  validators: {
    // This follows the parent form's submission attempts.
    onDynamic: schema,
  },
})

<form.FormGroup
  name="step1"
  validators={{ onDynamic: step1Schema }}
  children={(group) => <button
    type="button"
    onClick={() => {
      void group.handleSubmit()
    }}
  >Next</button>}
/>
```

Submitting a group does not increment the parent form's submission attempts. The group's dynamic validation instead uses `group.state.meta.submissionAttempts` to decide when to change its validation mode.

## Form Group State

Read the group's current value with `group.state.value`. Its metadata includes:

- `group.state.meta.isFieldsValid`: whether field-level validators have no errors
- `group.state.meta.isGroupValid`: whether group-level validators have no errors
- `group.state.meta.isValid`: whether both field-level and group-level validators have no errors
- `group.state.meta.isSubmitting`: whether a group submission is in progress

Within `FormGroup`'s render callback, these values update when the group's state changes.
