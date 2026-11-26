import { fieldComponent } from '../helpers'
import type { ComponentProps } from 'react'
import type { AnyFieldApi } from '@tanstack/react-form'
import { Field } from '@/components/ui/field'

interface TanStackFormFieldProps extends ComponentProps<typeof Field> {
  field: AnyFieldApi
}

function FormField(props: TanStackFormFieldProps) {
  const { field, ...fieldProps } = props

  return <Field data-invalid={field.meta.isInvalid} {...fieldProps} />
}

export default fieldComponent.loose()({
  component: FormField,
  replaceProperty: 'field',
})
