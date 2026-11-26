import { fieldComponent } from '../helpers'
import type { AnyFieldApi } from '@tanstack/react-form'
import type { ComponentProps } from 'react'
import { FieldError } from '@/components/ui/field'

interface TanStackFormErrorProps extends ComponentProps<typeof FieldError> {
  field: AnyFieldApi
}

function FormError(props: TanStackFormErrorProps) {
  const { field } = props
  return <FieldError {...props} errors={field.errors} />
}

export default fieldComponent.loose()({
  component: FormError,
  replaceProperty: 'field',
})
