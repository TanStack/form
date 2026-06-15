import { getFieldGroupHelpers } from '@tanstack/react-form'
import { FieldError } from '../FieldError'
import type { FieldWithValue } from '@tanstack/react-form'

const { defineFields, helper, withFields } = getFieldGroupHelpers()

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

  return (
    <fieldset>
      <legend>{label}</legend>

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
                when: ({ value }) =>
                  Boolean(value && fields.getFieldValue('start')),
              },
            ],
            watchFields: ['start'],
            run: ({ value }) => {
              const start = fields.getFieldValue('start')

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
