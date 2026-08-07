import Preact from 'preact/compat'

import { InternalFormGroupApi } from '@tanstack/form-core/internals'
import { attachPreactFormComponents } from '../PreactForm/Components.lib'
import { useField } from '../PreactForm/useField.lib'
import { useValueFieldSubscription } from '../PreactForm/fieldSubscriptions.lib'
import { Subscribe } from '../Subscribe.public'
import { FieldContext, FormContext } from './contexts.lib'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'
import type { FunctionComponent } from 'preact/compat'
import type {
  AppFormComponent,
  PreactAppFormApi,
} from './PreactAppFormApi.public'
import type { AnyPreactFormComponentMap } from './componentMap.public'
import type { CrossVersionPreactNode } from '../preactTypes.public'
import type {
  PreactFormFieldProps,
  PreactFormGroupProps,
} from '../PreactForm/Components.public'
import type { InternalPreactFormApi } from '../PreactForm/PreactFormApi.lib'

type AnyPreactAppFormApi = PreactAppFormApi<any, any, AnyPreactFormComponentMap>

export function attachPreactAppFormComponents(
  form: AnyInternalFormApi,
  formComponents: Record<string, FunctionComponent<any>>,
  fieldComponents: Record<string, FunctionComponent<any>>,
): AnyPreactAppFormApi {
  const resultForm = attachPreactFormComponents(
    form,
    fieldComponents,
  ) as never as AnyPreactAppFormApi
  resultForm.AppForm = createAppForm(form)
  resultForm.Field = createFieldWithContext(
    form,
    fieldComponents,
  ) as AnyPreactAppFormApi['Field']
  resultForm.FormGroup = createFormGroupWithContext(
    resultForm as any,
  ) as AnyPreactAppFormApi['FormGroup']

  return Object.assign(resultForm, formComponents)
}

function createAppForm(form: AnyInternalFormApi): AppFormComponent {
  const AppForm: FunctionComponent<{
    children: Exclude<CrossVersionPreactNode, Promise<any>>
  }> = function AppFormComponent(props) {
    // eslint-disable-next-line @eslint-react/no-context-provider
    return <FormContext.Provider value={form as never} {...props} />
  }

  AppForm.displayName = 'TanStackForm.AppForm'

  return AppForm
}

type AnyFieldComponent = FunctionComponent<
  PreactFormFieldProps<any, any, any, any, never, any, any, any>
>

function createFieldWithContext(
  form: AnyInternalFormApi,
  fieldComponents: Record<string, FunctionComponent<any>>,
) {
  const TanStackFormField: AnyFieldComponent = (props) => {
    const fieldApi = useField({ ...props, form }, fieldComponents)
    const field = useValueFieldSubscription(fieldApi)

    return (
      // eslint-disable-next-line @eslint-react/no-context-provider
      <FieldContext.Provider value={field}>
        {props.children(field) as never}
      </FieldContext.Provider>
    )
  }

  TanStackFormField.displayName = 'TanStackForm.Field'

  return TanStackFormField
}

type AnyFormGroupComponent = FunctionComponent<
  PreactFormGroupProps<any, any, any, any, any, any>
>

function createFormGroupWithContext(
  form: InternalPreactFormApi,
): AnyFormGroupComponent {
  const TanStackFormGroup: AnyFormGroupComponent = (props) => {
    const groupRef =
      Preact.useRef<InternalFormGroupApi<any, any, any, any, any>>(null)

    if (!groupRef.current) {
      groupRef.current = attachAppFormGroupComponents(
        new InternalFormGroupApi({ ...props, form } as never),
        form,
      )
    }

    Preact.useEffect(() => groupRef.current?.update({ ...props, form }))

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

function attachAppFormGroupComponents(
  group: InternalFormGroupApi<any, any, any, any, any>,
  form: InternalPreactFormApi,
) {
  type GroupWithComponents = InternalFormGroupApi<any, any, any, any, any> & {
    Field: FunctionComponent<any>
    ArrayField: FunctionComponent<any>
    Subscribe: FunctionComponent<any>
  }

  const resultGroup: GroupWithComponents = group as never

  resultGroup.Field = function Field(props) {
    return <form.Field {...(group._getFormFieldOptions(props) as any)} />
  }
  resultGroup.Field.displayName = 'TanStackForm.FormGroup.Field'

  resultGroup.ArrayField = function ArrayField(props) {
    return <form.ArrayField {...(group._getFormFieldOptions(props) as any)} />
  }
  resultGroup.ArrayField.displayName = 'TanStackForm.FormGroup.ArrayField'

  resultGroup.Subscribe = (props) => {
    return <Subscribe source={group.atom} {...props} />
  }
  resultGroup.Subscribe.displayName = 'TanStackForm.FormGroup.Subscribe'

  return resultGroup
}
