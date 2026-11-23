import React from 'react'
import { FormContext, useFormComponentContext } from './contexts.lib'
import type { AnyFormApi } from '@tanstack/form-core'
import type { ComponentProps, FunctionComponent } from 'react'
import type { FormComponentRegistration } from './formComponentHelpers.public'

export function prepareFormComponent<
  TComponent extends FunctionComponent<any>,
  TPropKey extends keyof ComponentProps<TComponent> & string,
>(
  Component: TComponent,
  formPropKey: TPropKey,
): FormComponentRegistration<TComponent, TPropKey> {
  const Wrapper = function TanStackFormComponent(props: any) {
    const form = useFormComponentContext()
    const innerProps = { ...props, [formPropKey]: form }
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
