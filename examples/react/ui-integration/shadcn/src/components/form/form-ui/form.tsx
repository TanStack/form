import { useFormContext } from '../contexts'
import type { ComponentProps, SubmitEvent } from 'react'

export default function TanStackFormElement(props: ComponentProps<'form'>) {
  const form = useFormContext()

  function defaultHandler(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    event.stopPropagation()
    form.handleSubmit()
  }

  return <form {...props} onSubmit={props.onSubmit ?? defaultHandler} />
}
