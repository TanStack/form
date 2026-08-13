import React from 'react'

import { InternalFormGroupApi } from '@tanstack/form-core/internals'
import { attachReactFormComponents } from '../ReactForm/Components.lib'
import { useField } from '../ReactForm/useField.lib'
import { useValueFieldSubscription } from '../ReactForm/fieldSubscriptions.lib'
import { Subscribe } from '../Subscribe.public'
import { FieldContext, FormContext } from './contexts.lib'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'
import type { FunctionComponent, ReactNode } from 'react'
import type {
  AppFormComponent,
  ReactAppFormApi,
} from './ReactAppFormApi.public'
import type { AnyReactFormComponentMap } from './componentMap.public'
import type {
  ReactFormFieldProps,
  ReactFormGroupProps,
} from '../ReactForm/Components.public'
import type { InternalReactFormApi } from '../ReactForm/ReactFormApi.lib'
import type {
  CreateFormHookDefaultFieldOptions,
  CreateFormHookDefaultFormGroupOptions,
} from './createFormHookTypes.public'

type AnyReactAppFormApi = ReactAppFormApi<any, any, AnyReactFormComponentMap>

export function attachReactAppFormComponents(
  form: AnyInternalFormApi,
  formComponents: Record<string, FunctionComponent<any>>,
  fieldComponents: Record<string, FunctionComponent<any>>,
  defaultFieldOptions: CreateFormHookDefaultFieldOptions | undefined,
  defaultFormGroupOptions: CreateFormHookDefaultFormGroupOptions | undefined,
): AnyReactAppFormApi {
  const resultForm = attachReactFormComponents(
    form,
    fieldComponents,
  ) as never as AnyReactAppFormApi
  const fieldWithoutDefaults = createFieldWithContext(form, fieldComponents)
  const arrayFieldWithoutDefaults =
    resultForm.ArrayField as FunctionComponent<any>
  const formGroupWithoutDefaults = createFormGroupWithContext(
    resultForm as any,
    fieldWithoutDefaults,
    arrayFieldWithoutDefaults,
  )

  resultForm.AppForm = createAppForm(form)
  resultForm.Field = withDefaultOptions(
    fieldWithoutDefaults,
    defaultFieldOptions,
  ) as AnyReactAppFormApi['Field']
  resultForm.ArrayField = withDefaultOptions(
    arrayFieldWithoutDefaults,
    defaultFieldOptions,
  ) as AnyReactAppFormApi['ArrayField']
  resultForm.FormGroup = withDefaultOptions(
    formGroupWithoutDefaults,
    defaultFormGroupOptions,
  ) as AnyReactAppFormApi['FormGroup']

  return Object.assign(resultForm, formComponents)
}

function withDefaultOptions(
  Component: FunctionComponent<any>,
  defaultOptions: object | undefined,
): FunctionComponent<any> {
  if (!defaultOptions) return Component

  const ComponentWithDefaultOptions: FunctionComponent<any> = (props) => (
    <Component {...defaultOptions} {...props} />
  )
  ComponentWithDefaultOptions.displayName = Component.displayName

  return ComponentWithDefaultOptions
}

function createAppForm(form: AnyInternalFormApi): AppFormComponent {
  const AppForm: FunctionComponent<{
    children: Exclude<ReactNode, Promise<any>>
  }> = function AppFormComponent(props) {
    // eslint-disable-next-line @eslint-react/no-context-provider
    return <FormContext.Provider value={form as never} {...props} />
  }

  AppForm.displayName = 'TanStackForm.AppForm'

  return AppForm
}

type AnyFieldComponent = FunctionComponent<
  ReactFormFieldProps<any, any, any, any, never, any, any, any>
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
  ReactFormGroupProps<any, any, any, any, any, any>
>

function createFormGroupWithContext(
  form: InternalReactFormApi,
  fieldWithoutDefaults: FunctionComponent<any>,
  arrayFieldWithoutDefaults: FunctionComponent<any>,
): AnyFormGroupComponent {
  const TanStackFormGroup: AnyFormGroupComponent = (props) => {
    const groupRef =
      React.useRef<InternalFormGroupApi<any, any, any, any, any>>(null)

    if (!groupRef.current) {
      groupRef.current = attachAppFormGroupComponents(
        new InternalFormGroupApi({ ...props, form } as never),
        fieldWithoutDefaults,
        arrayFieldWithoutDefaults,
      )
    }

    React.useEffect(() => groupRef.current?.update({ ...props, form }))

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

function attachAppFormGroupComponents(
  group: InternalFormGroupApi<any, any, any, any, any>,
  fieldWithoutDefaults: FunctionComponent<any>,
  arrayFieldWithoutDefaults: FunctionComponent<any>,
) {
  type GroupWithComponents = InternalFormGroupApi<any, any, any, any, any> & {
    Field: FunctionComponent<any>
    ArrayField: FunctionComponent<any>
    Subscribe: FunctionComponent<any>
  }

  const resultGroup: GroupWithComponents = group as never
  const FieldWithoutDefaults = fieldWithoutDefaults
  const ArrayFieldWithoutDefaults = arrayFieldWithoutDefaults

  resultGroup.Field = function Field(props) {
    return (
      <FieldWithoutDefaults
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
      <ArrayFieldWithoutDefaults
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
