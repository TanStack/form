import React from 'react'
import { useFieldContext } from './contexts.lib'

type AnyFieldComponent = (props: any) => React.ReactNode

function wrapField(
  Component: AnyFieldComponent,
  fieldPropKey: string,
): AnyFieldComponent {
  const Wrapper = function TanStackFormFieldWrapper(props: any) {
    const field = useFieldContext()

    const newProps = { ...props, [fieldPropKey]: field }

    return <Component {...newProps} />
  }

  Wrapper.displayName = 'TanStackForm.FieldComponent'

  return Wrapper
}

export function fieldComponentFactory(): (
  component: AnyFieldComponent,
  fieldPropKey?: string,
) => AnyFieldComponent {
  return (component, fieldPropKey) =>
    fieldPropKey === undefined ? component : wrapField(component, fieldPropKey)
}
