import { fieldComponent } from '../field-brand'
import type { FieldWithValue } from '@tanstack/react-form'
import type { ComponentProps } from 'react'
import { Textarea } from '@/components/ui/textarea'

interface TanStackFormTextAreaProps extends ComponentProps<'textarea'> {
  field: FieldWithValue<string>
}

function FormTextArea(props: TanStackFormTextAreaProps) {
  const { field, ...textAreaProps } = props

  return (
    <Textarea
      {...textAreaProps}
      id={field.name}
      name={field.name}
      value={field.value}
      onChange={(event) => field.handleChange(event.target.value)}
      onBlur={field.handleBlur}
      aria-invalid={field.meta.isInvalid}
    />
  )
}

export default fieldComponent.strict(FormTextArea, 'field')
