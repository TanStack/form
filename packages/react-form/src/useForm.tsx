import { FormApi, functionalUpdate } from '@tanstack/form-core'
import { useStore } from '@tanstack/react-store'
import React, { useState } from 'react'
import { Field } from './useField'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import type { PropsWithChildren, ReactNode } from 'react'
import type { FieldComponent, UseField } from './useField'
import type { NoInfer } from '@tanstack/react-store'
import type { FormOptions, FormState, Validator } from '@tanstack/form-core'

/**
 * Fields that are added onto the `FormAPI` from `@tanstack/form-core` and returned from `useForm`
 */
export interface ReactFormApi<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> {
  /**
   * A React component to render form fields. With this, you can render and manage individual form fields.
   */
  Field: FieldComponent<TFormData, TFormValidator>
  /**
   * A custom React hook that provides functionalities related to individual form fields. It gives you access to field values, errors, and allows you to set or update field values.
   */
  useField: UseField<TFormData, TFormValidator>
  /**
   * A `useStore` hook that connects to the internal store of the form. It can be used to access the form's current state or any other related state information. You can optionally pass in a selector function to cherry-pick specific parts of the state
   */
  useStore: <TSelected = NoInfer<FormState<TFormData>>>(
    selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
  ) => TSelected
  /**
   * A `Subscribe` function that allows you to listen and react to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.
   */
  Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(props: {
    selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
    children: ((state: NoInfer<TSelected>) => ReactNode) | ReactNode
  }) => ReactNode
}

/**
 * An extended version of the `FormApi` class that includes React-specific functionalities from `ReactFormApi`
 */
export type ReactFormExtendedApi<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = FormApi<TFormData, TFormValidator> & ReactFormApi<TFormData, TFormValidator>

function LocalSubscribe({
  form,
  selector,
  children,
}: PropsWithChildren<{
  form: FormApi<any, any>
  selector: (state: FormState<any>) => FormState<any>
}>) {
  const data = useStore(form.store, selector)

  return functionalUpdate(children, data)
}

/**
 * A custom React Hook that returns an extended instance of the `FormApi` class.
 *
 * This API encapsulates all the necessary functionalities related to the form. It allows you to manage form state, handle submissions, and interact with form fields
 */
export function useForm<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(opts?: FormOptions<TFormData, TFormValidator>) {
  const [formApi] = useState(() => {
    const api = new FormApi<TFormData, TFormValidator>(opts)

    const extendedApi: ReactFormExtendedApi<TFormData, TFormValidator> =
      api as never
    extendedApi.Field = function APIField(props) {
      return <Field {...props} form={api} />
    }
    extendedApi.Subscribe = (props: any) => {
      return (
        <LocalSubscribe
          form={api}
          selector={props.selector}
          children={props.children}
        />
      )
    }

    return extendedApi
  })

  useIsomorphicLayoutEffect(formApi.mount, [])

  useStore(formApi.store, (state) => state.isSubmitting)

  /**
   * formApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   */
  useIsomorphicLayoutEffect(() => {
    formApi.update(opts)
  })

  return formApi
}
