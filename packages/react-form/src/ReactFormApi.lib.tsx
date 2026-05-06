import React from 'react'
import { useSelector } from '@tanstack/react-store'
import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import { useField } from './useField.lib'
import type { FunctionComponent } from 'react'
import type { InternalBaseFieldMeta } from '@tanstack/form-core-v2/internals'
import type {
  ReactFormApi,
  ReactFormArrayFieldProps,
  ReactFormFieldProps,
} from './useForm.public'
import type { FormOptions, FormValidator } from '@tanstack/form-core-v2'

export interface InternalReactFormApi<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
> extends ReactFormApi<TData, TFormValidators> {}

export function initializeForm<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
>(
  options: FormOptions<TData, TFormValidators>,
): ReactFormApi<TData, TFormValidators> {
  const form = new InternalFormApi(options)

  const reactFormApi: InternalReactFormApi<TData, TFormValidators> =
    form as never

  const Field: FunctionComponent<any> = function TanStackFormField<TFieldValue>(
    props: ReactFormFieldProps<TData, TFormValidators, TFieldValue>,
  ) {
    const fieldApi = useField({ ...props, form })

    useSelector(fieldApi.store, (state) => state.value)
    useSelector(fieldApi.store, (state) => state.meta)

    return <>{props.children(fieldApi)}</>
  }

  Field.displayName = 'form.Field'
  reactFormApi.Field = Field

  const ArrayField = function TanStackFormArrayField<TFieldValue>(
    props: ReactFormArrayFieldProps<TData, TFormValidators, TFieldValue>,
  ) {
    const fieldApi = useField({ ...props, form })

    useSelector(fieldApi.store, (state) => state.value.length)
    useSelector(
      fieldApi.store,
      (state) => (state.meta as never as InternalBaseFieldMeta)._arrayVersion,
    )
    return <>{props.children(fieldApi)}</>
  }

  ArrayField.displayName = 'form.ArrayField'
  reactFormApi.ArrayField = ArrayField

  return reactFormApi
}
