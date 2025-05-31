import { useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { FieldGroupApi, functionalUpdate } from '@tanstack/form-core'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import type {
  AnyFieldGroupApi,
  DeepKeysOfType,
  FieldGroupState,
  FieldsMap,
  FormAsyncValidateOrFn,
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
  lens: AnyFieldGroupApi
  selector: (state: FieldGroupState<any>) => FieldGroupState<any>
}>) {
  const data = useStore(lens.store, selector)

  return functionalUpdate(children, data)
}

/**
 * @private
 */
export type AppFieldExtendedReactFieldGroupApi<
  TFormData,
  TFieldGroupData,
  TFields extends
    | DeepKeysOfType<TFormData, TFieldGroupData>
    | FieldsMap<TFormData, TFieldGroupData>,
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
> = FieldGroupApi<
  TFormData,
  TFieldGroupData,
  TFields,
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
    AppField: LensFieldComponent<
      TFieldGroupData,
      TSubmitMeta,
      NoInfer<TFieldComponents>
    >
    AppForm: ComponentType<PropsWithChildren>
    /**
     * A React component to render form fields. With this, you can render and manage individual form fields.
     */
    Field: LensFieldComponent<TFieldGroupData, TSubmitMeta>

    /**
     * A `Subscribe` function that allows you to listen and react to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.
     */
    Subscribe: <TSelected = NoInfer<FieldGroupState<TFieldGroupData>>>(props: {
      selector?: (state: NoInfer<FieldGroupState<TFieldGroupData>>) => TSelected
      children: ((state: NoInfer<TSelected>) => ReactNode) | ReactNode
    }) => ReactNode
  }

export function useFieldGroup<
  TFormData,
  TFieldGroupData,
  TFields extends
    | DeepKeysOfType<TFormData, TFieldGroupData>
    | FieldsMap<TFormData, TFieldGroupData>,
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
  form:
    | AppFieldExtendedReactFormApi<
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
    | AppFieldExtendedReactFieldGroupApi<
        // Since this only occurs if you nest it within other form lenses, it can be more
        // lenient with the types.
        unknown,
        TFormData,
        string | FieldsMap<unknown, TFormData>,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        TSubmitMeta,
        TComponents,
        TFormComponents
      >
  fields: TFields
  defaultValues?: TFieldGroupData
  onSubmitMeta?: TSubmitMeta
  formComponents: TFormComponents
}): AppFieldExtendedReactFieldGroupApi<
  TFormData,
  TFieldGroupData,
  TFields,
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
    const api = new FieldGroupApi(opts)
    const form =
      opts.form instanceof FieldGroupApi
        ? (opts.form.form as AppFieldExtendedReactFormApi<
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
          >)
        : opts.form

    const extendedApi: AppFieldExtendedReactFieldGroupApi<
      TFormData,
      TFieldGroupData,
      TFields,
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
      return <form.AppForm {...appFormProps} />
    }

    extendedApi.AppField = function AppField({ name, ...appFieldProps }) {
      return (
        <form.AppField
          name={formLensApi.getFormFieldName(name)}
          {...(appFieldProps as any)}
        />
      ) as never
    }

    extendedApi.Field = function Field({ name, ...fieldProps }) {
      console.log('Field', name, formLensApi.fieldsMap)
      return (
        <form.Field
          name={formLensApi.getFormFieldName(name)}
          {...(fieldProps as any)}
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
    }) as AppFieldExtendedReactFieldGroupApi<
      TFormData,
      TFieldGroupData,
      TFields,
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
