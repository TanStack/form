import { useCallback, useRef } from 'react'
import type { FormEventHandler } from 'react'
import type { FormApi } from '@tanstack/form-core'

export const useActionSubmit = <TSubmitMeta>(
  form: FormApi<any, any, any, any, any, any, any, any, any, TSubmitMeta>,
) => {
  const isActionSubmittedRef = useRef(false)

  const onActionSubmit = useCallback(
    (submitMeta?: TSubmitMeta): FormEventHandler<HTMLFormElement> => {
      return async (event) => {
        if (isActionSubmittedRef.current) {
          isActionSubmittedRef.current = false
          return
        }

        event.preventDefault()

        await new Promise((resolve) => setTimeout(resolve))
        await (submitMeta ? form.handleSubmit(submitMeta) : form.handleSubmit())

        if (form.state.isValid) {
          isActionSubmittedRef.current = true
          ;(event.target as HTMLFormElement).requestSubmit()
        }
      }
    },
    [form],
  )

  return onActionSubmit
}
