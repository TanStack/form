import { createInternalForm, initializeForm } from './createForm.svelte'
import type {
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type { SvelteFormApi } from './formApiTypes.public'
import type { DefaultSvelteFormComponentMap } from './AppForm/componentMap.public'

export type CreateForm = <
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: () => FormOptions<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    unknown
  >,
) => SvelteFormApi<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>,
  DefaultSvelteFormComponentMap
>

function createFormImpl(options: () => FormOptions<any, any, any, unknown>) {
  return createInternalForm(options, initializeForm)
}

/**
 * Creates a Svelte form whose instance and lifecycle are owned by the current
 * component.
 *
 * Pass an options function. `defaultValues` establish the initial state and
 * inferred form value type, while reactive values read by the function update
 * the same form instance when they change.
 *
 * Call this during component initialization. The form mounts with the
 * component and is cleaned up when the component unmounts.
 *
 * @example
 * ```ts
 * const form = createForm(() => ({
 *   defaultValues: { name: '' },
 *   onSubmit: ({ value }) => saveProfile(value),
 * }))
 * ```
 *
 * @returns The Svelte form API with typed field, subscription, and form-group
 * components attached.
 */
export const createForm = createFormImpl as never as CreateForm
