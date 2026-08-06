import { withComponentProps } from '../utils.lib.js'
import { useFieldContext } from './contexts.lib'
import type { Component } from 'svelte'

type AnyFieldComponent = Component<any>

export function wrapField(
  Component: AnyFieldComponent,
  fieldPropKey: string,
): AnyFieldComponent {
  return ((internals: any, props: any) =>
    Component(
      internals,
      withComponentProps(props, {
        [fieldPropKey]: useFieldContext(),
      }),
    )) as AnyFieldComponent
}

export function brandComponentFactory(): (
  component: AnyFieldComponent,
) => AnyFieldComponent {
  return (component) => component
}
