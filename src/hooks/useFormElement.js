import React from 'react'
//

import { FormContextProvider } from './useFormContext'

export default function useFormElement(contextValue) {
  const FormRef = React.useRef()
  const FormApiRef = React.useRef()

  FormApiRef.current = contextValue

  // Create a new form element
  if (!FormRef.current) {
    FormRef.current = React.forwardRef(function Form(
      { children, noFormElement, ...rest },
      ref
    ) {
      const {
        handleSubmit,
        meta: { isSubmitting },
        debugForm,
      } = FormApiRef.current

      return (
        <FormContextProvider value={FormApiRef.current}>
          {noFormElement ? (
            children
          ) : (
            <form onSubmit={handleSubmit} disabled={isSubmitting} ref={ref} {...rest}>
              {children}
              {debugForm ? (
                <div
                  style={{
                    margin: '2rem 0',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bolder',
                    }}
                  >
                    Form State
                  </div>
                  <pre>
                    <code>
                      {JSON.stringify(
                        { ...FormApiRef.current, formContext: undefined },
                        safeStringifyReplace(new Set()),
                        2
                      )}
                    </code>
                  </pre>
                </div>
              ) : null}
            </form>
          )}
        </FormContextProvider>
      )
    })
  }

  // Return the form element
  return FormRef.current
}

function safeStringifyReplace(set) {
  return (key, value) => {
    if (typeof value === 'object' || Array.isArray(value)) {
      if (set.has(value)) {
        return '(circular value)'
      }
      set.add(value)
    }
    return typeof value === 'function' ? undefined : value
  }
}
