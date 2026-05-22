import { fieldComponent } from '../contexts'
import type { AnyFieldApi } from '@tanstack/react-form'
import type { ComponentProps } from 'react'
import { FieldError } from '@/components/ui/field'

interface TanStackFormErrorProps extends Omit<
  ComponentProps<typeof FieldError>,
  'errors'
> {
  field: AnyFieldApi
}

function FormError(props: TanStackFormErrorProps) {
  const { field } = props
  return <FieldError {...props} errors={field.errors} />
}

export const TanStackFormError = fieldComponent.loose(FormError, 'field')
