import { fieldComponent } from '../field-brand'
import type { FieldWithValue } from '@tanstack/react-form'
import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'

interface TanStackFormNumberInputProps extends Omit<
  ComponentProps<'input'>,
  'value' | 'onChange'
> {
  field: FieldWithValue<number>
}

function FormNumberInput(props: TanStackFormNumberInputProps) {
  const { field, ...inputProps } = props

  return (
    <Input
      {...inputProps}
      type="number"
      id={field.name}
      name={field.name}
      value={field.value}
      onChange={(event) => field.handleChange(event.target.valueAsNumber)}
      onBlur={field.handleBlur}
      aria-invalid={field.meta.isInvalid}
    />
  )
}

export default fieldComponent.strict(FormNumberInput, 'field')
