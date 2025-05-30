import { useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { FormLensApi, functionalUpdate } from '@tanstack/form-core'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import type {
  AnyFormLensApi,
  AnyFormLensState,
  DeepKeysOfType,
  FormAsyncValidateOrFn,
  FormLensState,
  FormValidateOrFn,
} from '@tanstack/form-core'
import type { AppFieldExtendedReactFormApi } from './createFormHook'
import type { ComponentType, PropsWithChildren, ReactNode } from 'react'
import type { LensFieldComponent } from './useField'

function LocalSubscribe({
  lens,
  selector,
  children,
}: PropsWithChildren<{
  lens: AnyFormLensApi
  selector: (state: AnyFormLensState) => AnyFormLensState
}>) {
  const data = useStore(lens.store, selector)

  return functionalUpdate(children, data)
}

/**
 * @private
 */
export type AppFieldExtendedReactFormLensApi<
  TFormData,
  TName extends DeepKeysOfType<TFormData, TLensData>,
  TLensData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta,
  TFieldComponents extends Record<string, ComponentType<any>>,
  TFormComponents extends Record<string, ComponentType<any>>,
> = FormLensApi<
  TFormData,
  TLensData,
  TName,
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
  NoInfer<TFormComponents> & {
    form: AppFieldExtendedReactFormApi<
      TFormData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta,
      TFieldComponents,
      TFormComponents
    >
    AppField: LensFieldComponent<
      TLensData,
      TSubmitMeta,
      NoInfer<TFieldComponents>
    >
    AppForm: ComponentType<PropsWithChildren>
    /**
     * A React component to render form fields. With this, you can render and manage individual form fields.
     */
    Field: LensFieldComponent<TLensData, TSubmitMeta>

    /**
     * A `Subscribe` function that allows you to listen and react to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.
     */
    Subscribe: <
      TSelected = NoInfer<
        FormLensState<
          TFormData,
          TLensData,
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
          FormLensState<
            TFormData,
            TLensData,
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

export function useFieldGroup<
  TFormData,
  TName extends DeepKeysOfType<TFormData, TLensData>,
  TLensData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TComponents extends Record<string, ComponentType<any>>,
  TFormComponents extends Record<string, ComponentType<any>>,
  TSubmitMeta = never,
>(opts: {
  form: AppFieldExtendedReactFormApi<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer,
    TSubmitMeta,
    TComponents,
    TFormComponents
  >
  name: TName
  defaultValues?: TLensData
  onSubmitMeta?: TSubmitMeta
  formComponents: TFormComponents
}): AppFieldExtendedReactFormLensApi<
  TFormData,
  TName,
  TLensData,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnServer,
  TSubmitMeta,
  TComponents,
  TFormComponents
> {
  const [formLensApi] = useState(() => {
    const api = new FormLensApi(opts)

    const extendedApi: AppFieldExtendedReactFormLensApi<
      TFormData,
      TName,
      TLensData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta,
      TComponents,
      TFormComponents
    > = api as never

    extendedApi.AppForm = function AppForm(appFormProps) {
      return <opts.form.AppForm {...appFormProps} />
    }

    extendedApi.AppField = function AppField({ name, ...appFieldProps }) {
      return (
        // @ts-expect-error
        <opts.form.AppField
          name={formLensApi.getFormFieldName(name)}
          {...appFieldProps}
        />
      ) as never
    }

    extendedApi.Field = function Field({ name, ...fieldProps }) {
      return (
        // @ts-expect-error
        <opts.form.Field
          name={formLensApi.getFormFieldName(name)}
          {...fieldProps}
        />
      ) as never
    }

    extendedApi.Subscribe = function Subscribe(props: any) {
      return (
        <LocalSubscribe
          lens={formLensApi}
          selector={props.selector}
          children={props.children}
        />
      )
    }

    return Object.assign(extendedApi, {
      ...opts.formComponents,
    }) as AppFieldExtendedReactFormLensApi<
      TFormData,
      TName,
      TLensData,
      TOnMount,
      TOnChange,
      TOnChangeAsync,
      TOnBlur,
      TOnBlurAsync,
      TOnSubmit,
      TOnSubmitAsync,
      TOnServer,
      TSubmitMeta,
      TComponents,
      TFormComponents
    >
  })

  useIsomorphicLayoutEffect(formLensApi.mount, [formLensApi])

  return formLensApi
}
