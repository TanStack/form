import type { AppFormOptionsApi } from './appFormOptions.public'
import type {
  AnyReactFormComponentMap,
  ReactFormComponentMap,
} from './componentMap.public'
import type { ReactAppFormApi } from './ReactAppFormApi.public'
import type { DefineFieldGroupFn } from '../FieldGroup/withFields.public'
import type { FunctionComponent } from 'react'
import type {
  FieldApiOptions,
  FieldValidators,
  FormErrorTypes,
  FormGroupOptions,
  FormGroupValidators,
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'

/**
 * Form defaults that do not participate in form value inference.
 *
 * This type is limited to `formId`, `errorVisibility`, `listeners`,
 * `serverState`, and `onSubmitInvalid`. Callback contexts expose form values
 * as `unknown`, so value-dependent behavior remains local to `useAppForm`.
 * Options passed to `useAppForm` override these defaults, including when an
 * option is explicitly `undefined`.
 *
 * @example
 * ```tsx
 * const { useAppForm } = createFormHook({
 *   formComponents: {},
 *   fieldComponents: {},
 *   defaultFormOptions: {
 *     errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
 *     onSubmitInvalid: () => {
 *       document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
 *     },
 *   },
 * })
 * ```
 */
export type CreateFormHookDefaultFormOptions = Pick<
  FormOptions<unknown, FormValidators<unknown>, unknown>,
  'formId' | 'errorVisibility' | 'listeners' | 'serverState' | 'onSubmitInvalid'
>

/**
 * Direct field defaults that do not participate in field value inference.
 *
 * This type is limited to `errorVisibility`, `errorBoundary`, and `listeners`.
 * Listener contexts expose form and field values as `unknown`, and callbacks
 * do not receive the concrete value types inferred by the consuming field
 * component. Options passed to a direct `form.Field` or `form.ArrayField`
 * override these defaults, including when an option is explicitly
 * `undefined`.
 *
 * @example
 * ```tsx
 * const { useAppForm } = createFormHook({
 *   formComponents: {},
 *   fieldComponents: {},
 *   defaultFieldOptions: {
 *     errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
 *     errorBoundary: true,
 *   },
 * })
 * ```
 */
export type CreateFormHookDefaultFieldOptions = Pick<
  FieldApiOptions<
    unknown,
    string,
    unknown,
    FieldValidators<unknown, string, unknown>,
    never,
    unknown,
    FormErrorTypes
  >,
  'errorVisibility' | 'errorBoundary' | 'listeners'
>

/**
 * Form group defaults that do not participate in group value inference.
 *
 * This type is limited to `onSubmitInvalid`. Its callback context exposes the
 * form and group values as `unknown`, so value-dependent behavior remains
 * local to the `form.FormGroup` component. Options passed to
 * `form.FormGroup` override these defaults, including when an option is
 * explicitly `undefined`.
 *
 * @example
 * ```tsx
 * const { useAppForm } = createFormHook({
 *   formComponents: {},
 *   fieldComponents: {},
 *   defaultFormGroupOptions: {
 *     onSubmitInvalid: ({ groupApi }) => {
 *       console.error('Invalid group', groupApi.name)
 *     },
 *   },
 * })
 * ```
 */
export type CreateFormHookDefaultFormGroupOptions = Pick<
  FormGroupOptions<
    unknown,
    string,
    unknown,
    FormGroupValidators<unknown>,
    FormErrorTypes
  >,
  'onSubmitInvalid'
>

/**
 * Configures the components and reusable defaults returned by
 * `createFormHook`.
 *
 * Default objects are shallowly applied before the corresponding usage-site
 * options. A usage-site property always takes precedence, including when its
 * value is explicitly `undefined`.
 *
 * @example
 * ```tsx
 * const { useAppForm } = createFormHook({
 *   formComponents: {},
 *   fieldComponents: {
 *     TextField,
 *   },
 *   defaultFormOptions: {
 *     errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
 *   },
 *   defaultFieldOptions: {
 *     errorBoundary: true,
 *   },
 * })
 * ```
 *
 * @typeParam TFormComponents - Library-managed. Do not specify explicitly.
 * @typeParam TFieldComponents - Library-managed. Do not specify explicitly.
 */
export interface CreateFormHookOptions<
  in out TFormComponents extends Record<string, FunctionComponent<any>>,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends ReactFormComponentMap<TFormComponents, TFieldComponents> {
  /**
   * Defaults for every form created by `useAppForm`.
   *
   * Options passed to `useAppForm` override these defaults, including when an
   * option is explicitly `undefined`.
   *
   * @example
   * ```tsx
   * defaultFormOptions: {
   *   errorVisibility: ({ state }) => state.submissionAttempts > 0,
   * },
   * ```
   */
  defaultFormOptions?: CreateFormHookDefaultFormOptions
  /**
   * Defaults for direct `form.Field` and `form.ArrayField` components.
   *
   * Options passed to the component override these defaults, including when
   * an option is explicitly `undefined`. These defaults do not apply to
   * `group.Field` or `group.ArrayField`.
   *
   * @example
   * ```tsx
   * defaultFieldOptions: {
   *   errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
   * },
   * ```
   */
  defaultFieldOptions?: CreateFormHookDefaultFieldOptions
  /**
   * Defaults for every `form.FormGroup` component.
   *
   * Options passed to the component override these defaults, including when
   * an option is explicitly `undefined`.
   *
   * @example
   * ```tsx
   * defaultFormGroupOptions: {
   *   onSubmitInvalid: ({ groupApi }) => {
   *     console.error('Invalid group', groupApi.name)
   *   },
   * },
   * ```
   */
  defaultFormGroupOptions?: CreateFormHookDefaultFormGroupOptions
}

export type UseAppFormHook<
  in out TComponents extends AnyReactFormComponentMap,
> = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactAppFormApi<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>,
  TComponents
>

/**
 * App Form hooks and helpers bound to the components registered with
 * `createFormHook`.
 *
 * @typeParam TComponents - Library-managed. Do not specify explicitly.
 */
export interface AppFormHookResult<
  in out TComponents extends AnyReactFormComponentMap,
> {
  /**
   * Defines reusable form options that retain the components registered with
   * `createFormHook`.
   *
   * Use the result with `ReactFormType` when a child component needs the type
   * of one known App Form, including its registered field and form components.
   *
   * @example
   * ```tsx
   * const profileOptions = appFormOptions({
   *   defaultValues: { name: '' },
   * })
   *
   * type ProfileForm = ReactFormType<typeof profileOptions>
   *
   * function NameField({ form }: { form: ProfileForm }) {
   *   return (
   *     <form.Field name="name">
   *       {(field) => <field.TextField label="Name" />}
   *     </form.Field>
   *   )
   * }
   * ```
   */
  appFormOptions: AppFormOptionsApi<TComponents>
  /**
   * Defines a field group whose fields expose the field components registered
   * with `createFormHook`.
   *
   * @example
   * ```tsx
   * const { defineAppFieldGroup } = createFormHook({
   *   fieldComponents: {
   *     TextField,
   *   },
   *   formComponents: {},
   * })
   *
   * const passwordFieldGroup = defineAppFieldGroup(({ strict }) => ({
   *   password: strict<string>(),
   *   confirmPassword: strict<string>(),
   * }))
   *
   * interface PasswordFieldsProps {
   *   fields: typeof passwordFieldGroup.fields
   * }
   *
   * function PasswordFields({ fields }: PasswordFieldsProps) {
   *   return (
   *     <>
   *       <fields.Field name="password">
   *         {(field) => <field.TextField label="Password" />}
   *       </fields.Field>
   *       <fields.Field name="confirmPassword">
   *         {(field) => (
   *           <field.TextField label="Confirm password" />
   *         )}
   *       </fields.Field>
   *     </>
   *   )
   * }
   * ```
   */
  defineAppFieldGroup: DefineFieldGroupFn<TComponents['fieldComponents']>
  /**
   * Creates a React form API extended with the field and form components
   * registered with `createFormHook`.
   *
   * Form data, validators, and submission results are inferred from the passed
   * options.
   *
   * @example
   * ```tsx
   * function ProfileForm() {
   *   const form = useAppForm({
   *     defaultValues: { name: '' },
   *   })
   *
   *   return (
   *     <form.AppForm>
   *       <form.Field name="name">
   *         {(field) => <field.TextField label="Name" />}
   *       </form.Field>
   *     </form.AppForm>
   *   )
   * }
   * ```
   */
  useAppForm: UseAppFormHook<TComponents>
  /**
   * Reads the current App Form API from the nearest `form.AppForm` provider.
   *
   * Use this hook inside form components registered with `createFormHook`. It
   * throws when called outside a `form.AppForm` subtree.
   *
   * @example
   * ```tsx
   * function SubmitButton({ label }: { label: string }) {
   *   const form = useFormContext()
   *
   *   return (
   *     <form.Subscribe selector={(state) => state.isSubmitting}>
   *       {(isSubmitting) => (
   *         <button type="submit" disabled={isSubmitting}>
   *           {label}
   *         </button>
   *       )}
   *     </form.Subscribe>
   *   )
   * }
   * ```
   */
  useFormContext: () => ReactAppFormApi<any, any, TComponents>
}
