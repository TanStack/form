import type { AnyFormApi, FormApi, FormErrorTypes } from '@tanstack/form-core'
import type { Component } from 'solid-js'
import type { SolidTanStackFormComponents } from './Components.public'
import type {
  AnySolidFormComponentMap,
  DefaultSolidFormComponentMap,
} from './AppForm/componentMap.public'

type ExtendedFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, Component<any>>,
> = FormApi<TFormData, TFormErrorTypes> &
  SolidTanStackFormComponents<TFormData, TFormErrorTypes, TFieldComponents>

export type SolidFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnySolidFormComponentMap = DefaultSolidFormComponentMap,
> = unknown extends TComponents['formComponents']
  ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents['fieldComponents']>
  : ExtendedFormApi<
      TFormData,
      TFormErrorTypes,
      TComponents['fieldComponents']
    > &
      TComponents['formComponents']

/**
 * A Solid form API whose form data and error types are erased.
 *
 * Use it for reusable Solid components that only need core form operations and
 * the `Field`, `ArrayField`, `Subscribe`, or `FormGroup` components common to
 * every Solid form. Field paths and values are not checked against a particular
 * form shape; use `SolidFormType` when a component depends on one known form.
 *
 * @example
 * ```tsx
 * function FormSubmitButton(props: { form: AnySolidFormApi }) {
 *   return (
 *     <props.form.Subscribe selector={(state) => state.isSubmitting}>
 *       {(isSubmitting) => (
 *         <button type="submit" disabled={isSubmitting()}>
 *           {isSubmitting() ? 'Saving...' : 'Save'}
 *         </button>
 *       )}
 *     </props.form.Subscribe>
 *   )
 * }
 * ```
 */
export type AnySolidFormApi = AnyFormApi &
  SolidTanStackFormComponents<any, any, any>

export type { SolidFormComponentMap } from './AppForm/componentMap.public'
