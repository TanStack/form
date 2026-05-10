import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import { mergeProps } from 'solid-js'
import { Subscribe } from './Subscribe.lib'
import { createArrayField, createField } from './createField.lib'
import type {
  SolidFormArrayFieldProps,
  SolidFormFieldProps,
  SolidFormSubscribeProps,
  SolidTanStackFormComponents,
} from './createForm.public'
import type { FormOptions, FormValidator } from '@tanstack/form-core-v2'

export interface InternalSolidFormApi<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
>
  extends
    InternalFormApi<TData, TFormValidators>,
    SolidTanStackFormComponents<TData, TFormValidators> {}

export function initializeForm<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
>(
  options: FormOptions<TFormData, TFormValidators>,
): InternalSolidFormApi<TFormData, TFormValidators> {
  const form = new InternalFormApi(options)

  const solidFormApi: InternalSolidFormApi<TFormData, TFormValidators> =
    form as never

  solidFormApi.Field = function TanStackFormField<TFieldValue>(
    props: SolidFormFieldProps<TFormData, TFormValidators, TFieldValue>,
  ) {
    const fieldOptions = mergeProps(props, { form })
    const fieldApi = createField(() => fieldOptions)

    return props.children(fieldApi)
  }

  solidFormApi.ArrayField = function TanStackFormArrayField<TFieldValue>(
    props: SolidFormArrayFieldProps<TFormData, TFormValidators, TFieldValue>,
  ) {
    const fieldOptions = mergeProps(props, { form })
    const fieldApi = createArrayField(() => fieldOptions)

    return props.children(fieldApi)
  }

  solidFormApi.Subscribe = function TanStackFormSubscribe<TSelected>(
    props: SolidFormSubscribeProps<TFormData, TSelected>,
  ) {
    return Subscribe(mergeProps(props, { source: solidFormApi.store }))
  }

  return solidFormApi
}
