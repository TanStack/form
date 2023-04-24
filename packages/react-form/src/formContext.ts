import { FormApi } from '@tanstack/form-core'
import * as React from 'react'

export const formContext = React.createContext<FormApi<any>>(null!)

export function useFormContext(customFormApi?: FormApi<any>) {
  const formApi = React.useContext(formContext)

  if (customFormApi) {
    return customFormApi
  }

  if (!formApi) {
    throw new Error(`You are trying to use the form API outside of a form!`)
  }

  return formApi
}
