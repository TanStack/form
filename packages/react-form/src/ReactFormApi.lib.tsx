import { useSelector } from '@tanstack/react-store'
import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import React from 'react'
import { useField } from './useField.lib'
import { Subscribe as StoreSubscribe } from './Subscribe'
import type { InternalBaseFieldMeta } from '@tanstack/form-core-v2/internals'
import type {
  ReactFormApi,
  ReactFormArrayFieldProps,
  ReactFormFieldProps,
  ReactFormSubscribeProps,
} from './useForm.public'
import type { FormOptions, FormValidator } from '@tanstack/form-core-v2'

export interface InternalReactFormApi<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
> extends ReactFormApi<TData, TFormValidators> {}

export function initializeForm<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
>(
  options: FormOptions<TFormData, TFormValidators>,
): ReactFormApi<TFormData, TFormValidators> {
  const form = new InternalFormApi(options)

  const reactFormApi: InternalReactFormApi<TFormData, TFormValidators> =
    form as never

  reactFormApi.Field = function TanStackFormField<TFieldValue>(
    props: ReactFormFieldProps<TFormData, TFormValidators, TFieldValue>,
  ) {
    const fieldApi = useField({ ...props, form })

    useSelector(fieldApi.store, (state) => state.value)
    useSelector(fieldApi.store, (state) => state.meta)

    return props.children(fieldApi)
  }

  reactFormApi.ArrayField = function TanStackFormArrayField<TFieldValue>(
    props: ReactFormArrayFieldProps<TFormData, TFormValidators, TFieldValue>,
  ) {
    const fieldApi = useField({ ...props, form })

    useSelector(fieldApi.store, (state) => state.value.length)
    useSelector(
      fieldApi.store,
      (state) => (state.meta as never as InternalBaseFieldMeta)._arrayVersion,
    )
    return props.children(fieldApi)
  }

  reactFormApi.Subscribe = function TanStackFormSubscribe<TSelected>(
    props: ReactFormSubscribeProps<TFormData, TSelected>,
  ) {
    return <StoreSubscribe source={reactFormApi.store} {...props} />
  }

  return reactFormApi
}
