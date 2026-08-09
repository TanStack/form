import { defineFieldGroup } from '@tanstack/solid-form'
import { z } from 'zod'
import { StringField } from '../StringField'

export const boundsSchema = z.coerce.number<string>().int()

const lowerBoundFieldGroup = defineFieldGroup(({ strict }) => ({
  value: strict<string>(),
}))

interface LowerBoundFieldProps {
  fields: typeof lowerBoundFieldGroup.fields
  label: string
}

function LowerBoundFieldComponent(props: LowerBoundFieldProps) {
  return (
    <props.fields.Field
      name="value"
      validators={[
        {
          run: boundsSchema,
          triggers: ['change'],
        },
      ]}
      listeners={[
        {
          run: ({ value }) => {
            props.fields.setFieldValue('value', parseInt(value, 10).toString())
          },
          triggers: ['blur'],
        },
      ]}
    >
      {(field) => <StringField field={field} label={props.label} />}
    </props.fields.Field>
  )
}

export const LowerBoundField = lowerBoundFieldGroup.bindComponent(
  LowerBoundFieldComponent,
  'fields',
)

const upperBoundFieldGroup = defineFieldGroup(({ strict }) => ({
  value: strict<string>(),
  lowerBound: strict<string>(),
}))

interface UpperBoundFieldProps {
  fields: typeof upperBoundFieldGroup.fields
  label: string
}

function UpperBoundFieldComponent(props: UpperBoundFieldProps) {
  return (
    <props.fields.Field
      name="value"
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
              props.fields.getFieldValue('lowerBound'),
            )

            if (!lowerBoundResult.success) return
            if (upperBoundResult.data < lowerBoundResult.data) {
              return 'Upper bound must be greater than lower bound'
            }
          },
        },
      ]}
      listeners={[
        {
          run: ({ value }) => {
            props.fields.setFieldValue('value', parseInt(value, 10).toString())
          },
          triggers: ['blur'],
        },
      ]}
    >
      {(field) => <StringField field={field} label={props.label} />}
    </props.fields.Field>
  )
}

export const UpperBoundField = upperBoundFieldGroup.bindComponent(
  UpperBoundFieldComponent,
  'fields',
)
