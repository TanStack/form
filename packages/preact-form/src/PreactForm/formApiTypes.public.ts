import type { AnyFormApi, FormApi, FormErrorTypes } from '@tanstack/form-core'
import type { FunctionComponent } from 'preact/compat'
import type { PreactTanStackFormComponents } from './Components.public'
import type { AnyPreactFormComponentMap } from '../AppForm/componentMap.public'

type ExtendedFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FormApi<TFormData, TFormErrorTypes> &
  PreactTanStackFormComponents<TFormData, TFormErrorTypes, TFieldComponents>

export type PreactFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnyPreactFormComponentMap,
> = unknown extends TComponents['formComponents']
  ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents['fieldComponents']>
  : ExtendedFormApi<
      TFormData,
      TFormErrorTypes,
      TComponents['fieldComponents']
    > &
      TComponents['formComponents']

/**
 * A Preact form API whose form data and error types are erased.
 *
 * Use it for reusable Preact components that only need core form operations
 * and the `Field`, `ArrayField`, `Subscribe`, or `FormGroup` components common
 * to every Preact form. Field paths and values are not checked against a
 * particular form shape; use `PreactFormType` when a component depends on one
 * known form.
 *
 * @example
 * ```tsx
 * function FormSubmitButton({ form }: { form: AnyPreactFormApi }) {
 *   return (
 *     <form.Subscribe selector={(state) => state.isSubmitting}>
 *       {(isSubmitting) => (
 *         <button type="submit" disabled={isSubmitting}>
 *           {isSubmitting ? 'Saving...' : 'Save'}
 *         </button>
 *       )}
 *     </form.Subscribe>
 *   )
 * }
 * ```
 */
export type AnyPreactFormApi = AnyFormApi &
  PreactTanStackFormComponents<any, any, any>

export type { PreactFormComponentMap } from '../AppForm/componentMap.public'
