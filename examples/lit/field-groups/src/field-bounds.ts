import { defineFieldGroup } from '@tanstack/lit-form'
import { z } from 'zod'
import { stringField } from './string-field'

const boundsSchema = z.coerce.number<string>().int()

const lowerBoundFieldGroup = defineFieldGroup(({ strict }) => ({
  value: strict<string>(),
}))

function lowerBoundField(props: {
  fields: typeof lowerBoundFieldGroup.fields
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

export const LowerBoundField = lowerBoundFieldGroup.bindComponent(
  lowerBoundField,
  'fields',
)

const upperBoundFieldGroup = defineFieldGroup(({ strict }) => ({
  value: strict<string>(),
  lowerBound: strict<string>(),
}))

function upperBoundField(props: {
  fields: typeof upperBoundFieldGroup.fields
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

export const UpperBoundField = upperBoundFieldGroup.bindComponent(
  upperBoundField,
  'fields',
)
