import { getFieldGroupHelpers } from '@tanstack/react-form'
import { z } from 'zod'
import { StringField } from '../StringField'

export const boundsSchema = z.coerce.number<string>().int()

const { defineFields, helper, withFields } = getFieldGroupHelpers()

const lowerBoundFields = defineFields({
  name: helper.strict<string>(),
})

interface LowerBoundFieldProps {
  fields: typeof lowerBoundFields
  label: string
}

function LowerBoundFieldComponent(props: LowerBoundFieldProps) {
  const { fields, label } = props

  return (
    <label>
      <fields.Field
        name="name"
        validators={[
          {
            run: boundsSchema,
            triggers: ['change'],
          },
        ]}
        listeners={[
          {
            run: ({ value }) => {
              fields.setFieldValue('name', parseInt(value, 10).toString())
            },
            triggers: ['blur'],
          },
        ]}
      >
        {(field) => <StringField field={field} label={label} />}
      </fields.Field>
    </label>
  )
}

export const LowerBoundField = withFields(
  lowerBoundFields,
  LowerBoundFieldComponent,
  'fields',
)

const upperBoundFields = defineFields({
  name: helper.strict<string>(),
  lowerBound: helper.strict<string>(),
})

interface UpperBoundFieldProps {
  fields: typeof upperBoundFields
  label: string
}

function UpperBoundFieldComponent(props: UpperBoundFieldProps) {
  const { fields, label } = props

  return (
    <label>
      <fields.Field
        name="name"
        validators={[
          {
            run: boundsSchema,
            triggers: ['change'],
          },
          {
            triggers: [
              {
                trigger: 'change',
                when: ({ value }) =>
                  passesSchema(value, fields.getFieldValue('lowerBound')),
              },
            ],
            watchFields: ['lowerBound'],
            run: ({ value }) => {
              const lowerBound = boundsSchema.parse(
                fields.getFieldValue('lowerBound'),
              )
              const upperBound = boundsSchema.parse(value)
              if (upperBound < lowerBound) {
                return 'Upper bound must be greater than lower bound'
              }
            },
          },
        ]}
        listeners={[
          {
            run: ({ value }) => {
              fields.setFieldValue('name', parseInt(value, 10).toString())
            },
            triggers: ['blur'],
          },
        ]}
      >
        {(field) => <StringField field={field} label={label} />}
      </fields.Field>
    </label>
  )
}

export const UpperBoundField = withFields(
  upperBoundFields,
  UpperBoundFieldComponent,
  'fields',
)

function passesSchema(...numbers: Array<unknown>) {
  return numbers.every((n) => boundsSchema.safeParse(n).success)
}
