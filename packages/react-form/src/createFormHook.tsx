/* eslint-disable @eslint-react/no-context-provider */
import { createContext, useContext, useMemo, useState } from 'react'
import { FormLensApi, getBy } from '@tanstack/form-core'
import { useForm } from './useForm'
import type {
  AnyFieldApi,
  AnyFormApi,
  BaseFormOptions,
  DeepKeysOfType,
  DeepValue,
  FieldApi,
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
} from '@tanstack/form-core'
import type { ComponentType, Context, JSX, PropsWithChildren } from 'react'
import type { FieldComponent } from './useField'
import type { ReactFormExtendedApi } from './useForm'

/**
 * TypeScript inferencing is weird.
 *
 * If you have:
 *
 * @example
 *
 * interface Args<T> {
 *     arg?: T
 * }
 *
 * function test<T>(arg?: Partial<Args<T>>): T {
 *     return 0 as any;
 * }
 *
 * const a = test({});
 *
 * Then `T` will default to `unknown`.
 *
 * However, if we change `test` to be:
 *
 * @example
 *
 * function test<T extends undefined>(arg?: Partial<Args<T>>): T;
 *
 * Then `T` becomes `undefined`.
 *
 * Here, we are checking if the passed type `T` extends `DefaultT` and **only**
 * `DefaultT`, as if that's the case we assume that inferencing has not occured.
 */
type UnwrapOrAny<T> = [unknown] extends [T] ? any : T
type UnwrapDefaultOrAny<DefaultT, T> = [DefaultT] extends [T]
  ? [T] extends [DefaultT]
    ? any
    : T
  : T

export function createFormHookContexts() {
  // We should never hit the `null` case here
  const fieldContext = createContext<AnyFieldApi>(null as never)

  function useFieldContext<TData>() {
    const field = useContext(fieldContext)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!field) {
      throw new Error(
        '`fieldContext` only works when within a `fieldComponent` passed to `createFormHook`',
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

  // We should never hit the `null` case here
  const formContext = createContext<AnyFormApi>(null as never)

  function useFormContext() {
    const form = useContext(formContext)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!form) {
      throw new Error(
        '`formContext` only works when within a `formComponent` passed to `createFormHook`',
      )
    }

    return form as ReactFormExtendedApi<
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

  return { fieldContext, useFieldContext, useFormContext, formContext }
}

interface CreateFormHookProps<
  TFieldComponents extends Record<string, ComponentType<any>>,
  TFormComponents extends Record<string, ComponentType<any>>,
> {
  fieldComponents: TFieldComponents
  fieldContext: Context<AnyFieldApi>
  formComponents: TFormComponents
  formContext: Context<AnyFormApi>
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
  TFieldComponents extends Record<string, ComponentType<any>>,
  TFormComponents extends Record<string, ComponentType<any>>,
> = ReactFormExtendedApi<
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
    AppForm: ComponentType<PropsWithChildren>
  }

type AppLensExtendedReactFormApi<
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
    AppField: FieldComponent<
      TLensData,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      TSubmitMeta,
      NoInfer<TFieldComponents>
    >
    AppForm: ComponentType<PropsWithChildren>
    /**
     * A React component to render form fields. With this, you can render and manage individual form fields.
     */
    Field: FieldComponent<
      TLensData,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      TSubmitMeta
    >
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
  TFieldComponents extends Record<string, ComponentType<any>>,
  TFormComponents extends Record<string, ComponentType<any>>,
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
    props: PropsWithChildren<
      NoInfer<TRenderProps> & {
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
      }
    >,
  ) => JSX.Element
}

export interface CreateFormGroupProps<
  TSubsetData,
  TFieldComponents extends Record<string, ComponentType<any>>,
  TFormComponents extends Record<string, ComponentType<any>>,
  TSubmitMeta = never,
  TRenderProps extends Record<string, unknown> = Record<string, never>,
> extends BaseFormOptions<TSubsetData, TSubmitMeta> {
  // Optional, but adds props to the `render` function outside of `form`
  props?: TRenderProps
  render: <
    TOnMount extends undefined | FormValidateOrFn<TSubsetData>,
    TOnChange extends undefined | FormValidateOrFn<TSubsetData>,
    TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TSubsetData>,
    TOnBlur extends undefined | FormValidateOrFn<TSubsetData>,
    TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TSubsetData>,
    TOnSubmit extends undefined | FormValidateOrFn<TSubsetData>,
    TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TSubsetData>,
    TOnServer extends undefined | FormAsyncValidateOrFn<TSubsetData>,
  >(
    props: PropsWithChildren<
      NoInfer<TRenderProps> & {
        form: AppFieldExtendedReactFormApi<
          TSubsetData,
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
      }
    >,
  ) => JSX.Element
}

export interface CreateFormLensProps<
  TLensData,
  TFieldComponents extends Record<string, ComponentType<any>>,
  TFormComponents extends Record<string, ComponentType<any>>,
  TSubmitMeta = never,
  TRenderProps extends Record<string, unknown> = Record<string, never>,
> extends BaseFormOptions<TLensData, TSubmitMeta> {
  // Optional, but adds props to the `render` function outside of `form`
  props?: TRenderProps
  render: (
    props: PropsWithChildren<
      NoInfer<TRenderProps> & {
        lens: AppLensExtendedReactFormApi<
          unknown,
          string,
          TLensData,
          undefined | FormValidateOrFn<unknown>,
          undefined | FormValidateOrFn<unknown>,
          undefined | FormAsyncValidateOrFn<unknown>,
          undefined | FormValidateOrFn<unknown>,
          undefined | FormAsyncValidateOrFn<unknown>,
          undefined | FormValidateOrFn<unknown>,
          undefined | FormAsyncValidateOrFn<unknown>,
          undefined | FormAsyncValidateOrFn<unknown>,
          TSubmitMeta,
          TFieldComponents,
          TFormComponents
        >
      }
    >,
  ) => JSX.Element
}

export function createFormHook<
  const TComponents extends Record<string, ComponentType<any>>,
  const TFormComponents extends Record<string, ComponentType<any>>,
>({
  fieldComponents,
  fieldContext,
  formContext,
  formComponents,
}: CreateFormHookProps<TComponents, TFormComponents>) {
  function useFormLens<
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
  }): AppLensExtendedReactFormApi<
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
      return api
    })

    const AppForm = useMemo(() => {
      return ((appFormProps) => {
        return <opts.form.AppForm {...appFormProps} />
      }) as ComponentType<PropsWithChildren>
    }, [opts])

    const AppField = useMemo(() => {
      return (({ name, ...appFieldProps }) => {
        return (
          <opts.form.AppField
            // @ts-expect-error because it doesn't recognize the name as a valid path.
            name={formLensApi.getFormFieldName(name)}
            {...appFieldProps}
          />
        )
      }) as FieldComponent<
        DeepValue<TFormData, TName>,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        TSubmitMeta,
        TComponents
      >
    }, [opts, formLensApi])

    const Field = useMemo(() => {
      return (({ name, ...fieldProps }) => {
        return (
          <opts.form.Field
            // @ts-expect-error because it doesn't recognize the name as a valid path.
            name={formLensApi.getFormFieldName(name)}
            {...fieldProps}
          />
        )
      }) as FieldComponent<
        DeepValue<TFormData, TName>,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        TSubmitMeta
      >
    }, [opts, formLensApi])

    const formLens = useMemo(() => {
      return Object.assign(formLensApi, {
        AppField,
        AppForm,
        Field,
        ...formComponents,
      }) as AppLensExtendedReactFormApi<
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
    }, [formLensApi, AppField, AppForm, Field])

    return formLens
  }

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

    const AppForm = useMemo(() => {
      return (({ children }) => {
        return (
          <formContext.Provider value={form}>{children}</formContext.Provider>
        )
      }) as ComponentType<PropsWithChildren>
    }, [form])

    const AppField = useMemo(() => {
      return (({ children, ...props }) => {
        return (
          <form.Field {...props}>
            {(field) => (
              // eslint-disable-next-line @eslint-react/no-context-provider
              <fieldContext.Provider value={field}>
                {children(Object.assign(field, fieldComponents))}
              </fieldContext.Provider>
            )}
          </form.Field>
        )
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
    }, [form])

    const extendedForm = useMemo(() => {
      return Object.assign(form, {
        AppField,
        AppForm,
        ...formComponents,
      })
    }, [form, AppField, AppForm])

    return extendedForm
  }

  function withForm<
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
    TRenderProps extends Record<string, unknown> = {},
  >({
    render,
    props,
  }: WithFormProps<
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
    TFormComponents,
    TRenderProps
  >): WithFormProps<
    UnwrapOrAny<TFormData>,
    UnwrapDefaultOrAny<undefined | FormValidateOrFn<TFormData>, TOnMount>,
    UnwrapDefaultOrAny<undefined | FormValidateOrFn<TFormData>, TOnChange>,
    UnwrapDefaultOrAny<undefined | FormValidateOrFn<TFormData>, TOnChangeAsync>,
    UnwrapDefaultOrAny<undefined | FormValidateOrFn<TFormData>, TOnBlur>,
    UnwrapDefaultOrAny<undefined | FormValidateOrFn<TFormData>, TOnBlurAsync>,
    UnwrapDefaultOrAny<undefined | FormValidateOrFn<TFormData>, TOnSubmit>,
    UnwrapDefaultOrAny<undefined | FormValidateOrFn<TFormData>, TOnSubmitAsync>,
    UnwrapDefaultOrAny<undefined | FormValidateOrFn<TFormData>, TOnServer>,
    UnwrapOrAny<TSubmitMeta>,
    UnwrapOrAny<TComponents>,
    UnwrapOrAny<TFormComponents>,
    UnwrapOrAny<TRenderProps>
  >['render'] {
    return (innerProps) => render({ ...props, ...innerProps })
  }

  function createFormGroup<
    TSubsetData,
    TSubmitMeta,
    TRenderProps extends Record<string, unknown> = {},
  >({
    render,
    props,
  }: CreateFormGroupProps<
    TSubsetData,
    TComponents,
    TFormComponents,
    TSubmitMeta,
    TRenderProps
  >): <
    TFormData extends TSubsetData,
    TOnMount extends undefined | FormValidateOrFn<TFormData>,
    TOnChange extends undefined | FormValidateOrFn<TFormData>,
    TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnBlur extends undefined | FormValidateOrFn<TFormData>,
    TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
    TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
    TFormSubmitMeta,
  >(
    params: PropsWithChildren<
      NoInfer<TRenderProps> & {
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
          unknown extends TSubmitMeta ? TFormSubmitMeta : TSubmitMeta,
          TComponents,
          TFormComponents
        >
      }
    >,
  ) => JSX.Element {
    return (innerProps) => render({ ...props, ...innerProps } as any)
  }

  function withFormLens<
    TLensData,
    TSubmitMeta,
    TRenderProps extends Record<string, unknown> = {},
  >({
    render,
    props,
    defaultValues,
  }: CreateFormLensProps<
    TLensData,
    TComponents,
    TFormComponents,
    TSubmitMeta,
    TRenderProps
  >): <
    TFormData,
    TName extends DeepKeysOfType<TFormData, TLensData>,
    TOnMount extends undefined | FormValidateOrFn<TFormData>,
    TOnChange extends undefined | FormValidateOrFn<TFormData>,
    TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnBlur extends undefined | FormValidateOrFn<TFormData>,
    TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
    TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
    TFormSubmitMeta,
  >(
    params: PropsWithChildren<
      NoInfer<TRenderProps> & {
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
          unknown extends TSubmitMeta ? TFormSubmitMeta : TSubmitMeta,
          TComponents,
          TFormComponents
        >
        name: TName
      }
    >,
  ) => JSX.Element {
    return function Render(innerProps) {
      const lensApi = useFormLens({
        ...innerProps,
        defaultValues,
      })

      return render({ ...props, ...innerProps, lens: lensApi as any })
    }
  }

  return {
    useAppForm,
    withForm,
    createFormGroup,
    withFormLens,
  }
}
