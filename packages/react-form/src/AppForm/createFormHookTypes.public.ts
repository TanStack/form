import type { AppFormOptionsApi } from './appFormOptions.public'
import type {
  AnyReactFormComponentMap,
  ReactFormComponentMap,
} from './componentMap.public'
import type { ReactAppFormApi } from './ReactAppFormApi.public'
import type { DefineFieldGroupFn } from '../FieldGroup/withFields.public'
import type { FunctionComponent } from 'react'
import type {
  DefaultFieldOptions,
  DefaultFormGroupOptions,
  DefaultFormOptions,
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'

/**
 * Configures the components and reusable defaults returned by
 * `createFormHook`.
 *
 * Default objects are resolved by form core before the corresponding
 * usage-site options. Non-listener properties always take precedence,
 * including when explicitly set to `undefined`. Listener arrays follow the
 * configured `listenersMerge` strategy.
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
   * Non-listener options passed to `useAppForm` override these defaults,
   * including when explicitly set to `undefined`. Listener arrays follow
   * `listenersMerge`.
   *
   * @example
   * ```tsx
   * defaultFormOptions: {
   *   errorVisibility: ({ state }) => state.submissionAttempts > 0,
   * },
   * ```
   */
  defaultFormOptions?: DefaultFormOptions
  /**
   * Defaults for every field and array-field component owned by the form.
   *
   * Non-listener options passed to the component override these defaults,
   * including when explicitly set to `undefined`. Listener arrays follow
   * `listenersMerge`. This includes `group.Field` and `group.ArrayField`.
   *
   * @example
   * ```tsx
   * defaultFieldOptions: {
   *   errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
   * },
   * ```
   */
  defaultFieldOptions?: DefaultFieldOptions
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
  defaultFormGroupOptions?: DefaultFormGroupOptions
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
