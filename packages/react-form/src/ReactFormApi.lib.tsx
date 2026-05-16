import { useSelector } from '@tanstack/react-store'
import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import React from 'react'
import { useField } from './useField.lib'
import { Subscribe as StoreSubscribe } from './Subscribe.public'
import type { InternalBaseFieldMeta } from '@tanstack/form-core-v2/internals'
import type {
  ReactFormArrayFieldProps,
  ReactFormFieldProps,
  ReactFormSubscribeProps,
  ReactTanStackFormComponents,
} from './useForm.public'
import type { FormOptions } from '@tanstack/form-core-v2'

export interface InternalReactFormApi
  extends
    InternalFormApi<any, any, any>,
    ReactTanStackFormComponents<any, any, any> {}

export function initializeForm(
  options: FormOptions<any, any, any>,
): InternalReactFormApi {
  const form = new InternalFormApi(options)

  const reactFormApi: InternalReactFormApi = form as never

  reactFormApi.Field = function TanStackFormField(
    props: ReactFormFieldProps<any, any, any, any, any, any>,
  ) {
    const fieldApi = useField({ ...props, form })

    useSelector(fieldApi.store, (state) => state.value)
    useSelector(fieldApi.store, (state) => state.meta)

    return props.children(fieldApi)
  }

  reactFormApi.ArrayField = function TanStackFormArrayField(
    props: ReactFormArrayFieldProps<Array<any>, any, any, any, any, any>,
  ) {
    const fieldApi = useField({ ...props, form })

    useSelector(fieldApi.store, (state) => state.value.length)
    useSelector(
      fieldApi.store,
      (state) => (state.meta as never as InternalBaseFieldMeta)._arrayVersion,
    )
    return props.children(fieldApi)
  }

  reactFormApi.Subscribe = function TanStackFormSubscribe(
    props: ReactFormSubscribeProps<any, any, any, any>,
  ) {
    return <StoreSubscribe source={reactFormApi.store} {...props} />
  }

  return reactFormApi
}
