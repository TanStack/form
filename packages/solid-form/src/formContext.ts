import { createContext, useContext } from 'solid-js'
import type { FormApi, Validator } from '@tanstack/form-core'

type FormContextType =
  | undefined
  | {
      formApi: FormApi<any, Validator<any, unknown> | undefined>
      parentFieldName?: string
    }

export const formContext = createContext<FormContextType>(undefined)

export function useFormContext() {
  const formApi: FormContextType = useContext(formContext)

  if (!formApi)
    throw new Error(`You are trying to use the form API outside of a form!`)

  return formApi
}
