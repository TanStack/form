import { formComponent } from '../helpers'
import type { AnyFormApi } from '@tanstack/react-form'
import type { ComponentProps, SubmitEvent } from 'react'

function TanStackFormElementComponent({
  formApi,
  ...props
}: ComponentProps<'form'> & { formApi: AnyFormApi }) {
  function defaultHandler(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    event.stopPropagation()
    formApi.handleSubmit().catch(console.error)
  }

  return (
    <form
      id={formApi.formId}
      {...props}
      onSubmit={props.onSubmit ?? defaultHandler}
    />
  )
}

const TanstackFormElement = formComponent.create({
  component: TanStackFormElementComponent,
  replaceProperty: 'formApi',
})

export default TanstackFormElement
