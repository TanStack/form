import { createComponent } from 'solid-js'
import { useFieldContext } from './contexts.lib'
import type { Component } from 'solid-js'

type AnyFieldComponent = Component<any>

export function wrapField(
  Component: AnyFieldComponent,
  fieldPropKey: string,
): AnyFieldComponent {
  return function TanStackFormFieldWrapper(props) {
    return createComponent(Component, {
      ...props,
      [fieldPropKey]: useFieldContext(),
    })
  }
}

export function brandComponentFactory(): (
  component: AnyFieldComponent,
) => AnyFieldComponent {
  return (component) => component
}
