import { createInternalForm, initializeForm } from './SolidFormApi.lib'
import type {
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type { Accessor } from 'solid-js'
import type { SolidFormApi } from './formApiTypes.public'
import type { DefaultSolidFormComponentMap } from './AppForm/componentMap.public'

export type CreateFormHook = <
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: Accessor<FormOptions<TFormData, TFormValidators, TSubmitReturn>>,
) => SolidFormApi<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>,
  DefaultSolidFormComponentMap
>

function createFormHook(options: Accessor<FormOptions<any, any, any>>) {
  return createInternalForm(options, initializeForm)
}

export const createForm = createFormHook as never as CreateFormHook
