import { defineComponent, h } from 'vue'
import { useFieldContext } from './contexts.lib'
import type { Component } from 'vue'

export function wrapField(
  component: Component,
  fieldPropKey: string,
): Component {
  return defineComponent(
    (_props, context) => {
      const field = useFieldContext()
      return () =>
        h(component, { ...context.attrs, [fieldPropKey]: field }, context.slots)
    },
    { name: 'TanStackForm.FieldComponent', inheritAttrs: false },
  )
}

export function brandComponentFactory(): (component: Component) => Component {
  return (component) => component
}
