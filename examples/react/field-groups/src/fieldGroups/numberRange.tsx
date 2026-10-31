import { defineFieldGroup } from '@tanstack/react-form'
import { LowerBoundField, UpperBoundField } from './fieldBounds'

const numberRange = defineFieldGroup(({ strict }) => ({
  minimum: strict<string>(),
  maximum: strict<string>(),
}))

interface NumberRangeFieldProps {
  fields: typeof numberRange.fields
  label: string
}

function NumberRangeFieldComponent({ fields, label }: NumberRangeFieldProps) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <LowerBoundField
        label="Minimum"
        /*
          Field groups can be nested in other field groups.
          Instead of forwarding the `form`, forward `fields`.
        */
        form={fields}
        fields={{ value: 'minimum' }}
      />
      <UpperBoundField
        label="Maximum"
        form={fields}
        fields={{ value: 'maximum', lowerBound: 'minimum' }}
      />
    </fieldset>
  )
}

export const NumberRangeField = numberRange.bindComponent(
  NumberRangeFieldComponent,
  'fields',
)
