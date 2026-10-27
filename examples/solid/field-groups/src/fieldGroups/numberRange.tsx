import { defineFieldGroup } from '@tanstack/solid-form'
import { LowerBoundField, UpperBoundField } from './fieldBounds'

const numberRange = defineFieldGroup(({ strict }) => ({
  minimum: strict<string>(),
  maximum: strict<string>(),
}))

interface NumberRangeFieldProps {
  fields: typeof numberRange.fields
  label: string
}

function NumberRangeFieldComponent(props: NumberRangeFieldProps) {
  return (
    <fieldset>
      <legend>{props.label}</legend>
      <LowerBoundField
        label="Minimum"
        form={props.fields}
        fields={{ value: 'minimum' }}
      />
      <UpperBoundField
        label="Maximum"
        form={props.fields}
        fields={{ value: 'maximum', lowerBound: 'minimum' }}
      />
    </fieldset>
  )
}

export const NumberRangeField = numberRange.bindComponent(
  NumberRangeFieldComponent,
  'fields',
)
