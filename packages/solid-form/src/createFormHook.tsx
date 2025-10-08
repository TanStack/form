import { createContext, createMemo, splitProps, useContext } from 'solid-js'
import { createForm } from './createForm'
import type {
  AnyFieldApi,
  AnyFormApi,
  BaseFormOptions,
  DeepKeysOfType,
  FieldApi,
  FieldsMap,
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
} from '@tanstack/form-core'
import type {
  Accessor,
  Component,
  Context,
  JSXElement,
  ParentProps,
} from 'solid-js'
import type { FieldComponent } from './createField'
import type { SolidFormExtendedApi } from './createForm'
import { AppFieldExtendedSolidFieldGroupApi, createFieldGroup } from './createFieldGroup'

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
 * `DefaultT`, as if that's the case we assume that inferencing has not occurred.
 */
type UnwrapOrAny<T> = [unknown] extends [T] ? any : T
type UnwrapDefaultOrAny<DefaultT, T> = [DefaultT] extends [T]
  ? [T] extends [DefaultT]
  ? any
  : T
  : T

export function createFormHookContexts() {
  // We should never hit the `null` case here
  const fieldContext = createContext<Accessor<AnyFieldApi>>(
    null as unknown as Accessor<AnyFieldApi>,
  )

  function useFieldContext<TData>() {
    const field = useContext(fieldContext)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!field) {
      throw new Error(
        '`fieldContext` only works when within a `fieldComponent` passed to `createFormHook`',
      )
    }

    return field as Accessor<
      FieldApi<
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
    >
  }

  // We should never hit the `null` case here
  const formContext = createContext<AnyFormApi>(null as unknown as AnyFormApi)

  function useFormContext() {
    const form = useContext(formContext)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!form) {
      throw new Error(
        '`formContext` only works when within a `formComponent` passed to `createFormHook`',
      )
    }

    return form as SolidFormExtendedApi<
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

  return { fieldContext, useFieldContext, useFormContext, formContext }
}

interface CreateFormHookProps<
  TFieldComponents extends Record<string, Component<any>>,
  TFormComponents extends Record<string, Component<any>>,
> {
  fieldComponents: TFieldComponents
  fieldContext: Context<Accessor<AnyFieldApi>>
  formComponents: TFormComponents
  formContext: Context<AnyFormApi>
}

/**
 * @private
 */
export type AppFieldExtendedSolidFormApi<
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
  TFieldComponents extends Record<string, Component<any>>,
  TFormComponents extends Record<string, Component<any>>,
> = SolidFormExtendedApi<
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
    AppForm: Component<ParentProps>
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
  TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
  TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta,
  TFieldComponents extends Record<string, Component<any>>,
  TFormComponents extends Record<string, Component<any>>,
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
  TOnDynamic,
  TOnDynamicAsync,
  TOnServer,
  TSubmitMeta
> {
  // Optional, but adds props to the `render` function outside of `form`
  props?: TRenderProps
  render: (
    props: ParentProps<
      NoInfer<TRenderProps> & {
        form: AppFieldExtendedSolidFormApi<
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
          TFieldComponents,
          TFormComponents
        >
      }
    >,
  ) => JSXElement
}

export interface WithFieldGroupProps<
  TFieldGroupData,
  TFieldComponents extends Record<string, Component<any>>,
  TFormComponents extends Record<string, Component<any>>,
  TSubmitMeta,
  TRenderProps extends Record<string, unknown> = Record<string, never>,
> extends BaseFormOptions<TFieldGroupData, TSubmitMeta> {
  // Optional, but adds props to the `render` function outside of `form`
  props?: TRenderProps
  render: (
    props: ParentProps<
      NoInfer<TRenderProps> & {
        group: AppFieldExtendedSolidFieldGroupApi<
          unknown,
          TFieldGroupData,
          string | FieldsMap<unknown, TFieldGroupData>,
          undefined | FormValidateOrFn<unknown>,
          undefined | FormValidateOrFn<unknown>,
          undefined | FormAsyncValidateOrFn<unknown>,
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
  ) => JSXElement
}

export function createFormHook<
  const TComponents extends Record<string, Component<any>>,
  const TFormComponents extends Record<string, Component<any>>,
>(opts: CreateFormHookProps<TComponents, TFormComponents>) {
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
    props: Accessor<
      FormOptions<
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
    >,
  ): AppFieldExtendedSolidFormApi<
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
    const form = createForm(props)

    const AppForm = ((formProps) => {
      return (
        <opts.formContext.Provider value={form}>
          {formProps.children}
        </opts.formContext.Provider>
      )
    }) as Component<ParentProps>

    const AppField = ((_props) => {
      const [childProps, fieldProps] = splitProps(_props, ['children'])
      return (
        <form.Field {...fieldProps}>
          {(field) => (
            <opts.fieldContext.Provider value={field}>
              {childProps.children(Object.assign(field, opts.fieldComponents))}
            </opts.fieldContext.Provider>
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
      TOnDynamic,
      TOnDynamicAsync,
      TOnServer,
      TSubmitMeta,
      TComponents
    >

    const extendedForm: AppFieldExtendedSolidFormApi<
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
    > = form as never
    extendedForm.AppField = AppField
    extendedForm.AppForm = AppForm
    for (const [key, value] of Object.entries(opts.formComponents)) {
      // Since it's a generic I need to cast it to an object
      ; (extendedForm as Record<string, any>)[key] = value
    }

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
    TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
    TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
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
    TOnDynamic,
    TOnDynamicAsync,
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
    UnwrapDefaultOrAny<undefined | FormValidateOrFn<TFormData>, TOnDynamic>,
    UnwrapDefaultOrAny<
      undefined | FormValidateOrFn<TFormData>,
      TOnDynamicAsync
    >,
    UnwrapDefaultOrAny<undefined | FormValidateOrFn<TFormData>, TOnServer>,
    UnwrapOrAny<TSubmitMeta>,
    UnwrapOrAny<TComponents>,
    UnwrapOrAny<TFormComponents>,
    UnwrapOrAny<TRenderProps>
  >['render'] {
    return (innerProps) => render({ ...props, ...innerProps })
  }

  function withFieldGroup<
    TFieldGroupData,
    TSubmitMeta,
    TRenderProps extends Record<string, unknown> = {},
  >({
    render,
    defaultValues,
    props,
  }: WithFieldGroupProps<
    TFieldGroupData,
    TComponents,
    TFormComponents,
    TSubmitMeta,
    TRenderProps
  >): <
    TFormData,
    TFields extends
    | DeepKeysOfType<TFormData, TFieldGroupData | null | undefined>
    | FieldsMap<TFormData, TFieldGroupData>,
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
    TFormSubmitMeta,
  >(
    params: ParentProps<
      NoInfer<TRenderProps> & {
        form:
        | AppFieldExtendedSolidFormApi<
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
          unknown extends TSubmitMeta ? TFormSubmitMeta : TSubmitMeta,
          TComponents,
          TFormComponents
        >
        | AppFieldExtendedSolidFieldGroupApi<
          // Since this only occurs if you nest it within other field groups, it can be more
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
          any,
          any,
          unknown extends TSubmitMeta ? TFormSubmitMeta : TSubmitMeta,
          TComponents,
          TFormComponents
        >
        fields: TFields
      }
    >,
  ) => JSXElement {
    return function Render(innerProps) {
      const fieldGroupProps = createMemo(() => {
        return { form: innerProps.form, fields: innerProps.fields, defaultValues, formComponents: opts.formComponents }
      })
      const fieldGroupApi = createFieldGroup(fieldGroupProps() as any);
      return render({ ...props, ...innerProps, group: fieldGroupApi as any })
    }
  }
  return {
    useAppForm,
    withForm,
    withFieldGroup
  }
}
