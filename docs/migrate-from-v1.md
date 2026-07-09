# Migrating from TanStack Form v1

TanStack Form v2 keeps the same core idea as v1: create a form with
`useForm`, render fields from the returned form API, and submit with
`form.handleSubmit()`. Most migrations are not a full rewrite, but v2 does
change several React-facing APIs that show up in examples and integration
tests.

This page is a starting checklist for migrating React apps from v1 to v2. The
v1 code referenced here lives in `~/git/tanstack/form`; the v2 code lives in
this repository.

## Quick checklist

- Keep `useForm`, `defaultValues`, `onSubmit`, `form.Field`, and
  `form.Subscribe`, but update render props from `field.state.value` and
  `field.state.meta` to `field.value` and `field.meta`.
- Change validation from keyed event objects like `{ onChange, onBlur }` to
  arrays of validator objects with `run` and `triggers`.
- Change async validator debounce options such as `onChangeAsyncDebounceMs` to
  `triggerDebounceMs` on the validator object.
- Change field cross-validation from `onChangeListenTo` / `onBlurListenTo` to
  `watchFields` on validators or listeners.
- Replace `mode="array"` fields with `form.ArrayField`.
- Replace array methods on array field render props, such as `field.pushValue`,
  with form-level array methods like `form.pushFieldValue`.
- Read errors from `field.errors` / `form.state.errors` as validation issue
  objects. Use `error.message` when rendering text.
- Return `createValidationError(...)` from `onSubmit` when a submit handler
  needs to route server errors back to form or field state.
- Use `formOptions(...)` for shared base form options.
- Use `form.FormGroup` for scoped sections of the same form, and
  `getFieldGroupHelpers().withFields(...)` for reusable field bundles that map
  virtual field names to different concrete form paths.

## Basic fields

The v1 simple example and v2 basic example are intentionally similar. The main
render-prop difference is that v2 exposes the subscribed field surface directly.

```tsx
// v1
<form.Field name="firstName">
  {(field) => (
    <input
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(event) => field.handleChange(event.target.value)}
    />
  )}
</form.Field>
```

```tsx
// v2
<form.Field name="firstName">
  {(field) => (
    <input
      name={field.name}
      value={field.value}
      onBlur={field.handleBlur}
      onChange={(event) => field.handleChange(event.target.value)}
      aria-invalid={field.meta.isInvalid}
    />
  )}
</form.Field>
```

The same applies to common meta and error reads:

```tsx
// v1
field.state.value
field.state.meta.isTouched
field.state.meta.isValid
field.state.meta.errors.join(',')
```

```tsx
// v2
field.value
field.meta.isTouched
field.meta.isInvalid
field.errors.map((error) => error.message).join(',')
```

The v2 React integration tests also assert that fields rerender independently
when sibling fields change. Prefer reading only the subscribed field values and
meta you need in each render prop.

## Validators

v1 validators are keyed by event names:

```tsx
// v1
<form.Field
  name="firstName"
  validators={{
    onChange: ({ value }) =>
      !value
        ? 'A first name is required'
        : value.length < 3
          ? 'First name must be at least 3 characters'
          : undefined,
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: async ({ value }) => {
      await checkName(value)
      return value.includes('error')
        ? 'No "error" allowed in first name'
        : undefined
    },
  }}
/>
```

v2 validators are ordered arrays. Each validator has a `run` function or
standard schema, a `triggers` list, and optional behavior like debouncing or
bailing:

```tsx
// v2
<form.Field
  name="firstName"
  validators={[
    {
      run: ({ value }) => {
        if (value.length === 0) return 'A first name is required'
        if (value.length < 3) return 'First name is too short'
      },
      triggers: ['change', 'blur'],
      triggerDebounceMs: 300,
    },
    {
      run: async ({ value }) => {
        await checkName(value)
        return value.toLowerCase().includes('error')
          ? 'No "error" allowed in first name'
          : undefined
      },
      triggers: ['change'],
      bailIfInvalid: true,
    },
  ]}
/>
```

Useful translations:

| v1 | v2 |
| --- | --- |
| `validators.onMount` | validator with `runOnMount: true` |
| `validators.onChange` | validator with `triggers: ['change']` |
| `validators.onBlur` | validator with `triggers: ['blur']` |
| `validators.onSubmit` | validator with `triggers: []`, or rely on submit running validators by default |
| `onChangeAsync` | async `run` with `triggers: ['change']` |
| `onChangeAsyncDebounceMs` | `triggerDebounceMs` |
| `onChangeListenTo` / `onBlurListenTo` | `watchFields` |
| `validationLogic: revalidateLogic()` | migrate to explicit `triggers`, `when`, `runOnSubmit`, and `bailIfInvalid` rules |

`triggers` can contain strings or trigger config objects. Use config objects
when a validator should only run for some changes:

```tsx
validators={[
  {
    triggers: [
      {
        trigger: 'change',
        when: ({ value }) => Boolean(value),
      },
    ],
    watchFields: ['startDate'],
    run: ({ value, formApi }) => {
      const startDate = formApi.getFieldValue('startDate')
      if (value < startDate) return 'End date must be after the start date'
    },
  },
]}
```

## Standard schemas

v1 accepted standard schemas in event-keyed validators:

```tsx
// v1
useForm({
  defaultValues,
  validators: {
    onChange: schema,
  },
})
```

In v2, pass schemas as `run` values inside the validators array:

```tsx
// v2
useForm({
  defaultValues,
  validators: [
    {
      run: schema,
      triggers: ['change'],
    },
  ],
})
```

For field-level schemas, return parsed issues with the provided helpers when
you need custom routing. The v2 field-group example uses `parseIssues(...)`
inside `run` after calling `schema.safeParse(...)`.

## Errors and submit results

v1 examples commonly render errors from `field.state.meta.errors`. In v2,
render from `field.errors` for fields and from `form.state.errors` for the form.
The items are validation issue objects, so render `error.message`.

```tsx
function FieldError({ field }: { field: AnyFieldApi }) {
  return (
    <small role={field.meta.isInvalid ? 'alert' : undefined} aria-live="polite">
      {field.errors.map((error) => error.message).join('\n')}
    </small>
  )
}
```

Submit handlers can now return a typed validation result. Use
`createValidationError` to route endpoint errors back into form state:

```tsx
const form = useForm({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
  onSubmit: async ({ value, createValidationError }) => {
    const result = await saveUser(value)

    if (!result.ok) {
      return createValidationError({
        form: 'Could not save user',
        fields: {
          firstName: 'Name already exists',
          lastName: 'Name already exists',
        },
      })
    }

    return null
  },
})
```

`form.handleSubmit()` resolves to the current errors, so server examples can
await it and branch on `errors.length`.

## Arrays

v1 represented array fields with `mode="array"` and exposed array helpers from
the field render prop:

```tsx
// v1
<form.Field name="people" mode="array">
  {(field) => (
    <>
      {field.state.value.map((_, index) => (
        <form.Field key={index} name={`people[${index}].name`}>
          {(subField) => (
            <input
              value={subField.state.value}
              onChange={(event) => subField.handleChange(event.target.value)}
            />
          )}
        </form.Field>
      ))}
      <button
        type="button"
        onClick={() => field.pushValue({ name: '', age: 0 })}
      >
        Add person
      </button>
    </>
  )}
</form.Field>
```

v2 uses a dedicated `form.ArrayField` component for array subscriptions and
form-level array methods for mutations:

```tsx
// v2
<button
  type="button"
  onClick={() => form.pushFieldValue('people', { name: '', age: 0 })}
>
  Add person
</button>

<form.ArrayField name="people">
  {(array) => (
    <>
      {array.value.map((_, index) => (
        <form.Field key={index} name={`people[${index}].name`}>
          {(field) => (
            <input
              name={field.name}
              value={field.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          )}
        </form.Field>
      ))}
    </>
  )}
</form.ArrayField>
```

The v2 array example calls out the performance reason for this change:
`ArrayField` lets the array shell rerender when the array structure changes
without forcing the whole list to rerender for every item value change.

## Shared form options

For extracted components, v1 composition examples often use a custom
`useAppForm` hook from `createFormHook`. v2 still supports app form hooks, but
the smaller building block for shared defaults is `formOptions(...)`:

```tsx
import { formOptions } from '@tanstack/react-form'

export const sharedFormOptions = formOptions({
  defaultValues: {
    firstName: '',
    lastName: '',
    address: {
      street: '',
      country: '',
    },
  },
})

const form = useForm({
  ...sharedFormOptions,
  onSubmit: ({ value }) => {
    console.log(value)
  },
})
```

When typing extracted components, prefer the v2 public types:

```tsx
import type { AnyReactFormApi, FieldWithValue } from '@tanstack/react-form'

function StringField({ field }: { field: FieldWithValue<string> }) {
  return (
    <input
      value={field.value}
      onChange={(event) => field.handleChange(event.target.value)}
    />
  )
}

function SubmitButton({ form }: { form: AnyReactFormApi }) {
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? '...' : 'Submit'}
        </button>
      )}
    </form.Subscribe>
  )
}
```

## Form groups and field groups

v1 already had `form.FormGroup` and `useFormGroup` patterns for multi-step
forms and scoped validation. In v2, `form.FormGroup` remains the right tool
when a section is part of one concrete form shape:

```tsx
<form.FormGroup name="guestDetails" onSubmit={() => goToNextStep()}>
  {(group) => (
    <>
      <group.Field name="name">
        {(field) => (
          <input
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </group.Field>
      <button type="button" onClick={() => group.handleSubmit()}>
        Continue
      </button>
    </>
  )}
</form.FormGroup>
```

Inside the group, field names are scoped. `name="name"` becomes
`guestDetails.name`, `group.ArrayField name="guests"` becomes
`guestDetails.guests`, and watched fields are scoped the same way.

v2 also adds field groups for reusable field bundles. Use
`getFieldGroupHelpers()` when a component should not care where its fields live
in the parent form:

```tsx
import { getFieldGroupHelpers } from '@tanstack/react-form'

const { defineFields, helper, withFields } = getFieldGroupHelpers()

const rangeFields = defineFields({
  lower: helper.strict<string>(),
  upper: helper.strict<string>(),
})

function RangeFieldsImpl({ fields }: { fields: typeof rangeFields }) {
  return (
    <>
      <fields.Field name="lower">
        {(field) => (
          <input
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </fields.Field>
      <fields.Field
        name="upper"
        validators={[
          {
            triggers: ['change'],
            watchFields: ['lower'],
            run: ({ value }) => {
              const lower = fields.getFieldValue('lower')
              if (Number(value) < Number(lower)) {
                return 'Upper bound must be greater than lower bound'
              }
            },
          },
        ]}
      >
        {(field) => (
          <input
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </fields.Field>
    </>
  )
}

export const RangeFields = withFields(rangeFields, RangeFieldsImpl, 'fields')
```

Then bind virtual names to concrete paths wherever the group is used:

```tsx
<RangeFields
  form={form}
  fields={{
    lower: 'minPrice',
    upper: 'maxPrice',
  }}
/>
```

Use this v2 pattern to migrate v1 `withFieldGroup` components that were reused
against different field paths.

## Listeners

v1 listeners were event-keyed objects. v2 listeners mirror validators: they are
arrays of listener objects with `run`, `triggers`, optional
`triggerDebounceMs`, and optional `watchFields`.

```tsx
// v2
<form.Field
  name="amount"
  listeners={[
    {
      triggers: ['blur'],
      run: ({ value, fieldApi }) => {
        fieldApi.handleChange(Number(value).toFixed(2))
      },
    },
  ]}
/>
```

For cross-field listeners, put the source fields in `watchFields`. In
`form.FormGroup` and `withFields` components, `watchFields` uses the scoped or
virtual field names and v2 resolves them to the concrete form paths.

## Server and framework integrations

The v1 examples include Next server actions, Remix, and TanStack Start examples
that use v1's keyed validators and store-level errors. The v2 examples show a
new server-validation model in `react-form-start` and a Next.js example with
shared isomorphic validation.

Key changes:

- Import server helpers from `@tanstack/react-form-start` for Start-based apps.
- Share common form configuration with `formOptions(...)`.
- Return `createErrorMap().toResult()` from framework/server validators when
  routing form and field errors.
- Use a `triggers: ['server']` validator for server-only validation paths.
- Hydrate server state back into the client form with the framework helper for
  that integration.

Client rendering still follows the same v2 field surface:

```tsx
<form.Field name="age">
  {(field) => (
    <>
      <input
        name={field.name}
        value={field.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(Number(event.target.value))}
      />
      {field.errors.map((error) => (
        <div key={error.message} role="alert">
          {error.message}
        </div>
      ))}
    </>
  )}
</form.Field>
```

## Migration order for an app

1. Upgrade imports and keep the smallest possible form compiling with
   `useForm`, `defaultValues`, `form.Field`, and `form.handleSubmit()`.
2. Update field render props from `field.state.*` to the direct v2 surface.
3. Convert validators and listeners to arrays.
4. Convert arrays from `mode="array"` to `form.ArrayField` and form-level array
   mutators.
5. Convert submitted server errors to `createValidationError(...)`.
6. Revisit composition: use `formOptions(...)` for shared options,
   `form.FormGroup` for scoped sections, and `withFields(...)` for reusable
   field bundles.
7. Re-run React integration tests around validation timing, field rerenders,
   groups, and array mutations. These are the areas where v2 intentionally
   tightened behavior.
