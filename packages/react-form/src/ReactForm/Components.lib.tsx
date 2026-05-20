import React from 'react'
import { useArrayField, useValueField } from '../useField.lib'
import { Subscribe } from '../Subscribe.public'
import type { AnyInternalFormApi } from '@tanstack/form-core-v2/internals'
import type { InternalReactFormApi } from './ReactFormApi.lib'
import type { FunctionComponent } from 'react'
import type {
  ReactFormArrayFieldProps,
  ReactFormFieldProps,
  ReactFormSubscribeProps,
} from './Components.public'

export function attachReactFormComponents(
  form: AnyInternalFormApi,
): InternalReactFormApi {
  const resultForm = form as InternalReactFormApi
  resultForm.Field = createFieldComponent(form)
  resultForm.ArrayField = createArrayFieldComponent(form)
  resultForm.Subscribe = createSubscribeComponent(form)

  return resultForm
}

type AnyFieldComponent = FunctionComponent<
  ReactFormFieldProps<any, any, any, any, any, any>
>

function createFieldComponent(form: AnyInternalFormApi): AnyFieldComponent {
  const TanStackFormField: AnyFieldComponent = (props) => {
    const fieldApi = useValueField({ ...props, form })

    return props.children(fieldApi)
  }

  TanStackFormField.displayName = 'TanStackForm.Field'

  return TanStackFormField
}

type AnyArrayFieldComponent = FunctionComponent<
  ReactFormArrayFieldProps<Array<any>, any, any, any, any, any>
>

function createArrayFieldComponent(
  form: AnyInternalFormApi,
): AnyArrayFieldComponent {
  const TanStackFormArrayField: AnyArrayFieldComponent = (props) => {
    const fieldApi = useArrayField({ ...props, form })

    return props.children(fieldApi)
  }

  TanStackFormArrayField.displayName = 'TanStackForm.ArrayField'

  return TanStackFormArrayField
}

type AnySubscribeComponent = FunctionComponent<
  ReactFormSubscribeProps<any, any, any, any>
>

function createSubscribeComponent(
  form: AnyInternalFormApi,
): AnySubscribeComponent {
  const TanStackFormSubscribe: AnySubscribeComponent = (props) => {
    return <Subscribe source={form.store} {...props} />
  }

  TanStackFormSubscribe.displayName = 'TanStackForm.Subscribe'

  return TanStackFormSubscribe
}
