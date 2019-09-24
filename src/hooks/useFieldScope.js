import React from 'react'
//

import { FormContextProvider } from './useFormContext'

export default function useFieldScope(contextValue) {
  const FieldScopeRef = React.useRef()
  const FieldScopeApiRef = React.useRef()

  FieldScopeApiRef.current = contextValue

  // Create a new form element
  if (!FieldScopeRef.current) {
    FieldScopeRef.current = function Field({ children }) {
      return (
        <FormContextProvider value={FieldScopeApiRef.current}>
          {children}
        </FormContextProvider>
      )
    }
  }

  return FieldScopeRef.current
}
