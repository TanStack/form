import { fieldComponentFactory } from './fieldComponentHelpers.lib'
import type { FieldWithValue } from '@tanstack/form-core'
import type { ReactNode } from 'react'

type ExactFieldBrand<out TValue> = {
  readonly __tanstackFieldExactType: TValue
}

type AcceptsFieldBrand<out TAcceptedValue> = {
  readonly __tanstackFieldAcceptsType: TAcceptedValue
}

type FieldComponentMode = 'strict' | 'loose'

type FieldBrand<
  TMode extends FieldComponentMode,
  TValue,
> = TMode extends 'strict' ? ExactFieldBrand<TValue> : AcceptsFieldBrand<TValue>

type AnyFieldComponent = (props: any) => ReactNode

type PropsOf<TComponent> = TComponent extends (props: infer TProps) => ReactNode
  ? TProps
  : never

type FieldValuePropKeys<TProps> = {
  [K in keyof TProps]-?: TProps[K] extends FieldWithValue<any> ? K : never
}[keyof TProps]

type FieldValueFromProp<TProp> =
  TProp extends FieldWithValue<infer TValue> ? TValue : never

interface FieldComponentFactory<TMode extends FieldComponentMode> {
  (): <
    TComponent extends AnyFieldComponent,
    TProps = PropsOf<TComponent>,
    TFieldPropKey extends FieldValuePropKeys<TProps> =
      FieldValuePropKeys<TProps>,
  >(
    Component: TComponent,
    fieldPropKey: TFieldPropKey,
  ) => ((props: Omit<TProps, TFieldPropKey>) => ReactNode) &
    FieldBrand<TMode, FieldValueFromProp<TProps[TFieldPropKey]>>

  <TValue>(): <TComponent extends AnyFieldComponent>(
    Component: TComponent,
  ) => NoInfer<TComponent> & FieldBrand<TMode, TValue>
}

/**
 * Prepares components for App Form with field API injection or an explicit
 * field-value type.
 */
export interface FieldComponentHelper {
  /**
   * Prepares a component for fields whose value type exactly matches.
   *
   * Use `strict()(Component, fieldPropKey)` to infer the value type from the
   * selected prop, omit that prop from the public props, and inject the field
   * API from the nearest App Form field context.
   *
   * Use `strict<TValue>()(Component)` to keep the original component and props,
   * including its generic signature, and only add compile-time compatibility.
   *
   * @example
   * ```tsx
   * const { fieldComponent } = getFormHookHelpers()
   * const TextField = fieldComponent.strict()(TextInput, 'field')
   * const StringAdornment = fieldComponent.strict<string>()(Adornment)
   * ```
   */
  strict: FieldComponentFactory<'strict'>

  /**
   * Prepares a component for fields whose value type is assignable to the
   * value type accepted by the component.
   *
   * Use `loose()(Component, fieldPropKey)` to infer the accepted value type
   * from the selected prop and inject the field API from field context.
   *
   * Use `loose<TValue>()(Component)` to keep the original component and props,
   * including its generic signature, and only add compile-time compatibility.
   *
   * @example
   * ```tsx
   * const { fieldComponent } = getFormHookHelpers()
   * const Errors = fieldComponent.loose()(FieldErrors, 'field')
   * const Description = fieldComponent.loose<unknown>()(FieldDescription)
   * ```
   */
  loose: FieldComponentFactory<'loose'>
}

/**
 * Helpers for preparing value-compatible field components for registration
 * with `createFormHook`.
 */
export interface FormHookHelpers {
  fieldComponent: FieldComponentHelper
}

/**
 * Creates helpers that make React field components value-aware for
 * `createFormHook`.
 *
 * Supplying a prop name injects the current App Form field API into that prop.
 * Supplying an explicit value type without a prop name returns the original
 * component with compile-time field-value compatibility.
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
 * const TextField = fieldComponent.strict()(TextInput, 'field')
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
      loose: fieldComponentFactory as FieldComponentHelper['loose'],
      strict: fieldComponentFactory as FieldComponentHelper['strict'],
    },
  }
}
