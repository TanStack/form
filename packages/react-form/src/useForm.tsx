import type { FormState, FormOptions } from '@tanstack/form-core'
import { FormApi, functionalUpdate } from '@tanstack/form-core'
import type { NoInfer } from '@tanstack/react-store'
import { useStore } from '@tanstack/react-store'
import React from 'react'
import { createFieldComponent, type FieldComponent } from './Field'
import { createUseField, type UseField } from './useField'
import { formContext } from './formContext'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData> {
    Form: FormComponent
    Field: FieldComponent<TFormData>
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
    api.Field = createFieldComponent<TData>()
    api.useField = createUseField<TData>()
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

  // React.useEffect(() => formApi.mount(), [])

  return formApi as any
}

export type FormProps = React.HTMLProps<HTMLFormElement> & {
  children: React.ReactNode
  noFormElement?: boolean
}

export type FormComponent = (props: FormProps) => any

export function createFormComponent(formApi: FormApi<any>) {
  const Form: FormComponent = ({ children, noFormElement, ...rest }) => {
    const isSubmitting = formApi.useStore((state) => state.isSubmitting)

    return (
      <formContext.Provider value={formApi}>
        {noFormElement ? (
          children
        ) : (
          <form
            onSubmit={formApi.handleSubmit}
            disabled={isSubmitting}
            {...rest}
          >
            {formApi.options.debugForm ? (
              <div
                style={{
                  margin: '2rem 0',
                }}
              >
                <div
                  style={{
                    fontWeight: 'bolder',
                  }}
                >
                  Form State
                </div>
                <pre>
                  <code>
                    {JSON.stringify(formApi, safeStringifyReplace(), 2)}
                  </code>
                </pre>
              </div>
            ) : null}
            {children}
          </form>
        )}
      </formContext.Provider>
    )
  }

  return Form
}

function safeStringifyReplace() {
  const set = new Set()
  return (_key: string, value: any) => {
    if (typeof value === 'object' || Array.isArray(value)) {
      if (set.has(value)) {
        return '(circular value)'
      }
      set.add(value)
    }
    return typeof value === 'function' ? undefined : value
  }
}
