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
  options: () => FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => SvelteFormApi<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>,
  DefaultSvelteFormComponentMap
>

function createFormImpl(options: () => FormOptions<any, any, any>) {
  return createInternalForm(options, initializeForm)
}

export const createForm = createFormImpl as never as CreateForm
