import React from 'react'
import { useSelector } from '@tanstack/react-store'
import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import { useField } from './useField.lib'
import type { InternalBaseFieldMeta } from '@tanstack/form-core-v2/internals'
import type { FunctionComponent } from 'react'
import type {
  ReactFormApi,
  ReactFormArrayFieldProps,
  ReactFormFieldProps,
} from './useForm.public'
import type { FormOptions } from '@tanstack/form-core-v2'

export interface InternalReactFormApi<TData> extends InternalFormApi<
  TData,
  any
> {
  Field: FunctionComponent<ReactFormFieldProps<TData>>
  ArrayField: FunctionComponent<ReactFormArrayFieldProps<TData>>
}

export function initializeForm<TData>(
  options: FormOptions<TData, any>,
): ReactFormApi<TData> {
  const form = new InternalFormApi(options)

  const reactFormApi: InternalReactFormApi<TData> = form as never

  reactFormApi.Field = function TanStackFormField(
    props: ReactFormFieldProps<TData>,
  ) {
    const fieldApi = useField({ ...props, form })

    useSelector(fieldApi.store, (state) => state.value)
    useSelector(fieldApi.store, (state) => state.meta)

    return <>{props.children(fieldApi)}</>
  }

  reactFormApi.Field.displayName = 'form.Field'

  reactFormApi.ArrayField = function TanStackFormArrayField(
    props: ReactFormArrayFieldProps<TData>,
  ) {
    const fieldApi = useField({ ...props, form })

    useSelector(fieldApi.store, (state) => state.value.length)
    useSelector(
      fieldApi.store,
      (state) => (state.meta as never as InternalBaseFieldMeta)._arrayVersion,
    )
    return <>{props.children(fieldApi)}</>
  }
  reactFormApi.Field.displayName = 'form.ArrayField'

  return reactFormApi
}
