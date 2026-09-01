import {
  InternalFieldGroupApi,
  defineFieldGroupFieldsRuntime,
  fieldGroupHelperRuntime,
} from '@tanstack/form-core/internals'
import { createComponent, mergeProps, splitProps } from 'solid-js'
import type { Component } from 'solid-js'
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

export function defineFieldGroupRuntime<
  TFields extends Record<string, unknown>,
>(defineFieldGroupFn: (helperRuntime: any) => TFields) {
  const fields = defineFieldGroupFieldsRuntime(
    defineFieldGroupFn(fieldGroupHelperRuntime),
  )

  return {
    fields,
    bindComponent: (Component: Component<any>, fieldsPropName: string) =>
      withFieldsRuntime(fields, Component, fieldsPropName),
  }
}

function withFieldsRuntime(
  fields: Record<string, unknown>,
  Component: Component<any>,
  fieldsPropName: string,
) {
  const fieldNames = Object.keys(fields)

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
        getBindings: () => localProps[fieldsPropName],
      }),
      form,
    )

    return createComponent(
      Component,
      mergeProps(restProps, { [fieldsPropName]: fieldGroupApi }),
    )
  }
}
