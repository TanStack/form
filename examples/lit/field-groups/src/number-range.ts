import { html } from 'lit'
import { defineFieldGroup } from '@tanstack/lit-form'
import { LowerBoundField, UpperBoundField } from './field-bounds'

const numberRange = defineFieldGroup(({ strict }) => ({
  minimum: strict<string>(),
  maximum: strict<string>(),
}))

function numberRangeField({
  fields,
  label,
}: {
  fields: typeof numberRange.fields
  label: string
}) {
  return html`
    <fieldset>
      <legend>${label}</legend>
      ${LowerBoundField({
        // Nested groups receive the parent group's API and logical field names.
        form: fields,
        fields: { value: 'minimum' },
        label: 'Minimum',
      })}
      ${UpperBoundField({
        form: fields,
        fields: { value: 'maximum', lowerBound: 'minimum' },
        label: 'Maximum',
      })}
    </fieldset>
  `
}

export const NumberRangeField = numberRange.bindComponent(
  numberRangeField,
  'fields',
)
