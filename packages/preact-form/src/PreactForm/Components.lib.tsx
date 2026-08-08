import Preact, { useEffect } from 'preact/compat'
import { InternalFormGroupApi } from '@tanstack/form-core/internals'
import { Subscribe } from '../Subscribe.public'
import {
  useArrayFieldSubscription,
  useValueFieldSubscription,
} from './fieldSubscriptions.lib'
import { useField } from './useField.lib'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'
import type { InternalPreactFormApi } from './PreactFormApi.lib'
import type { FunctionComponent } from 'preact/compat'
import type {
  PreactFormFieldProps,
  PreactFormGroupProps,
  PreactFormSubscribeProps,
} from './Components.public'

export function attachPreactFormComponents(
  form: AnyInternalFormApi,
  fieldComponents: Record<string, FunctionComponent<any>> | null,
): InternalPreactFormApi {
  const resultForm = form as InternalPreactFormApi
  resultForm.Field = createFieldComponent(
    form,
    fieldComponents,
  ) as InternalPreactFormApi['Field']
  resultForm.ArrayField = createArrayFieldComponent(form, fieldComponents)
  resultForm.Subscribe = createSubscribeComponent(form)
  resultForm.FormGroup = createFormGroupComponent(
    resultForm,
  ) as InternalPreactFormApi['FormGroup']

  return resultForm
}

type AnyFieldComponent = FunctionComponent<
  PreactFormFieldProps<any, any, any, any, never, any, any, any>
>

function createFieldComponent(
  form: AnyInternalFormApi,
  fieldComponents: Record<string, FunctionComponent<any>> | null,
): AnyFieldComponent {
  const TanStackFormField: AnyFieldComponent = (props) => {
    const fieldApi = useField({ ...props, form }, fieldComponents)
    const field = useValueFieldSubscription(fieldApi)

    return props.children(field)
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
    const field = useArrayFieldSubscription(fieldApi)

    return props.children(field)
  }

  TanStackFormArrayField.displayName = 'TanStackForm.ArrayField'

  return TanStackFormArrayField
}

type AnySubscribeComponent = FunctionComponent<
  PreactFormSubscribeProps<any, any, any>
>

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
  PreactFormGroupProps<any, any, any, any, any, any>
>

function createFormGroupComponent(
  form: InternalPreactFormApi,
): AnyFormGroupComponent {
  const TanStackFormGroup: AnyFormGroupComponent = (props) => {
    const groupRef =
      Preact.useRef<InternalFormGroupApi<any, any, any, any, any>>(null)

    if (!groupRef.current) {
      groupRef.current = attachPreactFormGroupComponents(
        new InternalFormGroupApi({ ...props, form } as never),
        form,
      )
    }

    useEffect(() => groupRef.current?.update({ ...props, form }))

    Preact.useEffect(() => {
      const group = groupRef.current!
      group.mount()
      return () => group._cleanup()
    }, [])

    return props.children(groupRef.current as never)
  }

  TanStackFormGroup.displayName = 'TanStackForm.FormGroup'

  return TanStackFormGroup
}

function attachPreactFormGroupComponents(
  group: InternalFormGroupApi<any, any, any, any, any>,
  form: InternalPreactFormApi,
) {
  type FormGroupComponents = InternalFormGroupApi<any, any, any, any, any> & {
    Field: FunctionComponent<any>
    ArrayField: FunctionComponent<any>
    Subscribe: FunctionComponent<any>
  }

  const resultGroup: FormGroupComponents = group as never

  resultGroup.Field = function Field(props) {
    return (
      <form.Field
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
      <form.ArrayField
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
