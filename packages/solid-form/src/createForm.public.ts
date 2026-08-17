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

/**
 * Creates a Solid form whose instance and lifecycle are owned by the current
 * reactive owner.
 *
 * Pass an options accessor. `defaultValues` establish the initial state and
 * inferred form value type, while signals read by the accessor update the same
 * form instance when they change. The form is cleaned up when its owner is
 * disposed.
 *
 * @example
 * ```tsx
 * function ProfileForm() {
 *   const form = createForm(() => ({
 *     defaultValues: { name: '' },
 *     onSubmit: ({ value }) => saveProfile(value),
 *   }))
 *
 *   return (
 *     <form
 *       onSubmit={(event) => {
 *         event.preventDefault()
 *         void form.handleSubmit()
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @returns The Solid form API with typed field, subscription, and form-group
 * components attached.
 */
export const createForm = createFormHook as never as CreateFormHook
