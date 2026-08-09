import { defineFieldGroupRuntime } from './withFields.lib'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FormApi,
} from '@tanstack/form-core'
import type { FunctionComponent, ReactNode } from 'react'
import type { ReactTanStackFormComponents } from '../ReactForm/Components.public'
import type { FieldGroupApi } from './FieldGroupApi.public'

declare const fieldGroupFieldSlotValueSymbol: unique symbol
declare const fieldGroupFieldsSymbol: unique symbol

export type FieldGroupFieldSlotMode = 'strict' | 'loose'

export interface FieldGroupFieldSlot<
  out TValue,
  out TMode extends FieldGroupFieldSlotMode = FieldGroupFieldSlotMode,
> {
  readonly mode: TMode
  readonly [fieldGroupFieldSlotValueSymbol]: TValue
}

export type AnyFieldGroupFieldSlot = FieldGroupFieldSlot<any>

export type StrictFieldGroupFieldSlot<TValue> = FieldGroupFieldSlot<
  TValue,
  'strict'
>

export type LooseFieldGroupFieldSlot<TValue> = FieldGroupFieldSlot<
  TValue,
  'loose'
>

export type FieldGroupFieldSlotValue<TSlot> =
  TSlot extends FieldGroupFieldSlot<infer TValue> ? TValue : never

export type FieldGroupFieldSlotModeOf<TSlot> =
  TSlot extends FieldGroupFieldSlot<any, infer TMode> ? TMode : never

type IsSame<TTypeA, TTypeB> = [TTypeA] extends [TTypeB]
  ? [TTypeB] extends [TTypeA]
    ? true
    : false
  : false

export type FieldGroupFieldSlotAllows<TSlot, TValue> =
  TSlot extends FieldGroupFieldSlot<infer TAcceptedValue, infer TMode>
    ? TMode extends 'strict'
      ? IsSame<TValue, TAcceptedValue>
      : [TValue] extends [TAcceptedValue]
        ? true
        : false
    : false

export type FieldGroupFieldNameForSlot<
  TFieldData,
  TSlot extends AnyFieldGroupFieldSlot,
> = {
  [TFieldName in DeepKeys<TFieldData>]: FieldGroupFieldSlotAllows<
    TSlot,
    DeepValue<TFieldData, TFieldName>
  > extends true
    ? TFieldName
    : never
}[DeepKeys<TFieldData>]

export type FieldGroupFields = Record<string, AnyFieldGroupFieldSlot>

export type FieldGroupFieldNames<
  TFieldData,
  TFields extends FieldGroupFields,
> = {
  [TFieldName in keyof TFields]: FieldGroupFieldNameForSlot<
    TFieldData,
    TFields[TFieldName]
  >
}

export type FieldGroupFieldData<TFields extends FieldGroupFields> = {
  [
    TFieldName in keyof TFields
  ]: TFields[TFieldName] extends FieldGroupFieldSlot<infer TValue, any>
    ? TValue
    : never
}

export type FieldGroupFieldsOf<TFieldGroup> = TFieldGroup extends {
  readonly [fieldGroupFieldsSymbol]: infer TFields
}
  ? TFields
  : never

export type ReactFieldGroup<
  TFields extends FieldGroupFields,
  TFieldComponents extends Record<string, FunctionComponent<any>> = Record<
    never,
    never
  >,
> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & {
  readonly [fieldGroupFieldsSymbol]: TFields
}

export type FieldGroupFieldComponentsOf<TFieldGroup> =
  TFieldGroup extends ReactFieldGroup<any, infer TFieldComponents>
    ? TFieldComponents
    : never

export type FieldGroupForm<
  TFieldComponents extends Record<string, FunctionComponent<any>> = Record<
    never,
    never
  >,
  TFormData = any,
> = FormApi<TFormData, any> &
  ReactTanStackFormComponents<TFormData, any, TFieldComponents>

export type FieldGroupFieldBindingForSlot<
  TFormData,
  TSlot extends AnyFieldGroupFieldSlot,
> =
  TSlot extends FieldGroupFieldSlot<infer TValue, infer TMode>
    ? TMode extends 'strict'
      ? FieldGroupFieldNameForSlot<TFormData, TSlot>
      : DeepKeysWhereValueIncludes<TFormData, TValue>
    : never

export type FieldGroupFieldBindings<
  TFields extends FieldGroupFields,
  TFormData = any,
> = {
  [TFieldName in keyof TFields]: FieldGroupFieldBindingForSlot<
    TFormData,
    TFields[TFieldName]
  >
}

export type FieldGroupFieldBindingsOf<TFieldGroup, TFormData> =
  FieldGroupFieldsOf<TFieldGroup> extends FieldGroupFields
    ? FieldGroupFieldBindings<FieldGroupFieldsOf<TFieldGroup>, TFormData>
    : never

export type FieldGroupFieldsPropName<
  TProps,
  TFieldGroup extends ReactFieldGroup<any, any>,
> = {
  [TPropName in keyof TProps]-?: IsSame<
    TProps[TPropName],
    TFieldGroup
  > extends true
    ? TPropName
    : never
}[keyof TProps]

/**
 * Wraps a component that accepts a field-group API and returns a component
 * that accepts a form plus virtual-to-concrete field bindings.
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
  } & {
    [TPropName in TFieldsPropName]: FieldGroupFieldBindingsOf<
      TFieldGroup,
      TFormData
    >
  },
) => ReactNode

export interface FieldGroupHelper {
  /**
   * Declares a virtual field whose value type must exactly match the value type
   * of the concrete form field it binds to.
   *
   * @example
   * ```tsx
   * const passwordFieldGroup = defineFieldGroup(({ strict }) => ({
   *   password: strict<string>(),
   *   confirmPassword: strict<string>(),
   * }))
   * ```
   */
  strict: <TValue>() => StrictFieldGroupFieldSlot<TValue>
  /**
   * Declares a virtual field that can bind to form fields with an overlapping
   * non-nullish value type instead of requiring an exact type match.
   *
   * @example
   * ```tsx
   * const passwordFieldGroup = defineFieldGroup(({ loose }) => ({
   *   password: loose<string>(),
   *   confirmPassword: loose<string>(),
   * }))
   * ```
   */
  loose: <TValue>() => LooseFieldGroupFieldSlot<TValue>
}

export interface FieldGroupDefinition<
  TFields extends FieldGroupFields,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
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
   * injected field-group API prop. It adds a `form` prop and reuses the injected
   * prop name for the virtual-to-concrete field binding map.
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
export type DefineFieldGroupFn<
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <const TFields extends FieldGroupFields>(
  defineFn: (helper: FieldGroupHelper) => TFields,
) => FieldGroupDefinition<TFields, TFieldComponents>

/**
 * Defines a reusable group of virtual fields that can be bound to concrete
 * paths in different parent forms.
 *
 * Use `strict` when a binding must have exactly the declared value type. Use
 * `loose` when bindings may have an overlapping non-nullish value type.
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
