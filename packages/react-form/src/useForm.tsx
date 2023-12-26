import type { FormOptions, FormState, Validator } from '@tanstack/form-core'
import { FormApi, functionalUpdate } from '@tanstack/form-core'
import type { NoInfer } from '@tanstack/react-store'
import { useStore } from '@tanstack/react-store'
import React, { useState, type PropsWithChildren, type ReactNode } from 'react'
import { formContext } from './formContext'
import { Field, useField, type FieldComponent, type UseField } from './useField'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData, TFormValidator> {
    Provider: (props: PropsWithChildren) => JSX.Element
    Field: FieldComponent<TFormData, TFormValidator>
    useField: UseField<TFormData>
    useStore: <TSelected = NoInfer<FormState<TFormData>>>(
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
    ) => TSelected
    Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
      children: ((state: NoInfer<TSelected>) => ReactNode) | ReactNode
    }) => JSX.Element
  }
}

export function useForm<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(
  opts?: FormOptions<TFormData, TFormValidator>,
): FormApi<TFormData, TFormValidator> {
  const [formApi] = useState(() => {
    const api = new FormApi<TFormData, TFormValidator>(opts)

    api.Provider = function Provider(props) {
      useIsomorphicLayoutEffect(api.mount, [])
      return (
        <formContext.Provider {...props} value={{ formApi: api as never }} />
      )
    }
    api.Field = Field as any
    api.useField = useField as any
    api.useStore = (selector) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useStore(api.store, selector)
    }
    api.Subscribe = (props) => {
      return functionalUpdate(
        props.children,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useStore(api.store, props.selector),
      ) as any
    }

    return api
  })

  formApi.useStore((state) => state.isSubmitting)

  /**
   * formApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   */
  useIsomorphicLayoutEffect(() => {
    formApi.update(opts)
  })

  return formApi as any
}
