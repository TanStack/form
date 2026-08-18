import React, { useEffect } from 'react'
import { InternalFormGroupApi } from '@tanstack/form-core/internals'
import { Subscribe } from '../Subscribe.public'
import {
  useArrayFieldSubscription,
  useValueFieldSubscription,
} from './fieldSubscriptions.lib'
import { useField } from './useField.lib'
import type {
  AnyInternalFormApi,
  FieldOptionsScope,
} from '@tanstack/form-core/internals'
import type { InternalReactFormApi } from './ReactFormApi.lib'
import type { FunctionComponent, ReactNode } from 'react'
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
  resultForm.Field = createFieldComponent(
    form,
    fieldComponents,
    'field',
  ) as InternalReactFormApi['Field']
  resultForm.ArrayField = createArrayFieldComponent(
    form,
    fieldComponents,
    'field',
  )
  resultForm.Subscribe = createSubscribeComponent(form)
  resultForm.FormGroup = createFormGroupComponent(
    resultForm,
    fieldComponents,
  ) as InternalReactFormApi['FormGroup']

  return resultForm
}

type AnyFieldComponent = FunctionComponent<
  ReactFormFieldProps<any, any, any, any, never, any, any, any>
>

function createFieldComponent(
  form: AnyInternalFormApi,
  fieldComponents: Record<string, FunctionComponent<any>> | null,
  scope: FieldOptionsScope,
): AnyFieldComponent {
  const TanStackFormField: AnyFieldComponent = (props) => {
    const fieldApi = useField({ ...props, form }, fieldComponents, scope)
    const field = useValueFieldSubscription(fieldApi)

    return props.children(field)
  }

  TanStackFormField.displayName = 'TanStackForm.Field'

  return TanStackFormField
}

type AnyArrayFieldComponent = {
  (props: any): ReactNode
  displayName?: string
}

export function createArrayFieldComponent(
  form: AnyInternalFormApi,
  fieldComponents: Record<string, FunctionComponent<any>> | null,
  scope: FieldOptionsScope,
): AnyArrayFieldComponent {
  const TanStackFormArrayField: AnyArrayFieldComponent = (props) => {
    const fieldApi = useField({ ...props, form }, fieldComponents, scope)
    const field = useArrayFieldSubscription(fieldApi)

    return props.children(field)
  }

  TanStackFormArrayField.displayName = 'TanStackForm.ArrayField'

  return TanStackFormArrayField
}

type AnySubscribeComponent = {
  (props: ReactFormSubscribeProps<any, any, any>): ReactNode
  displayName?: string
}

function createSubscribeComponent(
  form: AnyInternalFormApi,
): AnySubscribeComponent {
  const TanStackFormSubscribe: AnySubscribeComponent = (props) => {
    return <Subscribe source={form.atom} {...props} />
  }

  TanStackFormSubscribe.displayName = 'TanStackForm.Subscribe'

  return TanStackFormSubscribe
}

type AnyFormGroupComponent = FunctionComponent<
  ReactFormGroupProps<any, any, any, any, any, any>
>

function createFormGroupComponent(
  form: InternalReactFormApi,
  fieldComponents: Record<string, FunctionComponent<any>> | null,
): AnyFormGroupComponent {
  const TanStackFormGroup: AnyFormGroupComponent = (props) => {
    const groupRef =
      React.useRef<InternalFormGroupApi<any, any, any, any, any>>(null)

    if (!groupRef.current) {
      groupRef.current = attachReactFormGroupComponents(
        new InternalFormGroupApi({ ...props, form } as never),
        form,
        fieldComponents,
      )
    }

    useEffect(() => groupRef.current?.update({ ...props, form }))

    React.useEffect(() => {
      const group = groupRef.current!
      group.mount()
      return () => group._cleanup()
    }, [])

    return props.children(groupRef.current as never)
  }

  TanStackFormGroup.displayName = 'TanStackForm.FormGroup'

  return TanStackFormGroup
}

function attachReactFormGroupComponents(
  group: InternalFormGroupApi<any, any, any, any, any>,
  form: InternalReactFormApi,
  fieldComponents: Record<string, FunctionComponent<any>> | null,
) {
  type FormGroupComponents = InternalFormGroupApi<any, any, any, any, any> & {
    Field: FunctionComponent<any>
    ArrayField: FunctionComponent<any>
    Subscribe: FunctionComponent<any>
  }

  const resultGroup: FormGroupComponents = group as never
  const GroupField = createFieldComponent(form, fieldComponents, 'field')
  const GroupArrayField = createArrayFieldComponent(
    form,
    fieldComponents,
    'field',
  )

  resultGroup.Field = function Field(props) {
    return (
      <GroupField
        {...(group._getFormFieldOptions(props, (base, overrides) => ({
          ...base,
          ...overrides,
        })) as any)}
      />
    )
  }
  resultGroup.Field.displayName = 'TanStackForm.FormGroup.Field'

  resultGroup.ArrayField = function ArrayField(props) {
    return (
      <GroupArrayField
        {...(group._getFormFieldOptions(props, (base, overrides) => ({
          ...base,
          ...overrides,
        })) as any)}
      />
    )
  }
  resultGroup.ArrayField.displayName = 'TanStackForm.FormGroup.ArrayField'

  resultGroup.Subscribe = (props) => {
    return <Subscribe source={group.atom} {...props} />
  }
  resultGroup.Subscribe.displayName = 'TanStackForm.FormGroup.Subscribe'

  return resultGroup
}
