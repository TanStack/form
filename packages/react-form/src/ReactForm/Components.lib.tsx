import React, { useEffect } from 'react'
import { InternalFormGroupApi } from '@tanstack/form-core-v2/internals'
import { Subscribe } from '../Subscribe.public'
import {
  useArrayFieldSubscription,
  useValueFieldSubscription,
} from './fieldSubscriptions.lib'
import { useField } from './useField.lib'
import type { AnyInternalFormApi } from '@tanstack/form-core-v2/internals'
import type { InternalReactFormApi } from './ReactFormApi.lib'
import type { FunctionComponent } from 'react'
import type {
  ReactFormFieldProps,
  ReactFormGroupProps,
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
  resultForm.FormGroup = createFormGroupComponent(resultForm)

  return resultForm
}

type AnyFieldComponent = FunctionComponent<
  ReactFormFieldProps<any, any, any, any, any, any, any, any, any>
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

type AnyArrayFieldComponent = FunctionComponent<any>

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

type AnyFormGroupComponent = FunctionComponent<
  ReactFormGroupProps<any, any, any, any, any, any, any>
>

function createFormGroupComponent(
  form: InternalReactFormApi,
): AnyFormGroupComponent {
  const TanStackFormGroup: AnyFormGroupComponent = (props) => {
    const groupRef =
      React.useRef<InternalFormGroupApi<any, any, any, any, any, any>>(null)

    if (!groupRef.current) {
      groupRef.current = attachReactFormGroupComponents(
        new InternalFormGroupApi({ ...props, form } as never),
        form,
      )
    }

    useEffect(() => groupRef.current?.update({ ...props, form } as never))

    React.useEffect(() => {
      const group = groupRef.current!
      return () => group._cleanup()
    }, [])

    return props.children(groupRef.current as never)
  }

  TanStackFormGroup.displayName = 'TanStackForm.FormGroup'

  return TanStackFormGroup
}

function attachReactFormGroupComponents(
  group: InternalFormGroupApi<any, any, any, any, any, any>,
  form: InternalReactFormApi,
) {
  const resultGroup = group as InternalFormGroupApi<
    any,
    any,
    any,
    any,
    any,
    any
  > & {
    Field: FunctionComponent<any>
    ArrayField: FunctionComponent<any>
    Subscribe: FunctionComponent<any>
  }

  resultGroup.Field = function Field(props) {
    const Field = form.Field
    return <Field {...(group._getFormFieldOptions(props) as any)} />
  }
  resultGroup.Field.displayName = 'TanStackForm.FormGroup.Field'

  resultGroup.ArrayField = function ArrayField(props) {
    const ArrayField = form.ArrayField
    return <ArrayField {...(group._getFormFieldOptions(props) as any)} />
  }
  resultGroup.ArrayField.displayName = 'TanStackForm.FormGroup.ArrayField'

  resultGroup.Subscribe = (props) => {
    return <Subscribe source={group.store} {...props} />
  }
  resultGroup.Subscribe.displayName = 'TanStackForm.FormGroup.Subscribe'

  return resultGroup
}
