import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import { mergeProps } from 'solid-js'
import { Subscribe } from './Subscribe.public'
import { createArrayField, createField } from './createField.lib'
import type {
  SolidFormArrayFieldProps,
  SolidFormFieldProps,
  SolidFormSubscribeProps,
  SolidTanStackFormComponents,
} from './createForm.public'
import type { FormOptions } from '@tanstack/form-core-v2'

export interface InternalSolidFormApi
  extends
    InternalFormApi<any, any, any>,
    SolidTanStackFormComponents<any, any, any> {}

export function initializeForm(
  options: FormOptions<any, any, any>,
): InternalSolidFormApi {
  const form = new InternalFormApi(options)

  const solidFormApi: InternalSolidFormApi = form as never

  solidFormApi.Field = function TanStackFormField(
    props: SolidFormFieldProps<any, any, any, any, any, any>,
  ) {
    const fieldOptions = mergeProps(props, { form })
    const fieldApi = createField(() => fieldOptions)

    return props.children(fieldApi)
  }

  solidFormApi.ArrayField = function TanStackFormArrayField(
    props: SolidFormArrayFieldProps<Array<any>, any, any, any, any, any>,
  ) {
    const fieldOptions = mergeProps(props, { form })
    const fieldApi = createArrayField(() => fieldOptions)

    return props.children(fieldApi)
  }

  solidFormApi.Subscribe = function TanStackFormSubscribe(
    props: SolidFormSubscribeProps<any, any, any, any>,
  ) {
    return Subscribe(mergeProps(props, { source: solidFormApi.store }))
  }

  return solidFormApi
}
