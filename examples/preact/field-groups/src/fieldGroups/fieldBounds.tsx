import { getFieldGroupHelpers } from '@tanstack/preact-form'
import { z } from 'zod'
import { StringField } from '../StringField'

export const boundsSchema = z.coerce.number<string>().int()

const { defineFields, helper, withFields } = getFieldGroupHelpers()

// Example 1: a field group can package field-specific options.
// `value` is a virtual field name. Callers bind it to a real field path like
// `minPrice` or `minAge`, but this component never needs to know that path.
// `helper.strict<string>()` means callers can only bind exact string fields.
const lowerBoundFields = defineFields({
  value: helper.strict<string>(),
})

interface LowerBoundFieldProps {
  fields: typeof lowerBoundFields
  label: string
}

function LowerBoundFieldComponent(props: LowerBoundFieldProps) {
  const { fields, label } = props

  // `fields` is the scoped FieldGroup API, not the full form API. This
  // component can render/read/write `value`, but it cannot touch fields that
  // were not declared in `lowerBoundFields`.
  return (
    <fields.Field
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
            fields.setFieldValue('value', parseInt(value, 10).toString())
          },
          triggers: ['blur'],
        },
      ]}
    >
      {(field) => <StringField field={field} label={label} />}
    </fields.Field>
  )
}

export const LowerBoundField = withFields(
  lowerBoundFields,
  LowerBoundFieldComponent,
  'fields',
)

// Example 2: a field group can depend on multiple fields without depending on
// a specific form shape. `value` is the field this component renders, while
// `lowerBound` is only read/watched by the validator below.
const upperBoundFields = defineFields({
  value: helper.strict<string>(),
  lowerBound: helper.strict<string>(),
})

interface UpperBoundFieldProps {
  fields: typeof upperBoundFields
  label: string
}

function UpperBoundFieldComponent(props: UpperBoundFieldProps) {
  const { fields, label } = props

  // Because `lowerBound` was declared above, it is available to validators,
  // listeners, and field methods. Undeclared form fields are still inaccessible.
  return (
    <fields.Field
      name="value"
      validators={[
        {
          triggers: ['change'],
          // `watchFields` also uses virtual names. The wrapper rewrites
          // `lowerBound` to the caller's concrete path, such as `minPrice`.
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
            fields.setFieldValue('value', parseInt(value, 10).toString())
          },
          triggers: ['blur'],
        },
      ]}
    >
      {(field) => <StringField field={field} label={label} />}
    </fields.Field>
  )
}

export const UpperBoundField = withFields(
  upperBoundFields,
  UpperBoundFieldComponent,
  'fields',
)
