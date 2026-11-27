---
name: field-groups
description: Use when reusing a React TanStack Form section across different
  form shapes, binding virtual fields to concrete paths, or composing reusable
  sections with registered app controls.
metadata:
  purpose: Reuse typed React form sections by binding virtual fields to paths in different parent forms.
  type: framework
  framework: React
  library: '@tanstack/react-form'
  library_version: '2.0.0-alpha.3'
requires: []
sources:
  - TanStack/form:packages/react-form/src/FieldGroup/withFields.public.ts
  - TanStack/form:packages/react-form/src/FieldGroup/FieldGroupApi.public.ts
  - TanStack/form:docs/framework/react/guides/field-groups.md
  - TanStack/form:examples/react/field-groups/src/fieldGroups/*
  - TanStack/form:examples/react/large-form/src/features/people/emergency-contact.tsx
  - TanStack/form:packages/react-form/tests/public/field-groups/*
---

Declare the fields a reusable section needs, implement the section against those virtual names, and bind it to concrete paths at the call site. This workflow is self-contained; no other skill is required.

For a section used by only one known form, a typed form prop or [form context](../form-context/SKILL.md) may be sufficient. Use a field group when the section must work with different parent form shapes or field paths.

## Define and bind a reusable section

```tsx
import { defineFieldGroup, useForm, useSelector } from '@tanstack/react-form'

const rangeGroup = defineFieldGroup(({ strict }) => ({
  start: strict<string>(),
  end: strict<string>(),
}))

function RangeFields({
  fields,
  label,
}: {
  fields: typeof rangeGroup.fields
  label: string
}) {
  const start = useSelector(fields.atom, (values) => values.start)
  return (
    <fieldset>
      <legend>{label}</legend>
      <fields.Field name="start">
        {(field) => (
          <label>
            Start
            <input
              type="time"
              value={field.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </label>
        )}
      </fields.Field>
      <fields.Field
        name="end"
        validators={[
          {
            triggers: ['change', 'blur'],
            watchFields: ['start'],
            run: ({ value }) => {
              const first = fields.getFieldValue('start')
              if (first && value && value < first) {
                return 'End must follow start'
              }
              return undefined
            },
          },
        ]}
      >
        {(field) => (
          <>
            <label>
              End
              <input
                type="time"
                value={field.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            </label>
            {field.errors.map((error) => (
              <span key={error.message} role="alert">
                {error.message}
              </span>
            ))}
          </>
        )}
      </fields.Field>
      <output aria-label={`${label} start`}>{start}</output>
    </fieldset>
  )
}

export const RangeSection = rangeGroup.bindComponent(RangeFields, 'fields')

export function ScheduleEditor() {
  const form = useForm({
    defaultValues: { trip: { departure: '09:00', arrival: '10:00' } },
  })
  return (
    <RangeSection
      form={form}
      label="Trip"
      fields={{
        start: 'trip.departure',
        end: 'trip.arrival',
      }}
    />
  )
}
```

The example compares normalized `HH:mm` strings; it is not a general time parser. The parent form owns defaults and submission. The reusable component only knows `start` and `end`.

Inside `RangeFields`, `fields` is the scoped API. At the `RangeSection` call site, the same prop name accepts the virtual-to-concrete binding map. `bindComponent` also adds the `form` prop. Do not pass the definition's `fields` value as a live API yourself.

## Choose field contracts and paths

Use `strict<T>()` when destinations must have exactly that value type. Use `loose<T>()` when narrower assignable destination types are appropriate. Choose a contract that matches what the component can read and write; arbitrary string input should not write into a restricted string union.

Supply every binding when virtual names differ from the parent's paths. The binding map is optional only when every virtual name is already a compatible parent path. A complete map may still reroute those names. Dynamic paths such as `ranges[${index}].start` are supported.

Use virtual names for field components, `getFieldValue`, `setFieldValue`, validators, listeners, and `watchFields`. The group maps them to concrete paths. Do not reach into unrelated parent fields or hardcode one form's paths inside the reusable component. For validation scheduling, load `@tanstack/form-core#validation` through Intent.

## Read the correct subscription source

`useSelector(fields.atom, (values) => values.start)` reads typed virtual values. The atom contains those values directly; it is not a form-state object with a `values` property.

`fields.Subscribe` selects parent form state, such as `submissionAttempts`. Its `state.values` is `unknown` because the section can belong to different form shapes. Do not cast it to a particular parent's values. Read [subscriptions](../subscriptions/SKILL.md) when choosing a reactive read.

## Compose sections and registered controls

Field groups can contain other field groups. Pass the current `fields` API as the nested section's `form` and bind its slots to the current virtual names. A field node should have only one rendered field consumer; a watched dependency need not also render an input.

When using registered controls, define the group through the application's `defineAppFieldGroup` returned by `createFormHook`. This preserves the registered field components on `fields.Field`. Read [app forms](../app-forms/SKILL.md) when setting up that hook.

A field group reuses fields within the parent's lifecycle. It does not create a separate validation or submission boundary. `form.FormGroup` provides that scoped behavior and is a different feature. Field groups may compose; form groups must not nest.

## Check the section

Bind the section to two different parent shapes. Edit both fields and verify the concrete values and virtual preview. Change a watched start field and confirm the end validator rechecks the mapped dependency. Check incorrect paths, missing bindings, and incompatible value types fail type checking.

The [field-group guide](https://github.com/TanStack/form/blob/main/docs/framework/react/guides/field-groups.md), [binding types](https://github.com/TanStack/form/blob/main/packages/react-form/src/FieldGroup/withFields.public.ts), and [composed example](https://github.com/TanStack/form/blob/main/examples/react/field-groups/src/fieldGroups/numberRange.tsx) establish these patterns for v2.0.0-alpha.3.
