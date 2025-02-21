import { createContext, useContext, useMemo } from 'react'
import { useForm } from './useForm'
import type {
  AnyFieldApi,
  FieldApi,
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
} from '@tanstack/form-core'
import type { ComponentType, Context } from 'react'
import type { FieldComponent } from './useField'
import type { ReactFormExtendedApi } from './useForm'

export function createFormHookContext() {
  // We should never hit the `null` case here
  const context = createContext<AnyFieldApi>(null as never)

  /**
   * This context only works when within a `component` passed to `createFormHook`
   */
  function useFieldContext<TData>() {
    const field = useContext(context)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!field) {
      throw new Error('useFieldContext must be used within a FormFieldContext')
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
      any
    >
  }

  return { context, useFieldContext }
}

interface CreateFormHookProps<
  TComponents extends Record<string, ComponentType<any>>,
> {
  components: TComponents
  context: Context<AnyFieldApi>
}

export function createFormHook<
  const TComponents extends Record<string, ComponentType<any>>,
>({ components, context }: CreateFormHookProps<TComponents>) {
  type AppField<
    TParentData,
    TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
    TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
    TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
    TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
    TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  > = FieldComponent<
    TParentData,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnServer,
    typeof components
  >

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
      TOnServer
    >,
  ): ReactFormExtendedApi<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer
  > & {
    AppField: AppField<
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
  } {
    const form = useForm(props)

    const AppField = useMemo(() => {
      return (({ children, ...props }) => {
        return (
          <form.Field {...props}>
            {(field) => (
              // eslint-disable-next-line @eslint-react/no-context-provider
              <context.Provider value={field}>
                {children(Object.assign(field, components))}
              </context.Provider>
            )}
          </form.Field>
        )
      }) satisfies AppField<
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
    }, [form])

    const extendedForm = useMemo(() => {
      return Object.assign(form, {
        AppField,
      })
    }, [form, AppField])

    return extendedForm
  }

  return {
    useAppForm,
  }
}
