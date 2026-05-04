import React from 'react'
import { useSelector } from '@tanstack/react-store'
import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import { useField } from './useField.lib'
import type { FunctionComponent } from 'react'
import type { ReactFormApi, ReactFormFieldProps } from './useForm.public'
import type { FormOptions } from '@tanstack/form-core-v2'

export interface InternalReactFormApi<TData> extends InternalFormApi<
  TData,
  any
> {
  Field: FunctionComponent<ReactFormFieldProps<TData>>
}

export function initializeForm<TData>(
  options: FormOptions<TData, any>,
): ReactFormApi<TData> {
  const form = new InternalFormApi(options)

  const reactFormApi: InternalReactFormApi<TData> = form as never

  reactFormApi.Field = function FormField(props: ReactFormFieldProps<TData>) {
    const fieldApi = useField({ ...props, form })

    useSelector(fieldApi.store, (state) => state.value)
    useSelector(fieldApi.store, (state) => state.meta.errors[0]?.message)
    return <>{props.children(fieldApi)}</>
  }

  return reactFormApi
}
