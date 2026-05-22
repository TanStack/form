import { useFormContext } from '../contexts'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface TanStackFormSubmitButtonProps extends ComponentProps<'button'> {}

export function TanStackFormSubmitButton(props: TanStackFormSubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          type="submit"
          disabled={props.disabled || isSubmitting}
          {...props}
        >
          {isSubmitting && <Spinner />} {props.children ?? 'Submit'}
        </Button>
      )}
    </form.Subscribe>
  )
}
