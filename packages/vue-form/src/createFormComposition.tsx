import { defineComponent, h, inject, provide } from 'vue'
import { FormApi } from '@tanstack/form-core'
import { useForm } from './useForm'
import type {
  AnyFieldApi,
  AnyFormApi,
  FieldApi,
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
} from '@tanstack/form-core'
import type { Component, InjectionKey } from 'vue'
import type { FieldComponent } from './useField'
import type { VueFormExtendedApi } from './useForm'

export function createFormCompositionContexts() {
  const fieldProviderKey = Symbol() as InjectionKey<AnyFieldApi>

  function injectField<TData>() {
    const field = inject(fieldProviderKey)

    if (!field) {
      throw new Error(
        '`injectField` only works when within a `fieldComponent` passed to `createFormComposition`',
      )
    }

    return field as FieldApi<
      any,
      string,
      TData,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >
  }

  const formProviderKey = Symbol() as InjectionKey<AnyFormApi>

  function injectForm() {
    const form = inject(formProviderKey)

    if (!form) {
      throw new Error(
        '`injectForm` only works when within a `formComponent` passed to `createFormHook`',
      )
    }

    return form as VueFormExtendedApi<
      // If you need access to the form data, you need to use `withForm` instead
      Record<string, never>,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >
  }

  return { fieldProviderKey, injectField, formProviderKey, injectForm }
}

interface CreateFormCompositionProps<
  TFieldComponents extends Record<string, Component>,
  TFormComponents extends Record<string, Component>,
> {
  fieldComponents: TFieldComponents
  fieldProviderKey: InjectionKey<AnyFieldApi>
  formComponents: TFormComponents
  formProviderKey: InjectionKey<AnyFormApi>
}

type AppFieldExtendedReactFormApi<
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
  TFieldComponents extends Record<string, Component>,
  TFormComponents extends Record<string, Component>,
> = VueFormExtendedApi<
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
  NoInfer<TFormComponents> & {
    AppField: FieldComponent<
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
      TSubmitMeta,
      NoInfer<TFieldComponents>
    >
    AppForm: Component
  }

export function createFormComposition<
  const TComponents extends Record<string, Component>,
  const TFormComponents extends Record<string, Component>,
>({
  fieldComponents,
  fieldProviderKey,
  formProviderKey,
  formComponents,
}: CreateFormCompositionProps<TComponents, TFormComponents>) {
  function useAppForm<
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
    props: FormOptions<
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
  ): AppFieldExtendedReactFormApi<
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
    TSubmitMeta,
    TComponents,
    TFormComponents
  > {
    const form = useForm(props)

    const AppForm = defineComponent((_, { slots }) => {
      provide(formProviderKey, form)
      return () => {
        return slots.default!()
      }
    })

    const FieldProvider = defineComponent(
      (props: { field: AnyFieldApi }, { slots }) => {
        provide(fieldProviderKey, props.field)
        return () => slots.default?.()
      },
      { props: ['field'] },
    )

    const AppField = defineComponent((props, { slots }) => {
      return () => {
        return (
          <form.Field {...props}>
            {({ field }: { field: AnyFieldApi }) => (
              <FieldProvider field={field}>
                {{
                  default: () =>
                    slots.default!({
                      field: Object.assign(field, fieldComponents),
                      state: field.state,
                    }),
                }}
              </FieldProvider>
            )}
          </form.Field>
        )
      }
    }) as FieldComponent<
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
      TSubmitMeta,
      TComponents
    >

    const extendedForm = Object.assign(form, {
      AppField,
      AppForm,
      ...formComponents,
    })

    return extendedForm
  }

  function getFormType<
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
    _formProps: FormOptions<
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
  ): AppFieldExtendedReactFormApi<
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
    TSubmitMeta,
    TComponents,
    TFormComponents
  > {
    return undefined as never
  }

  return {
    useAppForm,
    getFormType,
  }
}
