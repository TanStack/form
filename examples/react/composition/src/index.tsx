import * as React from 'react'
import { createRoot } from 'react-dom/client'

import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'

import useAppForm from './AppForm/AppForm'

export default function App() {
  const form = useAppForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  return (
    <div>
      <h1>Simple Form Example</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        {/* A type-safe field component*/}
        <form.AppField
          name="firstName"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'A first name is required'
                : value.length < 3
                  ? 'First name must be at least 3 characters'
                  : undefined,
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              await new Promise((resolve) => setTimeout(resolve, 1000))
              return value.includes('error')
                ? 'No "error" allowed in first name'
                : undefined
            },
          }}
        >
          {(f) => <f.TextField label="First Name" />}
        </form.AppField>

        <form.AppField name="lastName">
          {(f) => <f.TextField label="Last Name" />}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton label="save" />
        </form.AppForm>
      </form>
    </div>
  )
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(
  <React.StrictMode>
    <App />

    <TanStackDevtools
      config={{ hideUntilHover: true }}
      plugins={[formDevtoolsPlugin()]}
    />
  </React.StrictMode>,
)
