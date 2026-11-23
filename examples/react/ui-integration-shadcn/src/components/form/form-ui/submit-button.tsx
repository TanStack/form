import { useSelector } from '@tanstack/react-form'
import { formComponent } from '../helpers'
import type { AnyReactFormApi } from '@tanstack/react-form'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

function TanStackFormSubmitButtonComponent({
  formApi,
  ...props
}: ComponentProps<'button'> & { formApi: AnyReactFormApi }) {
  const isSubmitting = useSelector(formApi.atom, (state) => state.isSubmitting)
  return (
    <Button
      type="submit"
      disabled={props.disabled || isSubmitting}
      form={formApi.formId}
      {...props}
    >
      {isSubmitting && <Spinner />} {props.children ?? 'Submit'}
    </Button>
  )
}

const TanStackFormSubmitButton = formComponent.create(
  TanStackFormSubmitButtonComponent,
  'formApi',
)

export default TanStackFormSubmitButton
