---
name: react-form-composition-setup
description: >
  Use when building TanStack React Form v2 forms with useForm, form.Field,
  form.ArrayField, form.Subscribe, AppForm/createFormHook, ReactFormType,
  FieldWithValue, AnyFieldApi, field groups, array helpers, or reusable UI
  components. Load for adapter-first composition, reactive reads, split forms,
  array rendering, and field-name inference questions.
metadata:
  type: framework
  library: "@tanstack/react-form"
  framework: react
  library_version: "0.0.0"
requires: []
sources:
  - TanStack/form-v2:packages/react-form/src/ReactForm/Components.public.ts
  - TanStack/form-v2:packages/react-form/src/ReactForm/fieldSubscriptions.lib.ts
  - TanStack/form-v2:packages/react-form/src/AppForm/createFormHook.public.ts
  - TanStack/form-v2:packages/react-form/src/FieldGroup/withFields.public.ts
  - TanStack/form-v2:examples/react/array/src/index.tsx
---

# TanStack React Form - Composition Setup

Start from `@tanstack/react-form`. Treat `@tanstack/form-core` as the behavior source, not the application entrypoint.

## Setup

```tsx
import { useForm } from '@tanstack/react-form'

export function PersonForm() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      tags: [''],
    },
    onSubmit: ({ value }) => {
      console.log(value)
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
      <form.Field name="firstName">
        {(field) => (
          <input
            name={field.name}
            value={field.value}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Saving' : 'Save'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
```

## Hooks And Components

### Read form state reactively

```tsx
<form.Subscribe selector={(state) => state.values.firstName}>
  {(firstName) => <output>{firstName}</output>}
</form.Subscribe>
```

`useForm` and `useAppForm` return stable form APIs. Use `form.Subscribe` or `useSelector` for UI that must update with state.

### Split one known form with ReactFormType

```tsx
import { formOptions, type ReactFormType } from '@tanstack/react-form'

export const sharedPersonOptions = formOptions({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
})

type PersonFormApi = ReactFormType<typeof sharedPersonOptions>

export function NameSection({ form }: { form: PersonFormApi }) {
  return (
    <form.Field name="firstName">
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

Use this when a child section belongs to one known form. Use field groups when the same section must bind into multiple different forms or paths.

### Render arrays with ArrayField when child fields matter

```tsx
<form.ArrayField name="tags">
  {(array) => (
    <ul>
      {array.value.map((_, index) => (
        <form.Field key={index} name={`tags[${index}]`}>
          {(field) => (
            <input
              value={field.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          )}
        </form.Field>
      ))}
    </ul>
  )}
</form.ArrayField>
```

`form.Field` can bind an array value, but it treats the array as one immutable value. Use `form.ArrayField` when the list renders child fields.

### Reuse sections across forms with field groups

```tsx
import { getFieldGroupHelpers } from '@tanstack/react-form'

const { defineFields, helper, withFields } = getFieldGroupHelpers()

const dateRangeFields = defineFields({
  start: helper.strict<string>(),
  end: helper.strict<string>(),
})

function DateRangeImpl({ fields }: { fields: typeof dateRangeFields }) {
  return (
    <>
      <fields.Field name="start">{(field) => <input value={field.value} />}</fields.Field>
      <fields.Field name="end">{(field) => <input value={field.value} />}</fields.Field>
    </>
  )
}

export const DateRange = withFields(dateRangeFields, DateRangeImpl, 'fields')
```

Inside a field group, use virtual names such as `start`; callers bind those names to real paths.

## Common Mistakes

### HIGH Expecting useForm to be reactive

Wrong:

```tsx
const form = useForm({ defaultValues: { name: '' } })
const canSubmit = form.state.canSubmit

return <button disabled={!canSubmit}>Save</button>
```

Correct:

```tsx
const form = useForm({ defaultValues: { name: '' } })

return (
  <form.Subscribe selector={(state) => state.canSubmit}>
    {(canSubmit) => <button disabled={!canSubmit}>Save</button>}
  </form.Subscribe>
)
```

The hook result is stable; selectors and subscriptions are the reactive boundary.

Source: TanStack/form-v2:packages/react-form/src/ReactForm/ReactFormApi.lib.tsx

### HIGH Asserting field names or children

Wrong:

```tsx
<form.Field name={`users[${index}].name` as const}>
  {(field: any) => <input value={field.value} />}
</form.Field>
```

Correct:

```tsx
<form.Field name={`users[${index}].name`}>
  {(field) => <input value={field.value} />}
</form.Field>
```

Field names and render-prop children are inferred; assertions usually hide the wrong boundary.

Source: maintainer interview, TanStack/form-v2:packages/react-form/src/ReactForm/Components.public.ts

### HIGH Treating ArrayField as every array value

Wrong:

```tsx
<form.ArrayField name="selectedIds">
  {(field) => <pre>{JSON.stringify(field.value)}</pre>}
</form.ArrayField>
```

Correct:

```tsx
<form.Field name="selectedIds">
  {(field) => <pre>{JSON.stringify(field.value)}</pre>}
</form.Field>
```

Use `ArrayField` when rendering child fields from an array; a whole array value can be a normal `Field`.

Source: TanStack/form-v2:packages/react-form/src/ReactForm/fieldSubscriptions.lib.ts

### HIGH Rendering list fields through Field

Wrong:

```tsx
<form.Field name="items">
  {(field) =>
    field.value.map((_, index) => (
      <form.Field key={index} name={`items[${index}]`}>
        {(itemField) => <input value={itemField.value} />}
      </form.Field>
    ))
  }
</form.Field>
```

Correct:

```tsx
<form.ArrayField name="items">
  {(array) =>
    array.value.map((_, index) => (
      <form.Field key={index} name={`items[${index}]`}>
        {(itemField) => <input value={itemField.value} />}
      </form.Field>
    ))
  }
</form.ArrayField>
```

The `Field` subscriber follows the whole array `value`; `ArrayField` follows array length and array version for list rendering.

Source: TanStack/form-v2:examples/react/array/src/index.tsx

### HIGH Unioning ReactFormType forms

Wrong:

```ts
type FormA = ReactFormType<typeof formAOptions>
type FormB = ReactFormType<typeof formBOptions>

interface SharedSectionProps {
  form: FormA | FormB
}
```

Correct:

```tsx
const { defineFields, helper, withFields } = getFieldGroupHelpers()

const sharedFields = defineFields({
  value: helper.strict<string>(),
})

function SharedSection({ fields }: { fields: typeof sharedFields }) {
  return <fields.Field name="value">{(field) => <input value={field.value} />}</fields.Field>
}

export const BoundSharedSection = withFields(sharedFields, SharedSection, 'fields')
```

TypeScript cannot usefully narrow a union of different form APIs; field groups are the reusable cross-form abstraction.

Source: maintainer interview, TanStack/form-v2:packages/react-form/src/FieldGroup/withFields.public.ts
