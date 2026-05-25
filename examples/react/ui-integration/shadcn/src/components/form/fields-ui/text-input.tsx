import { fieldComponent } from '../contexts'
import type { FieldWithValue } from '@tanstack/react-form'
import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'

interface TanStackFormTextInputProps extends ComponentProps<'input'> {
  field: FieldWithValue<string>
}

function FormTextInput(props: TanStackFormTextInputProps) {
  const { field } = props

  return (
    <Input
      type="text"
      id={field.name}
      name={field.name}
      value={field.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      aria-invalid={field.meta.isInvalid}
      {...props}
    />
  )
}

// We use fieldComponent instead of fieldBrand so that we don't have to pass `field` again.
// This component isn't generic, so that is safe.

// Strict is important, because if a field is 'a' | 'b', we don't want the user to be able to use a string input
export default fieldComponent.strict(FormTextInput, 'field')
