import React, { useContext } from 'react'
import { FormContext } from './contexts.lib'
import type { AnyFormOptions, FormOptionsApi } from '@tanstack/form-core'
import type { ReactNode } from 'react'
import type { ReactFormType } from '../ReactForm/formType.public'

export function createFormContext<
  TOptions extends AnyFormOptions | FormOptionsApi<unknown>,
>(_options: TOptions) {
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

  function useFormContext() {
    const form = useContext(FormContext)
    if (form === null) {
      throw new Error(
        'TanStack Form: `useFormContext()` must be used within a `Provider` returned by `formContext.create()` or a registered form component.',
      )
    }

    return form as ReactFormType<TOptions>
  }

  return { Provider, useFormContext }
}
