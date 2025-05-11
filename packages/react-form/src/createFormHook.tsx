/* eslint-disable @eslint-react/no-context-provider */
import { createContext, useContext, useMemo, useState } from 'react'
import { FormLensApi, functionalUpdate } from '@tanstack/form-core'
import { useStore } from '@tanstack/react-store'
import { useForm } from './useForm'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import type {
  AnyFieldApi,
  AnyFormApi,
  AnyFormLensApi,
  AnyFormLensState,
  BaseFormOptions,
  DeepKeysOfType,
  FieldApi,
  FormAsyncValidateOrFn,
  FormLensState,
  FormOptions,
  FormValidateOrFn,
} from '@tanstack/form-core'
import type {
  ComponentType,
  Context,
  JSX,
  PropsWithChildren,
  ReactNode,
} from 'react'
import type { FieldComponent } from './useField'
import type { ReactFormExtendedApi } from './useForm'

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

type AppFieldExtendedReactFormLensApi<
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

export interface WithFormLensProps<
  TLensData,
  TFieldComponents extends Record<string, ComponentType<any>>,
  TFormComponents extends Record<string, ComponentType<any>>,
  TSubmitMeta,
  TRenderProps extends Record<string, unknown> = Record<string, never>,
> extends BaseFormOptions<TLensData, TSubmitMeta> {
  // Optional, but adds props to the `render` function outside of `form`
  props?: TRenderProps
  render: (
    props: PropsWithChildren<
      NoInfer<TRenderProps> & {
        lens: AppFieldExtendedReactFormLensApi<
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
          // this types it as 'never' in the render prop. It should prevent any
          // untyped meta passed to the handleSubmit by accident.
          unknown extends TSubmitMeta ? never : TSubmitMeta,
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
          <opts.form.AppField
            // @ts-expect-error because it doesn't recognize the name as a valid path.
            name={formLensApi.getFormFieldName(name)}
            {...appFieldProps}
          />
        )
      }

      extendedApi.Field = function Field({ name, ...fieldProps }) {
        return (
          <opts.form.Field
            // @ts-expect-error because it doesn't recognize the name as a valid path.
            name={formLensApi.getFormFieldName(name)}
            {...fieldProps}
          />
        )
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
        ...formComponents,
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
  }: WithFormLensProps<
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
              unknown extends TSubmitMeta ? TFormSubmitMeta : TSubmitMeta,
              TComponents,
              TFormComponents
            >
          | AppFieldExtendedReactFormLensApi<
              // Since this only occurs if you nest it within other form lenses, it can be more
              // lenient with the types.
              unknown,
              string,
              TFormData,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              any,
              unknown extends TSubmitMeta ? TFormSubmitMeta : TSubmitMeta,
              TComponents,
              TFormComponents
            >
        name: TName
      }
    >,
  ) => JSX.Element {
    return function Render(innerProps) {
      const lensProps = useMemo(() => {
        if (innerProps.form instanceof FormLensApi) {
          const lens = innerProps.form
          return {
            ...innerProps,
            // ensure that nested lenses still receive correct data from the top form
            form: lens.form,
            name: lens.getFormFieldName(innerProps.name),
            defaultValues,
          }
        } else {
          return {
            ...innerProps,
            defaultValues,
          }
        }
      }, [innerProps])
      const lensApi = useFormLens(lensProps as any)

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
