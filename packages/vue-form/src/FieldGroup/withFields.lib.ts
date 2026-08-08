import { InternalFieldGroupApi } from '@tanstack/form-core/internals'
import { computed, defineComponent, h } from 'vue'
import type { Component } from 'vue'
import type {
  AnyFieldApiOptions,
  InternalFieldGroupBindings,
} from '@tanstack/form-core/internals'
import type { AnyFieldGroupApi } from './FieldGroupApi.public'

function attachVueFieldGroupComponents(
  group: InternalFieldGroupApi,
  form: any,
): AnyFieldGroupApi {
  const forwardField = (component: Component, name: string) =>
    defineComponent(
      (_props, context) => {
        const resolved = computed(() => {
          const options = {
            ...context.attrs,
          } as unknown as AnyFieldApiOptions
          return group._getFormFieldOptions(options, (base, overrides) => ({
            ...base,
            ...overrides,
          }))
        })
        return () => h(component, resolved.value as never, context.slots)
      },
      { name, inheritAttrs: false },
    )

  const Field = forwardField(form.Field, 'TanStackForm.FieldGroup.Field')
  const ArrayField = forwardField(
    form.ArrayField,
    'TanStackForm.FieldGroup.ArrayField',
  )
  const Subscribe = defineComponent(
    (_props, context) => () =>
      h(form.Subscribe, { ...context.attrs } as never, context.slots),
    { name: 'TanStackForm.FieldGroup.Subscribe', inheritAttrs: false },
  )

  return Object.assign(group, {
    Field,
    ArrayField,
    Subscribe,
  }) as never
}

export function withFieldsRuntime(
  fields: AnyFieldGroupApi,
  component: Component,
  fieldsPropName: string,
) {
  const fieldNames = Object.keys(fields as unknown as Record<string, unknown>)

  return defineComponent(
    (_props, context) => {
      const form = context.attrs.form as any
      if (!form) {
        throw new Error(
          'TanStack Form: Field groups must receive a `form` prop.',
        )
      }

      const fieldGroupApi = attachVueFieldGroupComponents(
        new InternalFieldGroupApi({
          form,
          fieldNames,
          getBindings: () =>
            context.attrs[fieldsPropName] as InternalFieldGroupBindings,
        }),
        form,
      )

      return () => {
        const componentProps = { ...context.attrs }
        delete componentProps.form
        delete componentProps[fieldsPropName]
        componentProps[fieldsPropName] = fieldGroupApi
        return h(component, componentProps, context.slots)
      }
    },
    { name: 'TanStackForm.FieldGroup', inheritAttrs: false },
  )
}
