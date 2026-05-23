import { fieldComponent } from '../contexts'
import type { ComponentProps } from 'react'
import type { AnyFieldApi } from '@tanstack/react-form'
import { Field } from '@/components/ui/field'

interface TanStackFormFieldProps extends ComponentProps<'div'> {
  field: AnyFieldApi
}

function FormField(props: TanStackFormFieldProps) {
  const { field } = props

  return <Field data-invalid={field.meta.isInvalid} {...props} />
}

export const TanStackFormField = fieldComponent.loose(FormField, 'field')
