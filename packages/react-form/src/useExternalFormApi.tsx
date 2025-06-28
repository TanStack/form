import { FormApi, functionalUpdate } from '@tanstack/form-core'
import type {
  AnyFormApi,
  AnyFormState,
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
} from '@tanstack/form-core'
import { Field } from './useField'
import { useStore } from '@tanstack/react-store'
import { useState } from 'react'
import type { PropsWithChildren } from 'react'
import { useEffect, useLayoutEffect } from 'react'
import type { FieldComponent } from './useField'
import type { FormState } from '@tanstack/form-core'
import type { NoInfer } from '@tanstack/react-store'
import type { ReactNode } from 'react'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

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
 * Fields that are added onto the `FormAPI` from `@tanstack/form-core` and returned from the form hooks.
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
    TOnServer,
    TSubmitMeta
  >

  /**
   * Subscribe to the form state. Allows for reacting to changes in the form's state.
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
          TOnServer
        >
      >,
    ) => TSelected
    children: ((state: NoInfer<TSelected>) => ReactNode) | ReactNode
  }) => ReactNode
}

/**
 * An extended version of the `FormApi` class that includes React-specific functionalities from `ReactFormApi`.
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
    TOnServer,
    TSubmitMeta
  >

/**
 * A custom React Hook that attaches React helpers to an *already‑created*
 * {@link FormApi} instance.  This mirrors TanStack's `useForm` API but lets
 * callers supply their own `new FormApi()` so the same object can be shared
 * across frameworks (e.g. React + Solid).
 */
export function useExternalFormApi<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta,
>(
  /** An already‑constructed `FormApi` instance */
  formApi: FormApi<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer,
    TSubmitMeta
  >,
  /** Optional runtime options to patch via `formApi.update()` */
  opts?: FormOptions<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer,
    TSubmitMeta
  >,
) {
  // Attach React helpers only once and preserve referential stability
  const [extendedApi] = useState(() => {
    const api = formApi ?? new FormApi() // use the external instance as-is
    const ext = api as ReactFormExtendedApi<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta
    >

    // Inject JSX helpers
    ext.Field = (props) => <Field {...props} form={api} />
    ext.Subscribe = (props: any) => (
      <LocalSubscribe
        form={api}
        selector={props.selector}
        children={props.children}
      />
    )

    return ext
  })

  // Mount once on first render
  useIsomorphicLayoutEffect(formApi.mount, [])

  // Keep React in sync with `isSubmitting`
  useStore(formApi.store, (s) => s.isSubmitting)

  // Keep options fresh without triggering re-creation
  useIsomorphicLayoutEffect(() => {
    extendedApi.update(opts)
  })

  return extendedApi
}
