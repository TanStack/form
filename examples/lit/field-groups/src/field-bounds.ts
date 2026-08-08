import { getFieldGroupHelpers } from '@tanstack/lit-form'
import { z } from 'zod'
import { stringField } from './string-field'

const boundsSchema = z.coerce.number<string>().int()
const { defineFields, helper, withFields } = getFieldGroupHelpers()

const lowerBoundFields = defineFields({
  value: helper.strict<string>(),
})

function lowerBoundField(props: {
  fields: typeof lowerBoundFields
  label: string
}) {
  return props.fields.field(
    {
      name: 'value',
      validators: [
        {
          run: boundsSchema,
          triggers: ['change'],
        },
      ],
      listeners: [
        {
          triggers: ['blur'],
          run: ({ value }) => {
            props.fields.setFieldValue('value', parseInt(value, 10).toString())
          },
        },
      ],
    },
    (field) => stringField(field, props.label),
  )
}

export const LowerBoundField = withFields(
  lowerBoundFields,
  lowerBoundField,
  'fields',
)

const upperBoundFields = defineFields({
  value: helper.strict<string>(),
  lowerBound: helper.strict<string>(),
})

function upperBoundField(props: {
  fields: typeof upperBoundFields
  label: string
}) {
  return props.fields.field(
    {
      name: 'value',
      validators: [
        {
          triggers: ['change'],
          watchFields: ['lowerBound'],
          run: ({ value, parseIssues }) => {
            const upper = boundsSchema.safeParse(value)
            if (!upper.success) return parseIssues(upper.error.issues)
            const lower = boundsSchema.safeParse(
              props.fields.getFieldValue('lowerBound'),
            )
            if (lower.success && upper.data < lower.data) {
              return 'Upper bound must be greater than lower bound'
            }
          },
        },
      ],
      listeners: [
        {
          triggers: ['blur'],
          run: ({ value }) => {
            props.fields.setFieldValue('value', parseInt(value, 10).toString())
          },
        },
      ],
    },
    (field) => stringField(field, props.label),
  )
}

export const UpperBoundField = withFields(
  upperBoundFields,
  upperBoundField,
  'fields',
)
