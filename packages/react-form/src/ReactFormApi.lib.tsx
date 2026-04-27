import React from 'react'
import { useSelector } from '@tanstack/react-store'
import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import { useField } from './useField.lib'
import type { FunctionComponent } from 'react'
import type { FieldProps, ReactFormApi } from './useForm.public'
import type { FormOptions } from '@tanstack/form-core-v2'

export interface InternalReactFormApi<TData> extends InternalFormApi<TData> {
  Field: FunctionComponent<FieldProps<TData>>
}

export function initializeForm<TData>(
  options: FormOptions<TData>,
): ReactFormApi<TData> {
  const form = new InternalFormApi(options)

  const reactFormApi: InternalReactFormApi<TData> = form as never

  reactFormApi.Field = function FormField(props: FieldProps<TData>) {
    const fieldApi = useField({ ...props, form })

    useSelector(fieldApi.store, (state) => state.value)
    return <>{props.children(fieldApi)}</>
  }

  return reactFormApi
}
