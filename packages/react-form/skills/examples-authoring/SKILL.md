---
name: examples-authoring
description: >
  Use when scaffolding realistic TanStack React Form v2 examples for maintainers
  and future reference docs. Covers adapter-first examples, schema-driven forms,
  query-backed forms, error visibility workflows, AppForm UI integrations, field
  groups, arrays, ArrayField, reorder behavior, form.Subscribe, and avoiding
  barren core-test examples.
metadata:
  type: lifecycle
  library: "@tanstack/react-form"
  library_version: "0.0.0"
requires:
  - react-form-composition-setup
sources:
  - TanStack/form-v2:examples/react/basic/src/index.tsx
  - TanStack/form-v2:examples/react/array/src/index.tsx
  - TanStack/form-v2:examples/react/basic-splitting-form/src/index.tsx
  - TanStack/form-v2:examples/react/field-groups/src/index.tsx
  - TanStack/form-v2:examples/react/ui-integration/shadcn/src/app/booking/booking-form.tsx
  - TanStack/form-v2:examples/react/ui-integration/dnd-kit/src/twoLists/index.tsx
---

This skill builds on `react-form-composition-setup`. Read it first for adapter-first form structure.

# TanStack React Form - Examples Authoring

Write examples as user journeys, not as thin core behavior tests. Future users consume them as references.

## Setup

```tsx
import { useForm } from '@tanstack/react-form'

type SignupValues = {
  name: string
  email: string
}

const emptySignupValues: SignupValues = {
  name: '',
  email: '',
}

export function SignupExample({ initialValues }: { initialValues?: SignupValues }) {
  const form = useForm({
    defaultValues: initialValues ?? emptySignupValues,
    onSubmit: async ({ value }) => {
      await Promise.resolve(value)
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
        {(isSubmitting) => <button disabled={isSubmitting}>Create account</button>}
      </form.Subscribe>
    </form>
  )
}
```

## Core Patterns

### Combine features when the workflow combines them

```tsx
const form = useForm({
  defaultValues: profile ?? emptyProfileValues,
  errorVisibility: ({ fieldState, state }) =>
    fieldState.meta.isBlurred || state.submissionAttempts > 0,
  onSubmit: async ({ value }) => {
    await saveProfile(value)
  },
})
```

Schema mode, async defaults, submit validation, and visibility can belong in one example when that is the real task.

### Use ArrayField at list boundaries

```tsx
<form.ArrayField name="items">
  {(array) =>
    array.value.map((item, index) => (
      <form.Field key={item.id} name={`items[${index}].label`}>
        {(field) => <input value={field.value} />}
      </form.Field>
    ))
  }
</form.ArrayField>
```

Use `Field` for item values and `ArrayField` for the list boundary.

### Subscribe buttons and summaries

```tsx
<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
  {([canSubmit, isSubmitting]) => (
    <button disabled={!canSubmit || isSubmitting}>
      {isSubmitting ? 'Saving' : 'Save'}
    </button>
  )}
</form.Subscribe>
```

Do not read submit state from the stable hook return without a subscription.

## Common Mistakes

### HIGH Writing core-test examples

Wrong:

```tsx
const form = useForm({
  defaultValues: { value: '' },
})

return <form.Field name="value">{() => null}</form.Field>
```

Correct:

```tsx
const form = useForm({
  defaultValues: profile ?? emptyProfileValues,
  onSubmit: async ({ value }) => {
    await saveProfile(value)
  },
})
```

Examples should show how a user composes a real form, not just that an API exists.

Source: maintainer interview

### HIGH Reading stable form state directly

Wrong:

```tsx
const disabled = !form.state.canSubmit || form.state.isSubmitting

return <button disabled={disabled}>Save</button>
```

Correct:

```tsx
return (
  <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
    {([canSubmit, isSubmitting]) => (
      <button disabled={!canSubmit || isSubmitting}>Save</button>
    )}
  </form.Subscribe>
)
```

Example UI that changes with form state must use `form.Subscribe` or `useSelector`.

Source: TanStack/form-v2:examples/react/basic/src/index.tsx

### HIGH Letting native reset fight form reset

Wrong:

```tsx
<button type="reset">Reset</button>
```

Correct:

```tsx
<button
  type="reset"
  onClick={(event) => {
    event.preventDefault()
    form.reset()
  }}
>
  Reset
</button>
```

Prevent browser-native reset behavior when the example is teaching form reset semantics.

Source: TanStack/form-v2:examples/react/basic/src/index.tsx

### MEDIUM Modeling multi-list DnD as one indexed array

Wrong:

```ts
type BoardValues = {
  items: Array<{ id: string; list: 'todo' | 'done'; label: string }>
}
```

Correct:

```ts
type BoardValues = {
  itemsById: Record<string, { id: string; label: string }>
  todoOrder: Array<string>
  doneOrder: Array<string>
}
```

Cross-list movement needs stable item IDs and separate order arrays.

Source: TanStack/form-v2:examples/react/ui-integration/dnd-kit/src/twoLists/index.tsx

## References

- [Example scenarios](references/example-scenarios.md)
