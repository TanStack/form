import type { FormState, FormOptions } from '@tanstack/form-core'
import { FormApi, functionalUpdate } from '@tanstack/form-core'
import type { NoInfer } from '@tanstack/react-store'
import { useStore } from '@tanstack/react-store'
import React from 'react'
import { type UseField, type FieldComponent, Field, useField } from './useField'
import { formContext } from './formContext'

declare module '@tanstack/form-core' {
  interface Register {
    FormSubmitEvent: React.FormEvent<HTMLFormElement>
  }

  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData> {
    Form: FormComponent
    Field: FieldComponent<TFormData, TFormData>
    useField: UseField<TFormData>
    useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => TSelected
    Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
      children:
        | ((state: NoInfer<TSelected>) => React.ReactNode)
        | React.ReactNode
    }) => any
  }
}

export function useForm<TData>(opts?: FormOptions<TData>): FormApi<TData> {
  const [formApi] = React.useState(() => {
    // @ts-ignore
    const api = new FormApi<TData>(opts)

    api.Form = createFormComponent(api)
    api.Field = Field as any
    api.useField = useField as any
    api.useStore = (
      // @ts-ignore
      selector,
    ) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useStore(api.store, selector as any) as any
    }
    api.Subscribe = (
      // @ts-ignore
      props,
    ) => {
      return functionalUpdate(
        props.children,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useStore(api.store, props.selector as any),
      ) as any
    }

    return api
  })

  formApi.update(opts)

  return formApi as any
}

export type FormProps = React.HTMLProps<HTMLFormElement> & {
  children: React.ReactNode
  noFormElement?: boolean
}

export type FormComponent = (props: FormProps) => any

function createFormComponent(formApi: FormApi<any>) {
  const Form: FormComponent = ({ children, noFormElement, ...rest }) => {
    const isSubmitting = formApi.useStore((state) => state.isSubmitting)

    return (
      <formContext.Provider value={{ formApi }}>
        {noFormElement ? (
          children
        ) : (
          <form
            onSubmit={formApi.handleSubmit}
            disabled={isSubmitting}
            {...rest}
          >
            {children}
          </form>
        )}
      </formContext.Provider>
    )
  }

  return Form
}
