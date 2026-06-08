import { useFormContext } from '../app-form'
import type { ComponentProps, SubmitEvent } from 'react'

export default function TanStackFormElement(props: ComponentProps<'form'>) {
  const form = useFormContext()

  function defaultHandler(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    event.stopPropagation()
    form.handleSubmit()
  }

  return (
    <form
      id={form.formId}
      {...props}
      onSubmit={props.onSubmit ?? defaultHandler}
    />
  )
}
