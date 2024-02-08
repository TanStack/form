import { createContext, useContext } from 'rehackt'
import type { FormApi, Validator } from '@tanstack/form-core'

export const formContext = createContext<{
  formApi: FormApi<any, Validator<any, unknown> | undefined>
  parentFieldName?: string
} | null>(null!)

export function useFormContext() {
  const formApi = useContext(formContext)

  if (!formApi) {
    throw new Error(`You are trying to use the form API outside of a form!`)
  }

  return formApi
}
