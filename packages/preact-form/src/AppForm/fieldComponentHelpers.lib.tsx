import { useFieldContext } from './contexts.lib'
import type { FunctionComponent } from 'preact/compat'
import type { CrossVersionPreactNode } from '../preactTypes.public'

type AnyFieldComponent = (props: any) => CrossVersionPreactNode

export function wrapField(
  Component: AnyFieldComponent,
  fieldPropKey: string,
): AnyFieldComponent {
  const Wrapper: FunctionComponent<any> = function TanStackFormFieldWrapper(
    props,
  ) {
    const field = useFieldContext()

    const newProps = { ...props, [fieldPropKey]: field }

    return <Component {...newProps} />
  }

  Wrapper.displayName = 'TanStackForm.FieldComponent'

  return Wrapper as never
}

export function brandComponentFactory(): (
  component: AnyFieldComponent,
) => AnyFieldComponent {
  return (component) => component
}
