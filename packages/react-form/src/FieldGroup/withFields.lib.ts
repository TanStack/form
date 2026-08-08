import React from 'react'
import { InternalFieldGroupApi } from '@tanstack/form-core/internals'
import type { InternalFieldGroupBindings } from '@tanstack/form-core/internals'
import type { FunctionComponent } from 'react'
import type { AnyFieldGroupApi } from './FieldGroupApi.public'

function attachReactFieldGroupComponents(
  group: InternalFieldGroupApi,
  form: any,
): AnyFieldGroupApi {
  const Field: FunctionComponent<any> = (props) => {
    const FormField = form.Field
    return React.createElement(
      FormField as FunctionComponent<any>,
      group._getFormFieldOptions(props, (base, overrides) => ({
        ...base,
        ...overrides,
      })),
    )
  }
  Field.displayName = 'TanStackForm.FieldGroup.Field'

  const ArrayField: FunctionComponent<any> = (props) => {
    const FormArrayField = form.ArrayField
    return React.createElement(
      FormArrayField as FunctionComponent<any>,
      group._getFormFieldOptions(props, (base, overrides) => ({
        ...base,
        ...overrides,
      })),
    )
  }
  ArrayField.displayName = 'TanStackForm.FieldGroup.ArrayField'

  const Subscribe: FunctionComponent<any> = (props) => {
    const FormSubscribe = form.Subscribe
    return React.createElement(FormSubscribe as FunctionComponent<any>, props)
  }
  Subscribe.displayName = 'TanStackForm.FieldGroup.Subscribe'

  return Object.assign(group, {
    Field,
    ArrayField,
    Subscribe,
  }) as never
}

export function withFieldsRuntime(
  _fields: AnyFieldGroupApi,
  Component: (props: any) => unknown,
  fieldsPropName: string,
) {
  const fieldNames = Object.keys(_fields as unknown as Record<string, unknown>)

  const FieldGroupComponent = (props: any) => {
    const { form, ...restProps } = props
    const bindingsRef = React.useRef<InternalFieldGroupBindings>(
      props[fieldsPropName],
    )

    if (!form) {
      throw new Error('TanStack Form: Field groups must receive a `form` prop.')
    }

    bindingsRef.current = props[fieldsPropName]

    const fieldGroupApi = React.useMemo(
      () =>
        attachReactFieldGroupComponents(
          new InternalFieldGroupApi({
            form,
            fieldNames,
            getBindings: () => bindingsRef.current,
          }),
          form,
        ),
      [form],
    )

    return Component({
      ...restProps,
      [fieldsPropName]: fieldGroupApi,
    })
  }

  FieldGroupComponent.displayName = 'TanStackForm.FieldGroup'

  return FieldGroupComponent
}
