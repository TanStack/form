import type { AppFormOptionsApi } from './appFormOptions.public'
import type { AnyPreactFormComponentMap } from './componentMap.public'
import type { PreactAppFormApi } from './PreactAppFormApi.public'
import type { DefineFieldGroupFn } from '../FieldGroup/withFields.public'
import type {
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'

export type UseAppFormHook<
  in out TComponents extends AnyPreactFormComponentMap,
> = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => PreactAppFormApi<
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
  in out TComponents extends AnyPreactFormComponentMap,
> {
  /**
   * Defines reusable form options that retain the components registered with
   * `createFormHook`.
   *
   * Use the result with `PreactFormType` when a child component needs the type
   * of one known App Form, including its registered field and form components.
   *
   * @example
   * ```tsx
   * const profileOptions = appFormOptions({
   *   defaultValues: { name: '' },
   * })
   *
   * type ProfileForm = PreactFormType<typeof profileOptions>
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
   * Defines a reusable field group whose fields expose the field components
   * registered with `createFormHook`.
   *
   * @example
   * ```tsx
   * const contactFields = defineAppFieldGroup(({ strict }) => ({
   *   name: strict<string>(),
   *   email: strict<string>(),
   * }))
   *
   * function ContactFields({
   *   fields,
   * }: {
   *   fields: typeof contactFields.fields
   * }) {
   *   return (
   *     <fields.Field name="name">
   *       {(field) => <field.TextField label="Name" />}
   *     </fields.Field>
   *   )
   * }
   * ```
   */
  defineAppFieldGroup: DefineFieldGroupFn<TComponents['fieldComponents']>
  /**
   * Creates a Preact form API extended with the field and form components
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
  useFormContext: () => PreactAppFormApi<any, any, TComponents>
}
