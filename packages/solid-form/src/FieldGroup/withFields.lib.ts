import { InternalFieldGroupApi } from '@tanstack/form-core/internals'
import { createComponent, mergeProps, splitProps } from 'solid-js'
import type { Component } from 'solid-js'
import type { InternalFieldGroupBindings } from '@tanstack/form-core/internals'
import type { AnyFieldGroupApi } from './FieldGroupApi.public'

function attachSolidFieldGroupComponents(
  group: InternalFieldGroupApi,
  form: any,
): AnyFieldGroupApi {
  const Field: Component<any> = (props) =>
    createComponent(
      form.Field as Component<any>,
      group._getFormFieldOptions(props, mergeProps),
    )
  const ArrayField: Component<any> = (props) =>
    createComponent(
      form.ArrayField as Component<any>,
      group._getFormFieldOptions(props, mergeProps),
    )
  const Subscribe: Component<any> = (props) =>
    createComponent(form.Subscribe as Component<any>, props)

  return Object.assign(group, {
    Field,
    ArrayField,
    Subscribe,
  }) as never
}

export function withFieldsRuntime(
  fields: AnyFieldGroupApi,
  Component: Component<any>,
  fieldsPropName: string,
) {
  const fieldNames = Object.keys(fields as unknown as Record<string, unknown>)

  return function FieldGroupComponent(props: any) {
    const [localProps, restProps] = splitProps(props, ['form', fieldsPropName])
    const form = localProps.form
    if (!form) {
      throw new Error('TanStack Form: Field groups must receive a `form` prop.')
    }

    const fieldGroupApi = attachSolidFieldGroupComponents(
      new InternalFieldGroupApi({
        form,
        fieldNames,
        getBindings: () =>
          localProps[fieldsPropName] as InternalFieldGroupBindings,
      }),
      form,
    )

    return createComponent(
      Component,
      mergeProps(restProps, { [fieldsPropName]: fieldGroupApi }),
    )
  }
}
