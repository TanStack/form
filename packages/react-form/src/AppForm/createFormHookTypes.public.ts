import type { AppFormOptionsApi } from './appFormOptions.public'
import type { AnyReactFormComponentMap } from './componentMap.public'
import type { ReactAppFormApi } from './ReactAppFormApi.public'
import type { DefineFieldGroupFn } from '../FieldGroup/withFields.public'
import type {
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'

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

export interface AppFormHookResult<
  in out TComponents extends AnyReactFormComponentMap,
> {
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
  useAppForm: UseAppFormHook<TComponents>
  useFormContext: () => ReactAppFormApi<any, any, TComponents>
}
