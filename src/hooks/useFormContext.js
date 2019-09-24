import React from 'react'
//

const formContext = React.createContext()

export function FormContextProvider({ value, children }) {
  return <formContext.Provider value={value}>{children}</formContext.Provider>
}

export default function useFormContext(manualFormContext) {
  let formApi = React.useContext(formContext)

  if (manualFormContext) {
    return manualFormContext
  }

  if (!formApi) {
    throw new Error(`You are trying to use the form API outside of a form!`)
  }

  return formApi
}
