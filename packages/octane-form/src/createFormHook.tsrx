import { createContext, useContext, useMemo } from 'octane'
import { useForm } from './useForm.tsrx'
import { useFieldGroup } from './useFieldGroup.tsrx'
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
import type { Context } from 'octane'
import type { FieldComponent } from './useField.tsrx'
import type { OctaneFormExtendedApi } from './useForm.tsrx'
import type { AppFieldExtendedOctaneFieldGroupApi } from './useFieldGroup.tsrx'

type HookRenderable = unknown
type HookPropsWithChildren<P = object> = P & { children?: HookRenderable }
type HookFunctionComponent<P = object> = (props: P) => HookRenderable
type HookComponentType<P = object> = HookFunctionComponent<P>

// We should never hit the `null` case here
const fieldContext = createContext<AnyFieldApi>(null as never)
const formContext = createContext<AnyFormApi>(null as never)

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
type UnwrapDefaultOrAny<DefaultT, T> =
  [DefaultT] extends [T] ? [T] extends [DefaultT] ? any : T : T

function useFormContext() {
  const form = useContext(formContext)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!form) {
    throw new Error('`formContext` only works when within a `formComponent` passed to `createFormHook`')
  }

  return form as
    OctaneFormExtendedApi<
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

export function createFormHookContexts() {
  function useFieldContext<TData>() {
    const field = useContext(fieldContext)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!field) {
      throw new Error('`fieldContext` only works when within a `fieldComponent` passed to `createFormHook`')
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

  return { fieldContext, useFieldContext, useFormContext, formContext }
}

interface CreateFormHookProps<
  TFieldComponents extends Record<string, HookComponentType<any>>,
  TFormComponents extends Record<string, HookComponentType<any>>,
> {
  fieldComponents: TFieldComponents
  fieldContext: Context<AnyFieldApi>
  formComponents: TFormComponents
  formContext: Context<AnyFormApi>
}

/**
 * @private
 */
export type AppFieldExtendedOctaneFormApi<
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
  TFieldComponents extends Record<string, HookComponentType<any>>,
  TFormComponents extends Record<string, HookComponentType<any>>,
> =
  OctaneFormExtendedApi<
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
  > & NoInfer<TFormComponents> & {
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
    >;
    AppForm: HookComponentType<
      // Keep children optional in the renderer-facing component props.
      HookPropsWithChildren<{}>
    >;
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
  TFieldComponents extends Record<string, HookComponentType<any>>,
  TFormComponents extends Record<string, HookComponentType<any>>,
  TRenderProps extends object = Record<string, never>,
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
  render: HookFunctionComponent<
    HookPropsWithChildren<
      NoInfer<TRenderProps> & {
        form: AppFieldExtendedOctaneFormApi<
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
        >;
      }
    >
  >
}

export interface WithFieldGroupProps<
  TFieldGroupData,
  TFieldComponents extends Record<string, HookComponentType<any>>,
  TFormComponents extends Record<string, HookComponentType<any>>,
  TSubmitMeta,
  TRenderProps extends object = Record<string, never>,
> extends BaseFormOptions<TFieldGroupData, TSubmitMeta> {
  // Optional, but adds props to the `render` function outside of `form`
  props?: TRenderProps
  render: HookFunctionComponent<
    HookPropsWithChildren<
      NoInfer<TRenderProps> & {
        group: AppFieldExtendedOctaneFieldGroupApi<
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
        >;
      }
    >
  >
}

type UseAppForm<
  TComponents extends Record<string, HookComponentType<any>>,
  TFormComponents extends Record<string, HookComponentType<any>>,
> =
  <
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
  >(props: FormOptions<
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
  >) => AppFieldExtendedOctaneFormApi<
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
  >

type WithForm<
  TComponents extends Record<string, HookComponentType<any>>,
  TFormComponents extends Record<string, HookComponentType<any>>,
> =
  <
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
    TRenderProps extends object = {},
  >(props: WithFormProps<
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
  >) => WithFormProps<
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
  >['render']

type WithFieldGroup<
  TComponents extends Record<string, HookComponentType<any>>,
  TFormComponents extends Record<string, HookComponentType<any>>,
> =
  <
    TFieldGroupData,
    TSubmitMeta,
    TRenderProps extends object = {},
  >(props: WithFieldGroupProps<
    TFieldGroupData,
    TComponents,
    TFormComponents,
    TSubmitMeta,
    TRenderProps
  >) => <
    TFormData,
    TFields extends | DeepKeysOfType<
        TFormData,
        TFieldGroupData | null | undefined
      >
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
  >(params: HookPropsWithChildren<
    NoInfer<TRenderProps> & {
      form: | AppFieldExtendedOctaneFormApi<
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
      | AppFieldExtendedOctaneFieldGroupApi<
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
        >;
      fields: TFields;
    }
  >) => ReturnType<HookFunctionComponent>

type UseTypedAppFormContext<
  TComponents extends Record<string, HookComponentType<any>>,
  TFormComponents extends Record<string, HookComponentType<any>>,
> =
  <
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
  >(props: FormOptions<
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
  >) => AppFieldExtendedOctaneFormApi<
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
  >

type FieldComponentExtension<
  TComponents extends Record<string, HookComponentType<any>>,
> =
  Record<
    string,
    HookComponentType<any>
  > & { [K in keyof TComponents]?: 'Error: field component names must be unique — this key already exists in the base form' }

type FormComponentExtension<
  TComponents extends Record<string, HookComponentType<any>>,
> =
  Record<
    string,
    HookComponentType<any>
  > & { [K in keyof TComponents]?: 'Error: form component names must be unique — this key already exists in the base form' }

export interface CreateFormHookReturn<
  TComponents extends Record<string, HookComponentType<any>>,
  TFormComponents extends Record<string, HookComponentType<any>>,
> {
  useAppForm: UseAppForm<TComponents, TFormComponents>
  withForm: WithForm<TComponents, TFormComponents>
  withFieldGroup: WithFieldGroup<TComponents, TFormComponents>
  useTypedAppFormContext: UseTypedAppFormContext<TComponents, TFormComponents>
  extendForm: <
    TNewField extends FieldComponentExtension<TComponents>,
    TNewForm extends FormComponentExtension<TFormComponents>,
  >(extension: {
    fieldComponents?: TNewField;
    formComponents?: TNewForm;
  }) => CreateFormHookReturn<
    TComponents & TNewField,
    TFormComponents & TNewForm
  >
}

export function createFormHook<
  TComponents extends Record<string, HookComponentType<any>>,
  TFormComponents extends Record<string, HookComponentType<any>>,
>({
  fieldComponents,
  fieldContext,
  formContext,
  formComponents,
}: CreateFormHookProps<TComponents, TFormComponents>): CreateFormHookReturn<
  TComponents,
  TFormComponents
> {
  const FieldContextProvider = fieldContext
  const FormContextProvider = formContext

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
  ): AppFieldExtendedOctaneFormApi<
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

    // Keep children optional in the renderer-facing component props.
    const AppForm = useMemo<HookComponentType<HookPropsWithChildren<{}>>>(
      () => {
        return ({ children }) => {
          return <FormContextProvider
            value={form}
          >{children}</FormContextProvider>
        }
      },
      [form],
    )

    const AppField = useMemo(() => {
      const AppField = (({ children, ...props }) => {
        return <form.Field {...props}>
          {(field) =>
            <FieldContextProvider value={field}>{children(
              Object.assign(field, fieldComponents),
            )}</FieldContextProvider>}
        </form.Field>
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
      return AppField
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
    TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
    TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
    TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
    TSubmitMeta,
    TRenderProps extends object = {},
  >({ render, props }: WithFormProps<
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
    return function Render(innerProps) {
      return render({ ...props, ...innerProps })
    }
  }

  function withFieldGroup<
    TFieldGroupData,
    TSubmitMeta,
    TRenderProps extends object = {},
  >({ render, props, defaultValues }: WithFieldGroupProps<
    TFieldGroupData,
    TComponents,
    TFormComponents,
    TSubmitMeta,
    TRenderProps
  >): <
    TFormData,
    TFields extends | DeepKeysOfType<
        TFormData,
        TFieldGroupData | null | undefined
      >
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
  >(params: HookPropsWithChildren<
    NoInfer<TRenderProps> & {
      form: | AppFieldExtendedOctaneFormApi<
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
      | AppFieldExtendedOctaneFieldGroupApi<
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
        >;
      fields: TFields;
    }
  >) => ReturnType<HookFunctionComponent> {
    return function Render(innerProps) {
      const fieldGroupProps = useMemo(() => {
        return {
          form: innerProps.form,
          fields: innerProps.fields,
          defaultValues,
          formComponents,
        }
      }, [innerProps.form, innerProps.fields])
      const fieldGroupApi = useFieldGroup(fieldGroupProps as any)

      return render({ ...props, ...innerProps, group: fieldGroupApi as any })
    }
  }

  /**
 * ⚠️ **Use withForm whenever possible.**
 *
 * Gets a typed form from the `<form.AppForm />` context.
 */
  function useTypedAppFormContext<
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
    _props: FormOptions<
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
  ): AppFieldExtendedOctaneFormApi<
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
    const form = useFormContext()

    return form as never
  }

  function extendForm<
    TNewField extends FieldComponentExtension<TComponents>,
    TNewForm extends FormComponentExtension<TFormComponents>,
  >(extension: {
    fieldComponents?: TNewField;
    formComponents?: TNewForm;
  }): CreateFormHookReturn<
    TComponents & TNewField,
    TFormComponents & TNewForm
  > {
    return createFormHook({
      fieldContext,
      formContext,
      fieldComponents: {
        ...fieldComponents,
        ...extension.fieldComponents,
      } as TComponents & TNewField,
      formComponents: {
        ...formComponents,
        ...extension.formComponents,
      } as TFormComponents & TNewForm,
    })
  }

  return {
    useAppForm,
    withForm,
    withFieldGroup,
    useTypedAppFormContext,
    extendForm,
  } as CreateFormHookReturn<TComponents, TFormComponents>
}
