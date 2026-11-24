import { formOptions } from '@tanstack/form-core'
import { useInternalForm } from '../ReactForm/ReactFormApi.lib'
import { defineFieldGroup } from '../FieldGroup/withFields.public'
import { createAppFormInitializer } from './initializeAppForm.lib'
import type {
  BoundFormComponents,
  CompatibleFormComponents,
} from './helpers/formComponent.public'
import type {
  AnyReactFormComponentMap,
  ReactComponentTree,
  ReactFormComponents,
} from './componentMap.public'
import type { ReactFormApi } from '../ReactForm/formApiTypes.public'
import type { DefineFieldGroupFn } from '../FieldGroup/withFields.public'
import type {
  DefaultFieldOptions,
  DefaultFormGroupOptions,
  DefaultFormOptions,
  FormOptions,
  FormOptionsApi,
  GetFormErrorTypes,
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
 *   formComponents: {
 *     SubmitButton,
 *   },
 *   fieldComponents: {
 *     inputs: {
 *       TextField,
 *     },
 *   },
 *   defaultFormOptions: {
 *     errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
 *   },
 *   defaultFieldOptions: {
 *     errorBoundary: true,
 *   },
 * })
 *
 * // Form components are flat; field components retain their namespaces:
 * // <form.SubmitButton />
 * // <field.inputs.TextField />
 * ```
 *
 * @typeParam TFormComponents - Library-managed. Do not specify explicitly.
 * @typeParam TFieldComponents - Library-managed. Do not specify explicitly.
 */
export interface CreateFormHookOptions<
  in out TFormComponents extends ReactFormComponents,
  in out TFieldComponents extends ReactComponentTree,
> {
  formComponents: TFormComponents &
    CompatibleFormComponents<
      NoInfer<TFormComponents>,
      TFormComponents,
      TFieldComponents
    >
  fieldComponents: TFieldComponents
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
  const TValidatorConfig extends unknown[],
  TValidators,
  TSubmitReturn,
>(
  options: FormOptions<
    TFormData,
    TValidatorConfig,
    TValidators,
    TSubmitReturn,
    unknown
  >,
) => ReactFormApi<
  TFormData,
  GetFormErrorTypes<TValidators, TSubmitReturn>,
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
  appFormOptions: FormOptionsApi<TComponents>
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
   *     <form.Field name="name">
   *       {(field) => <field.TextField label="Name" />}
   *     </form.Field>
   *   )
   * }
   * ```
   */
  useAppForm: UseAppFormHook<TComponents>
}

export function createFormHook<
  const TFormComponents extends ReactFormComponents,
  const TFieldComponents extends ReactComponentTree,
>(
  createOptions: CreateFormHookOptions<TFormComponents, TFieldComponents>,
): AppFormHookResult<{
  formComponents: BoundFormComponents<TFormComponents>
  fieldComponents: TFieldComponents
}> {
  const initializeAppForm = createAppFormInitializer(createOptions)

  function useExtendedForm(
    hookOptions: FormOptions<any, any, any, any, unknown>,
  ) {
    const form = useInternalForm(hookOptions, initializeAppForm)
    return form
  }
  const useAppForm = useExtendedForm as never as UseAppFormHook<{
    formComponents: BoundFormComponents<TFormComponents>
    fieldComponents: TFieldComponents
  }>

  return {
    appFormOptions: formOptions as never,
    defineAppFieldGroup: defineFieldGroup as never,
    useAppForm,
  }
}
