import {
  InternalFieldGroupApi,
  defineFieldGroupFieldsRuntime,
  fieldGroupHelperRuntime,
} from '@tanstack/form-core/internals'
import { withComponentProps } from '../utils.lib.js'
import type { Component } from 'svelte'
import type { AnyFieldGroupApi } from './FieldGroupApi.public'

function attachSvelteFieldGroupComponents(
  group: InternalFieldGroupApi,
  form: any,
): AnyFieldGroupApi {
  const resolveProps = (props: any) =>
    new Proxy(props, {
      get(target, property, receiver) {
        if (
          property === 'name' ||
          property === 'validators' ||
          property === 'listeners'
        ) {
          return Reflect.get(
            group._getFormFieldOptions({ ...target }, withComponentProps),
            property,
          )
        }
        return Reflect.get(target, property, receiver)
      },
    })

  return Object.assign(group, {
    Field: (internals: any, props: any) =>
      form.Field(internals, resolveProps(props)),
    ArrayField: (internals: any, props: any) =>
      form.ArrayField(internals, resolveProps(props)),
    Subscribe: (internals: any, props: any) => form.Subscribe(internals, props),
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
  return ((internals: any, props: any) => {
    const form = props.form
    if (!form) {
      throw new Error('TanStack Form: Field groups must receive a `form` prop.')
    }
    const api = attachSvelteFieldGroupComponents(
      new InternalFieldGroupApi({
        form,
        fieldNames,
        getBindings: () => props[fieldsPropName],
      }),
      form,
    )
    return Component(
      internals,
      withComponentProps(props, {
        form: undefined,
        [fieldsPropName]: api,
      }),
    )
  }) as Component<any>
}
