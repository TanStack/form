import React from 'react'
import { Subscribe } from '../Subscribe.public'
import {
  useArrayFieldSubscription,
  useField,
  useValueFieldSubscription,
} from '../useField.lib'
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
  fieldComponents: Record<string, FunctionComponent<any>> | null,
): InternalReactFormApi {
  const resultForm = form as InternalReactFormApi
  resultForm.Field = createFieldComponent(form, fieldComponents)
  resultForm.ArrayField = createArrayFieldComponent(form, fieldComponents)
  resultForm.Subscribe = createSubscribeComponent(form)

  return resultForm
}

type AnyFieldComponent = FunctionComponent<
  ReactFormFieldProps<any, any, any, any, any, any, any>
>

function createFieldComponent(
  form: AnyInternalFormApi,
  fieldComponents: Record<string, FunctionComponent<any>> | null,
): AnyFieldComponent {
  const TanStackFormField: AnyFieldComponent = (props) => {
    const fieldApi = useField({ ...props, form }, fieldComponents)
    useValueFieldSubscription(fieldApi)

    return props.children(fieldApi)
  }

  TanStackFormField.displayName = 'TanStackForm.Field'

  return TanStackFormField
}

type AnyArrayFieldComponent = FunctionComponent<
  ReactFormArrayFieldProps<Array<any>, any, any, any, any, any, any>
>

function createArrayFieldComponent(
  form: AnyInternalFormApi,
  fieldComponents: Record<string, FunctionComponent<any>> | null,
): AnyArrayFieldComponent {
  const TanStackFormArrayField: AnyArrayFieldComponent = (props) => {
    const fieldApi = useField({ ...props, form }, fieldComponents)
    useArrayFieldSubscription(fieldApi)

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
