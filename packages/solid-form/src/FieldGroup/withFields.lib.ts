import {
  InternalFieldGroupApi,
  defineFieldGroupFieldsRuntime,
  fieldGroupHelperRuntime,
} from '@tanstack/form-core/internals'
import { createComponent, createMemo, merge, omit } from 'solid-js'
import type { Component } from 'solid-js'
import type { AnyFieldGroupApi } from './FieldGroupApi.public'

function attachSolidFieldGroupComponents(
  group: InternalFieldGroupApi,
  form: any,
): AnyFieldGroupApi {
  const Field: Component<any> = (props) =>
    createComponent(
      form.Field as Component<any>,
      group._getFormFieldOptions(props, merge),
    )
  const ArrayField: Component<any> = (props) =>
    createComponent(
      form.ArrayField as Component<any>,
      group._getFormFieldOptions(props, merge),
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
    // A new field group api when the `form` prop changes.
    const fieldGroupApi = createMemo(() => {
      const form = props.form
      if (!form) {
        throw new Error(
          'TanStack Form: Field groups must receive a `form` prop.',
        )
      }
      return attachSolidFieldGroupComponents(
        new InternalFieldGroupApi({
          form,
          fieldNames,
          getBindings: () => props[fieldsPropName],
        }),
        form,
      )
    })

    // The `fields` prop stays the same object. Its components render the
    // current field group api's components, so `<props.fields.Field>` in a
    // component body reads nothing reactive; anything else reads the
    // current api.
    const render =
      (key: 'Field' | 'ArrayField' | 'Subscribe') => (childProps: any) => () =>
        createComponent((fieldGroupApi() as any)[key], childProps)
    const components: Record<PropertyKey, unknown> = {
      Field: render('Field'),
      ArrayField: render('ArrayField'),
      Subscribe: render('Subscribe'),
    }
    const fieldsApi = new Proxy(components, {
      get: (target, key) =>
        key in target ? target[key] : Reflect.get(fieldGroupApi(), key),
    })

    return createComponent(
      Component,
      merge(omit(props, 'form', fieldsPropName), {
        [fieldsPropName]: fieldsApi,
      }),
    )
  }
}
