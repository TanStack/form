import React from 'react'
import {
  FormContext,
  useFieldContext,
  useFormComponentContext,
  useFormContext,
} from '../contexts.lib'
import type {
  AnyFormApi,
  AnyFormOptions,
  FormOptionsApi,
} from '@tanstack/form-core'
import type { FunctionComponent, ReactNode } from 'react'
import type { FormComponentHelper } from './formComponent.public'
import type { ReactFormType } from '../../ReactForm/formType.public'
import type { FormContextData } from './formContext.public'

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

export function fieldComponentFactory(): (options: {
  component: AnyFieldComponent
  replaceProperty?: string
}) => AnyFieldComponent {
  return ({ component, replaceProperty }) =>
    replaceProperty === undefined
      ? component
      : wrapField(component, replaceProperty)
}

export function prepareFormComponent({
  component: Component,
  replaceProperty,
}: {
  component: FunctionComponent<any>
  replaceProperty: string
}) {
  const Wrapper = function TanStackFormComponent(props: any) {
    const form = useFormComponentContext()
    const innerProps = { ...props, [replaceProperty]: form }
    return <Component {...innerProps} />
  }

  Wrapper.displayName = 'TanStackForm.FormComponent'
  return Wrapper
}

export function bindFormComponent(
  Component: FunctionComponent<any>,
  form: AnyFormApi,
  name: string,
) {
  const Wrapper = function AppFormComponent(props: any) {
    return (
      // eslint-disable-next-line @eslint-react/no-context-provider -- Support React 18.
      <FormContext.Provider value={form}>
        <Component {...props} />
      </FormContext.Provider>
    )
  }

  Wrapper.displayName = `TanstackForm.${name}`
  return Wrapper
}

export function createFormContext<
  TOptions extends AnyFormOptions | FormOptionsApi<unknown>,
>(_options: TOptions): FormContextData<TOptions> {
  function Provider({
    form,
    children,
  }: {
    form: ReactFormType<TOptions>
    children?: ReactNode
  }) {
    return (
      // eslint-disable-next-line @eslint-react/no-context-provider -- Support React 18.
      <FormContext.Provider value={form}>{children}</FormContext.Provider>
    )
  }

  Provider.displayName = 'TanStackForm.Provider'

  return {
    Provider,
    useFormContext: useFormContext as never,
  }
}
