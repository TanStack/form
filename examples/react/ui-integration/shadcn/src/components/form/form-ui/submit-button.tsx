import { useFormContext } from '../app-form'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

export default function TanStackFormSubmitButton(
  props: ComponentProps<'button'>,
) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          type="submit"
          disabled={props.disabled || isSubmitting}
          form={form.formId}
          {...props}
        >
          {isSubmitting && <Spinner />} {props.children ?? 'Submit'}
        </Button>
      )}
    </form.Subscribe>
  )
}
