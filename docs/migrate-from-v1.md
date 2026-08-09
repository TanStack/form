---
id: migrate-from-v1
title: Migrating from v1
---

TanStack Form v2 keeps the same core idea as v1: create a form with
`useForm`, render fields from the returned form API, and submit with
`form.handleSubmit()`. Most migrations are not a full rewrite, but v2 does
change several React-facing APIs that show up in examples and integration
tests.

This page is a starting checklist for migrating React apps from v1 to v2.

## Quick checklist

- Keep `useForm`, `defaultValues`, `onSubmit`, `form.Field`, and
  `form.Subscribe`, but update render props from `field.state.value` and
  `field.state.meta` to `field.value` and `field.meta`.
- Always provide `defaultValues` to `useForm`. v2 does not support omitting
  them.
- Move field-level `defaultValue` props into form-level `defaultValues`.
- Remove field-level `defaultMeta` props. Model initial validation and error
  visibility through validators, `runOnMount`, and `errorVisibility`.
- Change validation from keyed event objects like `{ onChange, onBlur }` to
  arrays of validator objects with `run` and `triggers`.
- Change async validator debounce options such as `onChangeAsyncDebounceMs` to
  `triggerDebounceMs` on the validator object.
- Change field cross-validation from `onChangeListenTo` / `onBlurListenTo` to
  `watchFields` on validators or listeners.
- Replace `mode="array"` fields with `form.ArrayField`.
- Keep array mutations on the `ArrayField` render prop, such as
  `array.pushValue(...)`, or use path-based form methods such as
  `form.pushFieldValue(...)` when the control lives outside the render prop.
- Read errors from `field.errors`, `group.state.errors`, and
  `form.state.errors` as validation issue objects. Use `error.message` when
  rendering text.
- In form- and group-level validators, build routed errors with
  `createErrorMap(...)` and return the map directly.
- Return `createValidationError(...)` from `onSubmit` when a submit handler
  needs to route server errors back to form or field state.
- Use `useSelector`, which replaces v1's deprecated `useStore` usage.
- Subscribe to `form.atom` and `field.atom` instead of `form.store` and
  `field.store`.
- Use `formOptions(...)` for shared base form options.
- Replace `withForm` components with plain components that accept a `form` prop
  typed as `ReactFormType<typeof formOpts>`.
- Replace `useFormGroup` with `form.FormGroup` for scoped sections of the same
  form.
- Replace `withFieldGroup` with `defineFieldGroup(...).bindComponent(...)` for
  reusable field bundles that map virtual field names to different concrete
  form paths.
- Upgrade Vue to version 3.6 or newer when using the Vue adapter. Form
  Composition relies on behavior introduced in Vue 3.6.
- Update CommonJS integrations to consume ESM. The v2 packages do not publish
  a CommonJS build and require Node.js 18 or newer.
- Upgrade React to version 18 or newer. The v2 React adapter no longer supports
  React 17.
- Update CommonJS integrations to consume ESM. The v2 packages do not publish
  a CommonJS build and require Node.js 18 or newer.

## React version

The v2 React adapter supports React 18 and 19. React 17 is no longer supported,
so upgrade `react`, `react-dom`, and their corresponding type packages before
migrating. If you imported `CrossVersionReactNode` from `@tanstack/react-form`,
import `ReactNode` from `react` instead.

## Vue version

The v2 Vue adapter requires Vue 3.6 or newer. At the time of writing, Vue 3.6
has not yet been released as stable and is available as a release candidate.
We hope Vue 3.6 will be stable by the time TanStack Form v2 becomes stable.

Form Composition relies on Vue 3.6 behavior to work correctly. Requiring it
from the start lets the Vue adapter support Form Composition without adding a
breaking minimum-version change later in the v2 release line.

## Package format

The v2 core, framework, devtools, and server-adapter packages publish ESM
exports only and declare Node.js 18 as their minimum version. Prefer `import` /
`export` syntax, use dynamic `import()` when consuming them from CommonJS, and
make sure any Node-based test, SSR, or build tooling can load ESM dependencies.
There is no separate CommonJS build or `require` export to fall back to.

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
field.meta.isValid
field.errors.map((error) => error.message).join(',')
```

v2 also exposes `field.meta.isInvalid`, which is the inverse of `isValid` and
is convenient for attributes such as `aria-invalid`.

The v2 React integration tests also assert that fields rerender independently
when sibling fields change. Prefer reading only the subscribed field values and
meta you need in each render prop.

## Defaults and initial meta

In v1, a form could rely on field-level `defaultValue` props:

```tsx
// v1
const form = useForm({
  defaultValues: {} as Person,
})

<form.Field name="firstName" defaultValue="">
  {(field) => <input value={field.state.value} />}
</form.Field>
```

In v2, `defaultValues` are required on the form and are the only place to define
initial values:

```tsx
// v2
const form = useForm({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
})

<form.Field name="firstName">
  {(field) => <input value={field.value} />}
</form.Field>
```

`<form.Field defaultMeta={...}>` was also removed. If v1 code used
`defaultMeta={{ isTouched: true }}` to show errors immediately, replace the
implicit meta state with mount validation and an explicit visibility policy:

```tsx
// v2
const form = useForm({
  defaultValues: {
    firstName: '',
  },
})

<form.Field
  name="firstName"
  validators={[
    {
      runOnMount: true,
      triggers: ['change', 'blur'],
      run: ({ value }) => (value ? undefined : 'First name is required'),
    },
  ]}
>
  {(field) => (
    <>
      <input
        value={field.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      {field.errors.map((error) => (
        <p key={error.message}>{error.message}</p>
      ))}
    </>
  )}
</form.Field>
```

If errors should validate on mount but remain hidden until the user blurs the
field or tries to submit, use a form-level policy such as
`errorVisibility: ({ fieldState, state }) => fieldState.meta.isBlurred ||
state.submissionAttempts > 0` instead.

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

| v1                                    | v2                                                                               |
| ------------------------------------- | -------------------------------------------------------------------------------- |
| `validators.onMount`                  | validator with `runOnMount: true`                                                |
| `validators.onChange`                 | validator with `triggers: ['change']`                                            |
| `validators.onBlur`                   | validator with `triggers: ['blur']`                                              |
| `validators.onSubmit`                 | validator with `triggers: []`, or rely on submit running validators by default   |
| `onChangeAsync`                       | async `run` with `triggers: ['change']`                                          |
| `onChangeAsyncDebounceMs`             | `triggerDebounceMs`                                                              |
| `onChangeListenTo` / `onBlurListenTo` | `watchFields`                                                                    |
| `validationLogic: revalidateLogic()`  | migrate to explicit `triggers`, `when`, `runOnSubmit`, and `bailIfInvalid` rules |

Submission is separate from the `triggers` list: every validator runs during
submission by default. An empty `triggers: []` therefore means "no change or
blur validation, but still validate on submit." Set `runOnSubmit: false` when a
validator must not run during client submission; do not add `'submit'` to
`triggers`.

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

Predicate callbacks are scope-aware. A `when` callback, a function-valued
`runOnSubmit`, or a function-valued `triggerDebounceMs` receives `scope` and
`formApi`; field predicates receive the field being validated as `fieldApi`,
while group predicates also receive `groupApi`. For form and group predicates,
an optional `fieldApi` is the field that triggered validation.

Use `createValidator(...)` when the scheduling policy should be reused with
different validator functions or schemas while preserving their inferred
types:

```tsx
import { createValidator } from '@tanstack/react-form'

const validateAfterSubmit = createValidator({
  triggers: [
    {
      trigger: 'change',
      when: ({ groupApi, formApi }) =>
        (groupApi?.state.submissionAttempts ??
          formApi.state.submissionAttempts) > 0,
    },
  ],
})

const validators = [validateAfterSubmit(schema)]
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

The form's `value` remains its editable input state. When a Standard Schema
validator runs successfully during submission, its parsed output is available
in `onSubmit` at the corresponding `schemaOutputs` index. Non-schema entries
are `undefined`. Validators with literal `runOnSubmit: false` are skipped during
submission, and their slots are typed as `undefined`. Use the parsed entry when
an endpoint expects the schema's output type.

For schema-led option inference, `formOptions.strictSchema(...)` uses the
schema input as the form shape, while `formOptions.looseSchema(...)` permits
editable nullish defaults and combines them with the schema shape. These option
helpers only affect types; the validators still perform the runtime parsing.

When manually calling a schema, return `parseIssues(...)` with the failed issue
array. In a field validator it produces field issues; in a form or group
validator it routes issue paths into a form/field map; and in `onSubmit` it
produces a branded submit validation result. The v2 field-group example uses
this helper after calling `schema.safeParse(...)`.

## Errors and submit results

v1 examples commonly render errors from `field.state.meta.errors`. In v2,
render from `field.errors` for fields, `group.state.errors` for form groups, and
`form.state.errors` for the form. Each of the group and form collections is an
array. The items are validation issue objects, so render `error.message`.

```tsx
function FieldError({ field }: { field: AnyFieldApi }) {
  return (
    <small role={field.meta.isInvalid ? 'alert' : undefined} aria-live="polite">
      {field.errors.map((error) => error.message).join('\n')}
    </small>
  )
}
```

Form- and group-level validators can route errors to the form and individual
fields. Build a map with the `createErrorMap` supplied to `run`, then return the
map itself:

```tsx
const form = useForm({
  defaultValues: {
    firstName: '',
  },
  validators: [
    {
      triggers: ['change'],
      run: ({ value, createErrorMap }) => {
        const errors = createErrorMap()

        if (!value.firstName.trim()) {
          errors.form = 'Please correct the highlighted fields'
          errors.fields.firstName = 'First name is required'
        }

        return errors
      },
    },
  ],
})
```

`createErrorMap` also accepts an initial `{ form, fields }` object. An empty
returned map is treated as a valid result.
Field-level validators continue to return their own issue, string, issue array,
or a valid result directly.

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

`form.handleSubmit()` resolves to the validation-result array for that
submission attempt, so framework examples can await it and continue to native
or server submission when `errors.length === 0`. A thrown or rejected
`onSubmit` marks submission unsuccessful but is not added to that array. Return
`createValidationError(...)` or `parseIssues(...)` when a submit failure should
become validation state.

## Selectors and atoms

v1 re-exported `useStore` from `@tanstack/react-store`, but that usage was
deprecated before v2. In v2, use `useSelector` and subscribe to atoms:

```tsx
// v1
import { useStore } from '@tanstack/react-store'

const errors = useStore(form.store, (state) => state.errors)
const fieldErrors = useStore(field.store, (state) => state.meta.errors)
```

```tsx
// v2
import { useSelector } from '@tanstack/react-form'

const errors = useSelector(form.atom, (state) => state.errors)
const fieldErrors = useSelector(field.atom, (state) => state.meta.errors)
```

The same rename applies when subscribing to field groups:

```tsx
const values = useSelector(fields.atom, (values) => values)
```

Reading `form.state` or `group.state` gives an imperative snapshot; it does not
subscribe a React component. Use field render props, `form.Subscribe`,
`group.Subscribe`, or `useSelector` for reactive reads, and keep selectors
focused on the state the component renders.

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

v2 uses a dedicated `form.ArrayField` component for array subscriptions. Its
render prop still exposes array methods, so the direct migration can keep the
mutation next to the rendered array:

```tsx
// v2
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
      <button
        type="button"
        onClick={() => array.pushValue({ name: '', age: 0 })}
      >
        Add person
      </button>
    </>
  )}
</form.ArrayField>
```

When the mutation control is outside `ArrayField`, use the path-based form API
instead:

```tsx
form.pushFieldValue('people', { name: '', age: 0 })
```

The same choice is available for inserting, removing, moving, swapping,
filtering, and clearing values: use the relative methods on `array` or the
field-path methods on `form`.

The v2 array example calls out the performance reason for this change:
`ArrayField` lets the array shell rerender when the array structure changes
without forcing the whole list to rerender for every item value change.

## Shared form options

For extracted components, v1 composition examples often use a custom
`useAppForm` hook plus `withForm` from `createFormHook`. v2 still supports app
form hooks, but `withForm` was removed. The smaller building block for shared
defaults is `formOptions(...)`:

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

`AnyReactFormApi` and `FieldWithValue<T>` intentionally erase unrelated type
details for generic UI pieces. Use `ReactFormType<typeof formOpts>` when a
component needs the option-derived data and field-path surface. Options created
with `appFormOptions` also retain their app component map. Submit error types
may intentionally widen when the shared options omit `onSubmit` so it can be
supplied later. Prefer these aliases over spelling the full `FormApi` or
`FieldApi` generic lists in application components.

For components that previously used `withForm`, pass the form API explicitly and
type it from the same options object:

```tsx
// v1
const AddressFields = withForm({
  defaultValues: {
    address: {
      street: '',
      country: '',
    },
  },
  render: ({ form }) => (
    <>
      <form.Field name="address.street">{/* ... */}</form.Field>
      <form.Field name="address.country">{/* ... */}</form.Field>
    </>
  ),
})
```

```tsx
// v2
import { formOptions } from '@tanstack/react-form'
import type { ReactFormType } from '@tanstack/react-form'

export const profileFormOptions = formOptions({
  defaultValues: {
    address: {
      street: '',
      country: '',
    },
  },
})

interface AddressFieldsProps {
  form: ReactFormType<typeof profileFormOptions>
}

function AddressFields({ form }: AddressFieldsProps) {
  return (
    <>
      <form.Field name="address.street">{/* ... */}</form.Field>
      <form.Field name="address.country">{/* ... */}</form.Field>
    </>
  )
}
```

## Form groups and field groups

Replace v1 form group usage with `form.FormGroup`. It is the v2 tool for
multi-step forms and scoped validation when a section is part of one concrete
form shape:

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

Group submission is its own validation cycle. `group.handleSubmit()` validates
the group and its fields and then calls the group's `onSubmit` or
`onSubmitInvalid`; `form.handleSubmit()` does not also run the group's
validators. Keep any rules required for final whole-form submission in the
form-level validator pipeline as well. `group.handleSubmit()` resolves to an
error array, and `group.state.errors` is an array.

For a field inside a mounted group, scalar state exposed to `errorVisibility`
(such as `submissionAttempts` and `isDirty`) is scoped to the nearest group.
The callback's `values` and `errors` remain form-wide.

v1's `withFieldGroup` HOC was removed. v2 replaces it with
`defineFieldGroup(...)` for reusable field bundles. Use it when a component
should not care where its fields live in the parent form:

```tsx
import { defineFieldGroup } from '@tanstack/react-form'

const rangeFieldGroup = defineFieldGroup(({ strict }) => ({
  lower: strict<string>(),
  upper: strict<string>(),
}))

function RangeFieldsImpl({
  fields,
}: {
  fields: typeof rangeFieldGroup.fields
}) {
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

export const RangeFields = rangeFieldGroup.bindComponent(
  RangeFieldsImpl,
  'fields',
)
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
against different field paths. If you are using app form components from
`createFormHook`, wrap components that expect an injected field API with
`getFormHookHelpers()`, then define field groups with `defineAppFieldGroup`:

```tsx
import { createFormHook, getFormHookHelpers } from '@tanstack/react-form'

const { fieldComponent } = getFormHookHelpers()
const AppTextField = fieldComponent.strict(StringField, 'field')

const { appFormOptions, useAppForm, defineAppFieldGroup } = createFormHook({
  fieldComponents: {
    TextField: AppTextField,
  },
  formComponents: {},
})

const contactFieldGroup = defineAppFieldGroup(({ strict }) => ({
  name: strict<string>(),
}))
```

## Listeners

v1 listeners were event-keyed objects. v2 listeners use a validator-like array
shape with `run`, `triggers`, and optional `triggerDebounceMs`. A trigger can be
a string or `{ trigger, when }`, and debounce can be a number or a callback.
Form listeners support `change`, `blur`, `submit`, `mount`, and `reset`; field
listeners additionally support `unmount`.

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

For cross-field field listeners, put the source fields in `watchFields`. In
`form.FormGroup` and field-group-bound components, `watchFields` uses the scoped
or virtual field names and v2 resolves them to the concrete form paths.
Form-level listeners instead observe propagated events and receive an optional
source field as `triggerFieldApi`. It is present for propagated field changes
and blurs, but absent for form-originated events such as mount, reset, and
submit.

## Server and framework integrations

The v1 examples include Next server actions, Remix, and TanStack Start examples
that use v1's keyed validators and store-level errors. The v2 examples show a
new server-validation model in `@tanstack/react-form-start` and a Next.js
example with shared isomorphic validation.

Key changes:

- Import `serverValidateHelper` from `@tanstack/react-form`, then import the
  framework adapter from `@tanstack/react-form-start`,
  `@tanstack/react-form-nextjs`.
- Share common form configuration with `formOptions(...)`.
- Return the `createErrorMap()` map directly from framework/server validators
  when routing form and field errors.
- Combine `triggers: ['server']` with `runOnSubmit: false` for a form validator
  that must run only on the server. Server-triggered validators otherwise still
  run during client submission because submission is enabled by default.
- Next.js and Remix adapters, and the Start adapter when no callback override is
  supplied, resolve to
  `{ success: true, values, schemaOutputs }` or
  `{ success: false, serverState }`. Pass the failure's `serverState` back to
  `useForm({ ...formOpts, serverState })` on the client.
- `@tanstack/react-form-remix` was removed.

For example, a Start adapter is configured separately from the shared form
options:

```tsx
import { serverValidateHelper } from '@tanstack/react-form'
import { start } from '@tanstack/react-form-start'

const { createServerValidate } = serverValidateHelper({
  framework: start(),
})

const serverValidate = createServerValidate(formOpts)
```

In `formOpts`, a server-only validator returns its routed error map directly:

```tsx
{
  triggers: ['server'],
  runOnSubmit: false,
  run: ({ value, createErrorMap }) => {
    const errors = createErrorMap()

    if (value.age < 13) {
      errors.fields.age = 'You must be at least 13'
    }

    return errors
  },
}
```

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
   ESM `import` syntax, `useForm`, `defaultValues`, `form.Field`, and
   `form.handleSubmit()`.
2. Move every field-level `defaultValue` into form-level `defaultValues` and
   remove `defaultMeta`.
3. Update field render props from `field.state.*` to the direct v2 surface.
4. Replace `useStore(...store...)` with `useSelector(...atom...)`.
5. Convert validators and listeners to arrays, paying special attention to the
   default submit behavior.
6. Convert arrays from `mode="array"` to `form.ArrayField`; keep relative
   mutators on its render prop or move them to path-based form methods.
7. Return `createErrorMap(...)` directly from form, group, and server validators,
   and convert submitted endpoint errors to `createValidationError(...)`.
8. Revisit composition: use `formOptions(...)` for shared options,
   `ReactFormType<typeof formOpts>` for extracted form props,
   `form.FormGroup` for scoped sections, and
   `defineFieldGroup(...).bindComponent(...)` for reusable field bundles.
9. Re-run React integration tests around validation timing, field rerenders,
   groups, server error hydration, and array mutations. These are the areas
   where v2 intentionally tightened behavior.
