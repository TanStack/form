import { defineComponent, h, inject, provide } from 'vue'
import { useForm } from './useForm'
import type { Component, InjectionKey } from 'vue'
import type {
  AnyFieldApi,
  AnyFormApi,
  FieldApi,
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
} from '@tanstack/form-core'
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
      TOnServer,
      TSubmitMeta,
      NoInfer<TFieldComponents>
    >
    AppForm: Component
  }

export interface WithFormProps<
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
  TFieldComponents extends Record<string, Component>,
  TFormComponents extends Record<string, Component>,
  TRenderProps extends Record<string, unknown> = Record<string, never>,
> extends FormOptions<
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
  > {
  // Optional, but adds props to the `render` function outside of `form`
  props?: TRenderProps
  render: (
    props: NoInfer<TRenderProps> & {
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
    },
  ) => JSX.Element
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
    TOnServer,
    TSubmitMeta,
    TComponents,
    TFormComponents
  > {
    const form = useForm(props)

    const AppForm = defineComponent(() => {
      provide(formProviderKey, form)
      return () => {
        return <slot />
      }
    })

    const AppField = defineComponent((props, { slots }) => {
      return () => {
        return (
          <form.Field {...props}>
            {({ field }: { field: AnyFieldApi }) =>
              h({
                setup: (_) => {
                  provide(fieldProviderKey, field)
                },
                render: () => {
                  return slots.default({
                    field: Object.assign(field, fieldComponents),
                    state: field.state,
                  })
                },
              })
            }
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

  return {
    useAppForm,
  }
}
