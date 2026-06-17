import { getFieldGroupHelpers, useSelector } from '@tanstack/react-form'
import { FieldError } from '../FieldError'
import type { FieldWithValue } from '@tanstack/react-form'

const { defineFields, helper, withFields } = getFieldGroupHelpers()

// DateRangeField needs two string fields, but it does not care where they live.
// These virtual names are the only field names available inside the group.
// For example, this file can use `start` and `end`, but not `dateRanges[0]`.
const dateRangeFields = defineFields({
  start: helper.strict<string>(),
  end: helper.strict<string>(),
})

interface DateRangeFieldProps {
  fields: typeof dateRangeFields
  label: string
}

function DateRangeFieldComponent(props: DateRangeFieldProps) {
  const { fields, label } = props
  // `fields.values` contains only the values declared above, not the entire form.
  const start = useSelector(fields.atom, (values) => values.start)

  return (
    <fieldset>
      <legend>{label}</legend>

      {/* The group uses virtual names like `start`; callers provide the real path. */}
      <fields.Field name="start">
        {(field) => <DateField field={field} label="Start date" />}
      </fields.Field>

      <fields.Field
        name="end"
        validators={[
          {
            triggers: [
              {
                trigger: 'change',
                when: ({ value }) => Boolean(value && start),
              },
            ],
            // Watched fields are virtual too. This becomes the caller's bound
            // start path, such as `dateRanges[0].start`.
            watchFields: ['start'],
            run: ({ value }) => {
              if (value < start) {
                return 'End date must be after the start date'
              }
            },
          },
        ]}
      >
        {(field) => <DateField field={field} label="End date" />}
      </fields.Field>
    </fieldset>
  )
}

export const DateRangeField = withFields(
  dateRangeFields,
  DateRangeFieldComponent,
  'fields',
)

interface DateFieldProps {
  field: FieldWithValue<string>
  label: string
}

function DateField(props: DateFieldProps) {
  const { field, label } = props

  return (
    <label
      className={field.meta.isValidating ? 'validating' : ''}
      style={{
        display: 'block',
      }}
    >
      <span>{label}</span>
      <input
        name={field.name}
        type="date"
        value={field.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={field.meta.isInvalid}
      />
      <br />
      <FieldError field={field} />
    </label>
  )
}
