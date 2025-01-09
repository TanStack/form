import { AnyFormApi, FormApi, functionalUpdate } from '@tanstack/form-core'
import { useStore } from '@tanstack/react-store'
import React, { useState } from 'react'
import { Field } from './useField'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import type { PropsWithChildren, ReactNode } from 'react'
import type { FieldComponent } from './useField'
import type { NoInfer } from '@tanstack/react-store'
import type { FormOptions, FormState, Validator } from '@tanstack/form-core'
import { AnyFormState } from './types'

/**
 * Fields that are added onto the `FormAPI` from `@tanstack/form-core` and returned from `useForm`
 */
export interface ReactFormApi<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
> {
  /**
   * A React component to render form fields. With this, you can render and manage individual form fields.
   */
  Field: FieldComponent<
    TFormData,
    TFormValidator,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn
  >
  /**
   * A `Subscribe` function that allows you to listen and react to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.
   */
  Subscribe: <
    TSelected = NoInfer<
      FormState<
        TFormData,
        TOnMountReturn,
        TOnChangeReturn,
        TOnChangeAsyncReturn,
        TOnBlurReturn,
        TOnBlurAsyncReturn,
        TOnSubmitReturn,
        TOnSubmitAsyncReturn
      >
    >,
  >(props: {
    selector?: (
      state: NoInfer<
        FormState<
          TFormData,
          TOnMountReturn,
          TOnChangeReturn,
          TOnChangeAsyncReturn,
          TOnBlurReturn,
          TOnBlurAsyncReturn,
          TOnSubmitReturn,
          TOnSubmitAsyncReturn
        >
      >,
    ) => TSelected
    children: ((state: NoInfer<TSelected>) => ReactNode) | ReactNode
  }) => ReactNode
}

/**
 * An extended version of the `FormApi` class that includes React-specific functionalities from `ReactFormApi`
 */
export type ReactFormExtendedApi<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
> = FormApi<
  TFormData,
  TFormValidator,
  TOnMountReturn,
  TOnChangeReturn,
  TOnChangeAsyncReturn,
  TOnBlurReturn,
  TOnBlurAsyncReturn,
  TOnSubmitReturn,
  TOnSubmitAsyncReturn
> &
  ReactFormApi<
    TFormData,
    TFormValidator,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn
  >

function LocalSubscribe({
  form,
  selector,
  children,
}: PropsWithChildren<{
  form: AnyFormApi
  selector: (state: AnyFormState) => AnyFormState
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
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
>(
  opts?: FormOptions<
    TFormData,
    TFormValidator,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn
  >,
) {
  const [formApi] = useState(() => {
    const api = new FormApi<
      TFormData,
      TFormValidator,
      TOnMountReturn,
      TOnChangeReturn,
      TOnChangeAsyncReturn,
      TOnBlurReturn,
      TOnBlurAsyncReturn,
      TOnSubmitReturn,
      TOnSubmitAsyncReturn
    >(opts)

    const extendedApi: ReactFormExtendedApi<
      TFormData,
      TFormValidator,
      TOnMountReturn,
      TOnChangeReturn,
      TOnChangeAsyncReturn,
      TOnBlurReturn,
      TOnBlurAsyncReturn,
      TOnSubmitReturn,
      TOnSubmitAsyncReturn
    > = api as never
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
