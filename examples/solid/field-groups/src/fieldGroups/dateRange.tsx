import { defineFieldGroup, useSelector } from '@tanstack/solid-form'
import { FieldError } from '../FieldError'
import type { Accessor } from 'solid-js'
import type { FieldWithValue } from '@tanstack/solid-form'

const dateRangeFieldGroup = defineFieldGroup(({ strict }) => ({
  start: strict<string>(),
  end: strict<string>(),
}))

interface DateRangeFieldProps {
  fields: typeof dateRangeFieldGroup.fields
  label: string
}

function DateRangeFieldComponent(props: DateRangeFieldProps) {
  const start = useSelector(props.fields.atom, (values) => values.start)

  return (
    <fieldset>
      <legend>{props.label}</legend>
      <props.fields.Field name="start">
        {(field) => <DateField field={field} label="Start date" />}
      </props.fields.Field>
      <props.fields.Field
        name="end"
        validators={[
          {
            triggers: [
              {
                trigger: 'change',
                when: ({ value }) => Boolean(value && start()),
              },
            ],
            watchFields: ['start'],
            run: ({ value }) => {
              if (value < start()) {
                return 'End date must be after the start date'
              }
            },
          },
        ]}
      >
        {(field) => <DateField field={field} label="End date" />}
      </props.fields.Field>
    </fieldset>
  )
}

export const DateRangeField = dateRangeFieldGroup.bindComponent(
  DateRangeFieldComponent,
  'fields',
)

function DateField(props: {
  field: Accessor<FieldWithValue<string>>
  label: string
}) {
  return (
    <label
      classList={{ validating: props.field().meta.isValidating }}
      style={{ display: 'block' }}
    >
      <span>{props.label}</span>
      <input
        name={props.field().name}
        type="date"
        value={props.field().value}
        onBlur={props.field().handleBlur}
        onInput={(event) =>
          props.field().handleChange(event.currentTarget.value)
        }
        aria-invalid={props.field().meta.isInvalid}
      />
      <br />
      <FieldError field={props.field} />
    </label>
  )
}
