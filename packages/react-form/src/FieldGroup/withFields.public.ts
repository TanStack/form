import { defineFieldGroupRuntime } from './withFields.lib'
import type {
  FieldGroupFieldBindings,
  FieldGroupFieldBindingsProps,
  FieldGroupFieldData,
  FieldGroupFields,
  FieldGroupFieldsPropName,
  FieldGroupHelper,
  FormApi,
} from '@tanstack/form-core'
import type { ReactNode } from 'react'
import type { ReactTanStackFormComponents } from '../ReactForm/Components.public'
import type { FieldGroupApi } from './FieldGroupApi.public'
import type { ReactComponentTree } from '../AppForm/componentMap.public'

declare const fieldGroupFieldsSymbol: unique symbol

export type FieldGroupFieldsOf<TFieldGroup> = TFieldGroup extends {
  readonly [fieldGroupFieldsSymbol]: infer TFields extends FieldGroupFields
}
  ? TFields
  : never

export type ReactFieldGroup<
  TFields extends FieldGroupFields,
  TFieldComponents extends ReactComponentTree = Record<never, never>,
> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & {
  readonly [fieldGroupFieldsSymbol]: TFields
}

export type FieldGroupFieldComponentsOf<TFieldGroup> =
  TFieldGroup extends ReactFieldGroup<any, infer TFieldComponents>
    ? TFieldComponents
    : never

export type FieldGroupForm<
  TFieldComponents extends ReactComponentTree = Record<never, never>,
  TFormData = any,
> = FormApi<TFormData, any> &
  ReactTanStackFormComponents<TFormData, any, TFieldComponents>

export type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> =
  FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields
    ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData>
    : never

/**
 * Wraps a component that accepts a field-group API and returns a component
 * that accepts a form and, when needed, virtual-to-concrete field bindings.
 *
 * If every virtual field name is already a compatible path in the form, the
 * returned component binds those paths automatically when the bindings prop is
 * omitted. A complete bindings map can still reroute them. Otherwise, the
 * bindings prop is required.
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
 *   // ...
 * }
 *
 * const PasswordSection = passwordFieldGroup.bindComponent(
 *   PasswordFields,
 *   'fields',
 * )
 *
 * function AccountForm() {
 *   const form = useForm({
 *     defaultValues: {
 *       account: {
 *         password: '',
 *         confirmPassword: '',
 *       },
 *     },
 *   })
 *
 *   return (
 *     <PasswordSection
 *       form={form}
 *       fields={{
 *         password: 'account.password',
 *         confirmPassword: 'account.confirmPassword',
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @typeParam TFieldGroup - Library-managed. Do not specify explicitly.
 */
export type FieldGroupWithFieldsFn<
  TFieldGroup extends ReactFieldGroup<any, any>,
> = <
  TProps extends object,
  TFieldsPropName extends FieldGroupFieldsPropName<TProps, TFieldGroup>,
>(
  Component: (props: TProps) => ReactNode,
  fieldsPropName: TFieldsPropName,
) => <TFormData>(
  props: Omit<TProps, TFieldsPropName | 'form'> & {
    form: FieldGroupForm<FieldGroupFieldComponentsOf<TFieldGroup>, TFormData>
  } & FieldGroupFieldBindingsProps<
      FieldGroupFieldsOf<TFieldGroup>,
      TFormData,
      TFieldsPropName
    >,
) => ReactNode

export interface FieldGroupDefinition<
  TFields extends FieldGroupFields,
  TFieldComponents extends ReactComponentTree,
> {
  /**
   * The virtual field-group API injected into the component passed to
   * `bindComponent`.
   */
  fields: ReactFieldGroup<TFields, TFieldComponents>
  /**
   * Binds a component's field-group API prop to concrete paths in a parent
   * form.
   *
   * The returned component accepts the original component props except for the
   * injected field-group API prop and adds a `form` prop. When every virtual
   * field name is already a compatible form path, those paths bind
   * automatically when the bindings prop is omitted. A complete bindings map
   * can still reroute them. Otherwise, the injected prop name is reused for the
   * required virtual-to-concrete field binding map.
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
   *   legend: string
   * }
   *
   * function PasswordFields({ fields, legend }: PasswordFieldsProps) {
   *   return (
   *     <fieldset>
   *       <legend>{legend}</legend>
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
   *     </fieldset>
   *   )
   * }
   *
   * const PasswordSection = passwordFieldGroup.bindComponent(
   *   PasswordFields,
   *   'fields',
   * )
   *
   * <PasswordSection
   *   form={form}
   *   legend="Choose a password"
   *   fields={{
   *     password: 'account.password',
   *     confirmPassword: 'account.confirmPassword',
   *   }}
   * />
   * ```
   */
  bindComponent: FieldGroupWithFieldsFn<
    ReactFieldGroup<TFields, TFieldComponents>
  >
}

/**
 * Signature shared by `defineFieldGroup` and app-form field-group definers.
 */
export type DefineFieldGroupFn<TFieldComponents extends ReactComponentTree> = <
  const TFields extends FieldGroupFields,
>(
  defineFn: (helper: FieldGroupHelper) => TFields,
) => FieldGroupDefinition<TFields, TFieldComponents>

/**
 * Defines a reusable group of virtual fields that can be bound to concrete
 * paths in different parent forms.
 *
 * Use `strict` when a binding must have exactly the declared value type. Use
 * `loose` when a binding may have the declared type or a narrower assignable
 * type.
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
 *
 * export const PasswordSection = passwordFieldGroup.bindComponent(
 *   PasswordFields,
 *   'fields',
 * )
 * ```
 */
export const defineFieldGroup: DefineFieldGroupFn<Record<never, never>> =
  defineFieldGroupRuntime as never
