---
id: field-groups
title: Build Reusable React Form Sections with Field Groups
---

Related fields often travel together. A scheduling form might need start and end
times, consistent `HH:mm` formatting, and a rule that prevents the end from
preceding the start. Another form needs the same behavior, but stores those
values at different paths.

A field group makes that component reusable by defining it around the fields it
needs rather than the shape of a particular parent form. Each form can then bind
its own field paths to the component.

This guide assumes you are comfortable creating fields with `useForm`. See the
[React Quick Start](../quick-start) for that foundation. If you only need to
move fields from one known form into another file, start with
[Splitting forms](../../../splitting-forms).

## A section tied to one form

Suppose an availability editor stores its times at `availability.opensAt` and
`availability.closesAt`. A natural first step is to extract those inputs into a
component that accepts the editor's concrete form type. We can even put the
blur formatter in that component so its caller does not have to repeat it.

<!-- ::start:tabs variant="files" -->

```tsx file="AvailabilityTimeRange.tsx"
import type { AvailabilityForm } from './form'
import { TextInput } from './TextInput'
import { formatTime } from './time-utils'

function AvailabilityTimeRange({ form }: { form: AvailabilityForm }) {
  return (
    <fieldset>
      <legend>Availability</legend>
      <form.Field
        name="availability.opensAt"
        listeners={[
          {
            triggers: ['blur'],
            run: ({ fieldApi }) => fieldApi.handleChange(formatTime),
          },
        ]}
      >
        {(field) => <TextInput field={field} label="Opens at" />}
      </form.Field>
      <form.Field
        name="availability.closesAt"
        listeners={[
          {
            triggers: ['blur'],
            run: ({ fieldApi }) => fieldApi.handleChange(formatTime),
          },
        ]}
      >
        {(field) => <TextInput field={field} label="Closes at" />}
      </form.Field>
    </fieldset>
  )
}
```

```ts file="form.ts"
import { formOptions, type ReactFormType } from '@tanstack/react-form'

export const availabilityFormOptions = formOptions({
  defaultValues: {
    availability: {
      opensAt: '',
      closesAt: '',
    },
  },
})

export type AvailabilityForm = ReactFormType<typeof availabilityFormOptions>
```

```tsx file="TextInput.tsx"
import type { FieldWithValue } from '@tanstack/react-form'

export function TextInput({
  field,
  label,
}: {
  field: FieldWithValue<string>
  label: string
}) {
  return (
    <label>
      {label}
      <input
        name={field.name}
        value={field.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={field.meta.isInvalid}
      />
      {field.errors.map((error) => (
        <small key={error.message} role="alert">
          {error.message}
        </small>
      ))}
    </label>
  )
}
```

```ts file="time-utils.ts"
export function formatTime(value: string) {
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(value.trim())
  if (!match) return value

  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return value

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
```

<!-- ::end:tabs -->

This is a useful component for the availability editor. It owns the input
wiring and turns a value such as `9:5` into `09:05` when the field loses focus.
The limitation appears when a booking form stores the same concept at
`schedule.departureTime` and `schedule.arrivalTime`. Both the form type and
the field names tie this component to the availability form.

We could type `form` as a union of every form that uses the time range,
but that makes the API difficult to use. It also means constantly fixing
its type as more forms need it. The time range does not care which form owns the
values, it only needs certain fields with the declared value types.

## Define virtual fields

Let's turn that dependency around. We have fields that need a certain type and depend on each other.
`defineFieldGroup` lets us define the contract that we expect any given form to complete. Since the fields can come from
anywhere, the field group can give them virtual names. This time range will call them `start` and `end`.

The returned definition connects that contract to a React component in two
steps. Its `fields` value types the field group API that can be used within the component, while `bindComponent`
creates a callable wrapper that a form can render.

<!-- ::start:tabs variant="files" -->

```tsx file="TimeRangeSection.tsx"
import { defineFieldGroup } from '@tanstack/react-form'

const timeRangeGroup = defineFieldGroup((helper) => ({
  // Both virtual fields must bind to concrete fields typed exactly as string.
  // To only allow the exact type, use `strict`.
  start: helper.strict<string>(),
  end: helper.strict<string>(),
}))

function TimeRangeFields(_props: {
  fields: typeof timeRangeGroup.fields
  label: string
}) {
  // ...
  return null
}

export const TimeRangeSection = timeRangeGroup.bindComponent(
  TimeRangeFields,
  // The prop that receives the field-group API.
  'fields',
)
```

<!-- ::end:tabs -->

The parent form still owns the field values and their default state.

We will fill in the component body in the next section. For now, its `fields`
prop is limited to the declared `start` and `end` paths, including their field
components, methods, and values.

> [!TIP] Why `bindComponent`?
> The selected prop keeps its name, but its role changes. Inside the component,
> it contains the field-group API. At the call site, it contains the
> virtual-to-concrete field map.
> `bindComponent` covers both the runtime as well as the types for you.

## Add field behavior

Now we can implement formatting and validation against `start` and `end`. The
blur listeners normalize both values, while the `end` validator watches `start`
and reports an error when the end precedes it.

Run the example, enter `9:5` in either field, then move focus away. The value
becomes `09:05`.

```tsx group=time-range-field-group env=react file=/App.tsx entry
import { defineFieldGroup, useForm } from '@tanstack/react-form'
import { TextInput } from './TextInput'
import { formatTime, toMinutes } from './time-utils'

const timeRangeGroup = defineFieldGroup(({ strict }) => ({
  start: strict<string>(),
  end: strict<string>(),
}))

interface TimeRangeFieldsProps {
  fields: typeof timeRangeGroup.fields
  label: string
}

function TimeRangeFields({ fields, label }: TimeRangeFieldsProps) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <fields.Field
        name="start"
        listeners={[
          {
            triggers: ['blur'],
            run: () => fields.setFieldValue('start', formatTime),
          },
        ]}
      >
        {(field) => <TextInput field={field} label="Start time" />}
      </fields.Field>
      <fields.Field
        name="end"
        validators={[
          {
            triggers: ['change', 'blur'],
            watchFields: ['start'],
            run: ({ value }) => {
              const start = toMinutes(fields.getFieldValue('start'))
              const end = toMinutes(value)

              if (start !== undefined && end !== undefined && end < start) {
                return 'End time must not be before the start time'
              }
            },
          },
        ]}
        listeners={[
          {
            triggers: ['blur'],
            run: () => fields.setFieldValue('end', formatTime),
          },
        ]}
      >
        {(field) => <TextInput field={field} label="End time" />}
      </fields.Field>
    </fieldset>
  )
}

const TimeRangeSection = timeRangeGroup.bindComponent(TimeRangeFields, 'fields')

export default function App() {
  const form = useForm({
    defaultValues: {
      availability: {
        opensAt: '',
        closesAt: '',
      },
      schedule: {
        departureTime: '08:30',
        arrivalTime: '10:00',
      },
    },
  })

  return (
    <main>
      <TimeRangeSection
        form={form}
        label="Availability"
        fields={{
          start: 'availability.opensAt',
          end: 'availability.closesAt',
        }}
      />
      <TimeRangeSection
        form={form}
        label="Travel schedule"
        fields={{
          start: 'schedule.departureTime',
          end: 'schedule.arrivalTime',
        }}
      />
      <form.Subscribe selector={(state) => state.values}>
        {(values) => (
          <pre aria-label="Form values">{JSON.stringify(values, null, 2)}</pre>
        )}
      </form.Subscribe>
    </main>
  )
}
```

```tsx group=time-range-field-group file=/TextInput.tsx collapsed
import type { FieldWithValue } from '@tanstack/react-form'

export function TextInput({
  field,
  label,
}: {
  field: FieldWithValue<string>
  label: string
}) {
  return (
    <label>
      {label}
      <input
        name={field.name}
        value={field.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={field.meta.isInvalid}
      />
      {field.errors.map((error) => (
        <small key={error.message} role="alert">
          {error.message}
        </small>
      ))}
    </label>
  )
}
```

```ts group=time-range-field-group file=/time-utils.ts collapsed
export function formatTime(value: string) {
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(value.trim())
  if (!match) return value

  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return value

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function toMinutes(value: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value)
  if (!match) return undefined
  return Number(match[1]) * 60 + Number(match[2])
}
```

```json group=time-range-field-group file=/package.json collapsed
{
  "dependencies": {
    "@tanstack/react-form": "2.0.0-alpha.2",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  }
}
```

Both time ranges apply the same formatting and validation even though their
values use different paths in the parent form.

## Bind the group to a form

The `fields` prop maps each virtual field to a concrete path. TypeScript checks
that every mapping exists and that each destination satisfies its field slot.

TanStack Form applies the current map to field rendering, field methods,
validators, listeners, and their `watchFields`. When the end validator watches
`start`, it therefore resolves the start path for the same time-range instance.

> [!NOTE] Dynamic paths are allowed
> Bindings may include array indices and other runtime paths, such as
> `ranges[${index}].start`.

The field group remains part of the parent form. It uses the parent's state,
validation lifecycle, and submission. It does not create a nested form or a
separate submit boundary.

### Read field-group values

The range validator reads the current start time with
`fields.getFieldValue('start')`. That is a good fit for a value needed only
while an event is running.

When rendered output should react to several group values, pass `fields.atom`
to `useSelector`. The selector stays typed to the virtual fields and does not
subscribe the component to unrelated form values.

<!-- ::start:tabs variant="files" -->

```tsx file="TimeRangeSection.tsx"
import { useSelector } from '@tanstack/react-form'

interface TimeRangeSummaryProps {
  fields: typeof timeRangeGroup.fields
}

function TimeRangeSummary({ fields }: TimeRangeSummaryProps) {
  const start = useSelector(fields.atom, (state) => state.start)
  const end = useSelector(fields.atom, (state) => state.end)

  return (
    <output>
      {start} to {end}
    </output>
  )
}
```

<!-- ::end:tabs -->

`fields.Subscribe` remains useful for parent form metadata such as submission
attempts or `isSubmitting`.

> [!WARNING] Avoid parent form values
> Parent form values can have any shape. Read values through the field-group
> API instead. Form metadata remains safe to access.

### Omit identity mappings

This binding map adds no information when the parent form already stores
compatible fields at `start` and `end`.

<!-- ::start:tabs variant="files" -->

```tsx file="OfficeHoursForm.tsx"
<TimeRangeSection
  form={form}
  label="Office hours"
  fields={{
    start: 'start',
    end: 'end',
  }}
/>
```

<!-- ::end:tabs -->

In this case, omit the `fields` prop. Supply it only to reroute virtual names,
and include every virtual field when you do.

### Choose strict or loose bindings

The time-range group uses `strict<string>()` because its formatter and inputs
expect ordinary strings. Strict slots accept only concrete fields with exactly
the declared value type. This catches a surprising binding before the section
can read or write it.

Use `loose<T>()` when the concrete field type may be narrower than `T`.

| Concrete field type           | `strict<number \| null>()` | `loose<number \| null>()` |
| ----------------------------- | -------------------------- | ------------------------- |
| `number \| null`              | ✓                          | ✓                         |
| `number`                      | X                          | ✓                         |
| `null`                        | X                          | ✓                         |
| `string \| null`              | X                          | X                         |
| `number \| null \| undefined` | X                          | X                         |

## Usage in Form Composition

Since each `createFormHook` can define its own field components, `defineFormGroup` does not know of them ahead of time.
If you want to use field components in field groups, use `defineAppFieldGroup` instead. The remaining syntax is exactly the same.

<!-- ::start:tabs variant="files" -->

```tsx file="AppTimeRangeSection.tsx"
import { createFormHook } from '@tanstack/react-form'
import { TextInput } from './TextInput'

const { defineAppFieldGroup } = createFormHook({
  fieldComponents: {
    TextInput,
  },
  formComponents: {},
})

const appTimeRangeGroup = defineAppFieldGroup(({ strict }) => ({
  start: strict<string>(),
  end: strict<string>(),
}))

function AppTimeRangeFields({
  fields,
  label,
}: {
  fields: typeof appTimeRangeGroup.fields
  label: string
}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <fields.Field name="start">
        {(field) => <field.TextInput label="Start time" />}
      </fields.Field>
      <fields.Field name="end">
        {(field) => <field.TextInput label="End time" />}
      </fields.Field>
    </fieldset>
  )
}

export const AppTimeRangeSection = appTimeRangeGroup.bindComponent(
  AppTimeRangeFields,
  'fields',
)
```

```tsx file="TextInput.tsx"
import type { FieldWithValue } from '@tanstack/react-form'

export function TextInput({
  field,
  label,
}: {
  field: FieldWithValue<string>
  label: string
}) {
  return (
    <label>
      {label}
      <input
        name={field.name}
        value={field.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={field.meta.isInvalid}
      />
      {field.errors.map((error) => (
        <small key={error.message} role="alert">
          {error.message}
        </small>
      ))}
    </label>
  )
}
```

<!-- ::end:tabs -->
