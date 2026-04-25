import React from 'react'
import { useSelector } from '@tanstack/react-store'
import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import { useField } from './useField.lib'
import type { ReactFormApi } from './useForm.public'
import type { FieldApi, FormOptions } from '@tanstack/form-core-v2'

export interface InternalReactFormApi<TData>
  extends ReactFormApi<TData>, InternalFormApi<TData> {}

// private
export function initializeForm<TData>(
  options: FormOptions<TData>,
): ReactFormApi<TData> {
  const form = new InternalFormApi(options)

  // recasting to hide internal methods from user
  const reactFormApi: InternalReactFormApi<TData> = form as never

  function Field(props: FieldProps<TData>) {
    const fieldApi = useField({ ...props, form })

    useSelector(fieldApi.store, (state) => state.value)

    return <>{props.children(fieldApi)}</>
  }

  Object.assign(reactFormApi, { Field })

  return reactFormApi
}

interface FieldProps<TData> {
  name: string
  children: (fieldApi: FieldApi<TData>) => React.ReactNode
}
