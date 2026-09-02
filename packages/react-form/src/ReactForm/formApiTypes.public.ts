import type { AnyFormApi, FormApi, FormErrorTypes } from '@tanstack/form-core'
import type { ReactTanStackFormComponents } from './Components.public'
import type {
  AnyReactFormComponentMap,
  ReactComponentTree,
} from '../AppForm/componentMap.public'

type ExtendedFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TFieldComponents extends ReactComponentTree,
> = FormApi<TFormData, TFormErrorTypes> &
  ReactTanStackFormComponents<TFormData, TFormErrorTypes, TFieldComponents>

export type ReactFormApi<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TComponents extends AnyReactFormComponentMap,
> = unknown extends TComponents['formComponents']
  ? ExtendedFormApi<TFormData, TFormErrorTypes, TComponents['fieldComponents']>
  : ExtendedFormApi<
      TFormData,
      TFormErrorTypes,
      TComponents['fieldComponents']
    > &
      TComponents['formComponents']

/**
 * A React form API whose form data and error types are erased.
 *
 * Use it for reusable React components that only need core form operations and
 * the `Field`, `ArrayField`, `Subscribe`, or `FormGroup` components common to
 * every React form. Field paths and values are not checked against a particular
 * form shape; use `ReactFormType` when a component depends on one known form.
 *
 * @example
 * ```tsx
 * function FormSubmitButton({ form }: { form: AnyReactFormApi }) {
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
export type AnyReactFormApi = AnyFormApi &
  ReactTanStackFormComponents<any, any, any>

export type { ReactFormComponentMap } from '../AppForm/componentMap.public'
