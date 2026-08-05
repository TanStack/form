import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldValidators,
  FormApiArrayMethods,
  FormApiFieldMethods,
  FormErrorTypes,
  FormState,
  ValidationIssue,
} from '@tanstack/form-core'
import type { FunctionComponent } from 'react'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type {
  ReactFormFieldProps,
  ReactFormSubscribeProps,
} from '../ReactForm/Components.public'
import type { ReadonlyAtom } from '@tanstack/react-store'

export interface FieldGroupFieldComponent<
  in out TFieldData,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  /**
   * Renders a field from this field group.
   *
   * The field name is automatically connected to the form section where the
   * field group is used.
   *
   * @example
   * ```tsx
   * const passwordFieldGroup = defineFieldGroup(({ strict }) => ({
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
   *         {(field) => (
   *           <input
   *             type="password"
   *             value={field.value}
   *             onChange={(event) => field.handleChange(event.target.value)}
   *           />
   *         )}
   *       </fields.Field>
   *       <fields.Field name="confirmPassword">
   *         {(field) => (
   *           <input
   *             type="password"
   *             value={field.value}
   *             onChange={(event) => field.handleChange(event.target.value)}
   *           />
   *         )}
   *       </fields.Field>
   *     </>
   *   )
   * }
   * ```
   */
  <const TFieldName extends DeepKeys<TFieldData>>(
    props: ReactFormFieldProps<
      TFieldData,
      TFieldName,
      DeepValue<TFieldData, TFieldName>,
      FieldValidators<
        TFieldData,
        TFieldName,
        DeepValue<TFieldData, TFieldName>
      >,
      ValidationIssue,
      unknown,
      FormErrorTypes,
      TFieldComponents
    >,
  ): CrossVersionReactNode
}

export interface FieldGroupArrayFieldComponent<
  in out TFieldData,
  in out TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  /**
   * Renders an array field from this field group.
   *
   * The field name is automatically connected to the form section where the
   * field group is used.
   *
   * @example
   * ```tsx
   * const contactFieldGroup = defineFieldGroup(({ strict }) => ({
   *   emails: strict<Array<{ value: string }>>(),
   * }))
   *
   * interface ContactFieldsProps {
   *   fields: typeof contactFieldGroup.fields
   * }
   *
   * function ContactFields({ fields }: ContactFieldsProps) {
   *   return (
   *     <fields.ArrayField name="emails">
   *       {(emails) => (
   *         <>
   *           {emails.value.map((_, index) => (
   *             <fields.Field key={index} name={`emails[${index}].value`}>
   *               {(field) => (
   *                 <input
   *                   value={field.value}
   *                   onChange={(event) =>
   *                     field.handleChange(event.target.value)
   *                   }
   *                 />
   *               )}
   *             </fields.Field>
   *           ))}
   *         </>
   *       )}
   *     </fields.ArrayField>
   *   )
   * }
   * ```
   */
  <const TFieldName extends DeepKeysWhereValueIncludes<TFieldData, Array<any>>>(
    props: ReactFormFieldProps<
      TFieldData,
      TFieldName,
      DeepValue<TFieldData, TFieldName>,
      FieldValidators<
        TFieldData,
        TFieldName,
        DeepValue<TFieldData, TFieldName>
      >,
      ValidationIssue,
      unknown,
      FormErrorTypes,
      TFieldComponents
    >,
  ): CrossVersionReactNode
}

export type FieldGroupSubscribeProps<TSelected> = ReactFormSubscribeProps<
  unknown,
  FormErrorTypes,
  TSelected
>

/**
 * Reads form state from inside a field-group component.
 *
 * Because a field group can be used with different forms, `state.values`
 * cannot be safely typed here and is provided as `unknown`.
 *
 * To read values from this field group, use its `atom` with `useSelector`
 * instead.
 *
 * @example
 * ```tsx
 * <fields.Subscribe selector={(state) => state.submissionAttempts}>
 *   {(submissionAttempts) => (
 *     <span>Submit attempts: {submissionAttempts}</span>
 *   )}
 * </fields.Subscribe>
 * ```
 */
export type FieldGroupSubscribeComponent = <TSelected>(
  props: FieldGroupSubscribeProps<TSelected>,
) => CrossVersionReactNode

export interface FieldGroupApi<
  in out TFieldData,
  in out TFieldComponents extends Record<string, FunctionComponent<any>> =
    Record<never, never>,
>
  extends FormApiFieldMethods<TFieldData>, FormApiArrayMethods<TFieldData> {
  atom: ReadonlyAtom<TFieldData>
  Field: FieldGroupFieldComponent<TFieldData, TFieldComponents>
  ArrayField: FieldGroupArrayFieldComponent<TFieldData, TFieldComponents>
  Subscribe: FieldGroupSubscribeComponent
}

export type AnyFieldGroupApi = FieldGroupApi<
  any,
  Record<string, FunctionComponent<any>>
>

export type FieldGroupFormState = FormState<unknown, FormErrorTypes>
