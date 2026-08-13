import { brandComponentFactory, wrapField } from './fieldComponentHelpers.lib'
import type { FieldWithValue } from '@tanstack/form-core'
import type { ReactNode } from 'react'

type ExactFieldBrand<out TValue> = {
  readonly __tanstackFieldExactType: TValue
}

type AcceptsFieldBrand<out TAcceptedValue> = {
  readonly __tanstackFieldAcceptsType: TAcceptedValue
}

type AnyFieldComponent = (props: any) => ReactNode

type PropsOf<TComponent> = TComponent extends (props: infer TProps) => ReactNode
  ? TProps
  : never

type FieldValuePropKeys<TProps> = {
  [K in keyof TProps]-?: TProps[K] extends FieldWithValue<any> ? K : never
}[keyof TProps]

type FieldValueFromProp<TProp> =
  TProp extends FieldWithValue<infer TValue> ? TValue : never

type FieldValueFromComponentProp<
  TProps,
  TFieldPropKey extends keyof TProps,
> = FieldValueFromProp<TProps[TFieldPropKey]>

type PublicPropsReplacingField<
  TProps,
  TFieldPropKey extends keyof TProps,
> = Omit<TProps, TFieldPropKey>

type StrictInjectedFieldComponent<
  TComponent extends AnyFieldComponent,
  TProps = PropsOf<TComponent>,
  TFieldPropKey extends FieldValuePropKeys<TProps> = FieldValuePropKeys<TProps>,
> = ((
  props: PublicPropsReplacingField<TProps, TFieldPropKey>,
) => React.ReactNode) &
  ExactFieldBrand<FieldValueFromComponentProp<TProps, TFieldPropKey>>

type LooseInjectedFieldComponent<
  TComponent extends AnyFieldComponent,
  TProps = PropsOf<TComponent>,
  TFieldPropKey extends FieldValuePropKeys<TProps> = FieldValuePropKeys<TProps>,
> = ((
  props: PublicPropsReplacingField<TProps, TFieldPropKey>,
) => React.ReactNode) &
  AcceptsFieldBrand<FieldValueFromComponentProp<TProps, TFieldPropKey>>

type StrictBrandedFieldComponent<
  TComponent extends AnyFieldComponent,
  TValue,
> = TComponent & ExactFieldBrand<TValue>

type LooseBrandedFieldComponent<
  TComponent extends AnyFieldComponent,
  TAcceptedValue,
> = TComponent & AcceptsFieldBrand<TAcceptedValue>

/**
 * Wraps components that accept a field API prop so App Form can supply that
 * prop from field context.
 */
export interface FieldComponentHelper {
  /**
   * Wraps a component for fields whose value type exactly matches the value
   * type of its field API prop.
   *
   * The returned component omits `fieldPropKey` from its public props and reads
   * that field API from the nearest App Form field context. It must be rendered
   * beneath an App Form `Field` or field-group `Field` component.
   *
   * @example
   * ```tsx
   * import { getFormHookHelpers } from '@tanstack/react-form'
   * import type { FieldWithValue } from '@tanstack/react-form'
   *
   * function TextInput({
   *   field,
   *   label,
   * }: {
   *   field: FieldWithValue<string>
   *   label: string
   * }) {
   *   return (
   *     <label>
   *       {label}
   *       <input
   *         value={field.value}
   *         onChange={(event) => field.handleChange(event.target.value)}
   *       />
   *     </label>
   *   )
   * }
   *
   * const { fieldComponent } = getFormHookHelpers()
   * const TextField = fieldComponent.strict(TextInput, 'field')
   * ```
   *
   * @param Component - The component whose field API prop should be injected.
   * @param fieldPropKey - The prop that accepts the current field API.
   * @typeParam TComponent - Library-managed. Do not specify explicitly.
   * @typeParam TProps - Library-managed. Do not specify explicitly.
   * @typeParam TFieldPropKey - Library-managed. Do not specify explicitly.
   */
  strict: <
    TComponent extends AnyFieldComponent,
    TProps = PropsOf<TComponent>,
    TFieldPropKey extends FieldValuePropKeys<TProps> =
      FieldValuePropKeys<TProps>,
  >(
    Component: TComponent,
    fieldPropKey: TFieldPropKey,
  ) => StrictInjectedFieldComponent<TComponent, TProps, TFieldPropKey>

  /**
   * Wraps a component for fields whose value type is assignable to the value
   * type accepted by its field API prop.
   *
   * The returned component omits `fieldPropKey` from its public props and reads
   * that field API from the nearest App Form field context. Use this mode for a
   * component that intentionally supports a broader range of field values.
   *
   * @example
   * ```tsx
   * import { getFormHookHelpers } from '@tanstack/react-form'
   * import type { AnyFieldApi } from '@tanstack/react-form'
   *
   * function FieldErrors({ field }: { field: AnyFieldApi }) {
   *   return <span>{field.errors.map((error) => error.message).join(', ')}</span>
   * }
   *
   * const { fieldComponent } = getFormHookHelpers()
   * const Errors = fieldComponent.loose(FieldErrors, 'field')
   * ```
   *
   * @param Component - The component whose field API prop should be injected.
   * @param fieldPropKey - The prop that accepts the current field API.
   * @typeParam TComponent - Library-managed. Do not specify explicitly.
   * @typeParam TProps - Library-managed. Do not specify explicitly.
   * @typeParam TFieldPropKey - Library-managed. Do not specify explicitly.
   */
  loose: <
    TComponent extends AnyFieldComponent,
    TProps = PropsOf<TComponent>,
    TFieldPropKey extends FieldValuePropKeys<TProps> =
      FieldValuePropKeys<TProps>,
  >(
    Component: TComponent,
    fieldPropKey: TFieldPropKey,
  ) => LooseInjectedFieldComponent<TComponent, TProps, TFieldPropKey>
}

/**
 * Adds field-value compatibility metadata to components without wrapping them
 * or changing their runtime props.
 */
export interface FieldBrandHelper {
  /**
   * Brands a component for fields whose value type exactly matches `TValue`.
   *
   * The returned value is the original component at runtime. Unlike
   * `fieldComponent.strict`, this helper does not inject a field API prop.
   *
   * @example
   * ```tsx
   * import { getFormHookHelpers } from '@tanstack/react-form'
   *
   * function Adornment() {
   *   return <span>Required</span>
   * }
   *
   * const { fieldBrand } = getFormHookHelpers()
   * const StringAdornment = fieldBrand.strict<string>()(Adornment)
   * ```
   *
   * @typeParam TValue - The exact field value type that exposes the component.
   * @typeParam TComponent - Library-managed. Do not specify explicitly.
   */
  strict: <TValue>() => <TComponent extends AnyFieldComponent>(
    Component: TComponent,
  ) => StrictBrandedFieldComponent<TComponent, TValue>

  /**
   * Brands a component for fields whose value type is assignable to
   * `TValue`.
   *
   * The returned value is the original component at runtime. Unlike
   * `fieldComponent.loose`, this helper does not inject a field API prop.
   *
   * @example
   * ```tsx
   * import { getFormHookHelpers } from '@tanstack/react-form'
   *
   * function FieldDescription() {
   *   return <span>Changes are saved automatically.</span>
   * }
   *
   * const { fieldBrand } = getFormHookHelpers()
   * const Description = fieldBrand.loose<unknown>()(FieldDescription)
   * ```
   *
   * @typeParam TValue - The field value type accepted by the component.
   * @typeParam TComponent - Library-managed. Do not specify explicitly.
   */
  loose: <TValue>() => <TComponent extends AnyFieldComponent>(
    Component: TComponent,
  ) => LooseBrandedFieldComponent<TComponent, TValue>
}

/**
 * Helpers for preparing value-compatible field components for registration
 * with `createFormHook`.
 *
 * Use `fieldComponent` when the current field API should be injected into a
 * component prop. Use `fieldBrand` when the component should retain its
 * original runtime props.
 *
 * @example
 * ```tsx
 * import { getFormHookHelpers } from '@tanstack/react-form'
 *
 * const { fieldBrand, fieldComponent } = getFormHookHelpers()
 * ```
 */
export interface FormHookHelpers {
  /** Brands components without wrapping them or injecting a field API prop. */
  fieldBrand: FieldBrandHelper
  /** Wraps components and injects the current field API into a selected prop. */
  fieldComponent: FieldComponentHelper
}

/**
 * Creates helpers that make React field components value-aware for
 * `createFormHook`.
 *
 * `fieldComponent` injects the current App Form field API into a selected prop.
 * `fieldBrand` only adds compile-time field-value compatibility and returns the
 * original component at runtime.
 *
 * @example
 * ```tsx
 * import { createFormHook, getFormHookHelpers } from '@tanstack/react-form'
 * import type { FieldWithValue } from '@tanstack/react-form'
 *
 * function TextInput({ field }: { field: FieldWithValue<string> }) {
 *   return (
 *     <input
 *       value={field.value}
 *       onChange={(event) => field.handleChange(event.target.value)}
 *     />
 *   )
 * }
 *
 * const { fieldComponent } = getFormHookHelpers()
 * const TextField = fieldComponent.strict(TextInput, 'field')
 *
 * export const { useAppForm } = createFormHook({
 *   fieldComponents: { TextField },
 *   formComponents: {},
 * })
 * ```
 */
export function getFormHookHelpers(): FormHookHelpers {
  return {
    fieldComponent: {
      loose: wrapField as FieldComponentHelper['loose'],
      strict: wrapField as FieldComponentHelper['strict'],
    },
    fieldBrand: {
      loose: brandComponentFactory as FieldBrandHelper['loose'],
      strict: brandComponentFactory as FieldBrandHelper['strict'],
    },
  }
}
