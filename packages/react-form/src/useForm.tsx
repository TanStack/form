import { FormApi, functionalUpdate } from '@tanstack/form-core'
import { useStore } from '@tanstack/react-store'
import { useState } from 'react'
import { Field } from './useField'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import type {
  AnyFormApi,
  AnyFormState,
  BaseFormOptions,
  FormAsyncValidateOrFn,
  FormOptions,
  FormState,
  FormValidateOrFn,
} from '@tanstack/form-core'
import type { ComponentType, JSX, PropsWithChildren, ReactNode } from 'react'
import type { FieldComponent } from './useField'
import type { NoInfer } from '@tanstack/react-store'

/**
 * Fields that are added onto the `FormAPI` from `@tanstack/form-core` and returned from `useForm`
 */
export interface ReactFormApi<
  in out TFormData,
  in out TOnMount extends undefined | FormValidateOrFn<TFormData>,
  in out TOnChange extends undefined | FormValidateOrFn<TFormData>,
  in out TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  in out TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  in out TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  in out TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  in out TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  in out TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
  in out TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  in out TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  in out TSubmitMeta,
> {
  /**
   * A React component to render form fields. With this, you can render and manage individual form fields.
   */
  Field: FieldComponent<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta
  >
  /**
   * A `Subscribe` function that allows you to listen and react to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.
   */
  Subscribe: <
    TSelected = NoInfer<
      FormState<
        TFormData,
        TOnMount,
        TOnChange,
        TOnChangeAsync,
        TOnBlur,
        TOnBlurAsync,
        TOnSubmit,
        TOnSubmitAsync,
        TOnDynamic,
        TOnDynamicAsync,
        TOnServer
      >
    >,
  >(props: {
    selector?: (
      state: NoInfer<
        FormState<
          TFormData,
          TOnMount,
          TOnChange,
          TOnChangeAsync,
          TOnBlur,
          TOnBlurAsync,
          TOnSubmit,
          TOnSubmitAsync,
          TOnDynamic,
          TOnDynamicAsync,
          TOnServer
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
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
  TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta,
> = FormApi<
  TFormData,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnDynamic,
  TOnDynamicAsync,
  TOnServer,
  TSubmitMeta
> &
  ReactFormApi<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta
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
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
  TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta,
>(
  opts?: FormOptions<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta
  >,
) {
  const [formApi] = useState(() => {
    const api = new FormApi<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TOnServer,
      TSubmitMeta
    >(opts)

    const extendedApi: ReactFormExtendedApi<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnDynamic,
      TOnDynamicAsync,
      TOnServer,
      TSubmitMeta
    > = api as never

    extendedApi.Field = function APIField(props) {
      return <Field {...props} form={api} />
    }

    extendedApi.Subscribe = function Subscribe(props: any) {
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

  /**
   * formApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   */
  useIsomorphicLayoutEffect(() => {
    formApi.update(opts)
  })

  return formApi
}
