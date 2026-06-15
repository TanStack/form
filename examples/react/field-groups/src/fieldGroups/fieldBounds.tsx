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
            triggers: ['change'],
            watchFields: ['lowerBound'],
            run: ({ value, parseIssues }) => {
              const upperBoundResult = boundsSchema.safeParse(value)

              if (!upperBoundResult.success) {
                return parseIssues(upperBoundResult.error.issues)
              }

              const lowerBoundResult = boundsSchema.safeParse(
                fields.getFieldValue('lowerBound'),
              )

              if (!lowerBoundResult.success) {
                return
              }

              if (upperBoundResult.data < lowerBoundResult.data) {
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
