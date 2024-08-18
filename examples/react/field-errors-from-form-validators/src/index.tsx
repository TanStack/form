import { useForm } from '@tanstack/react-form'
import * as React from 'react'
import { createRoot } from 'react-dom/client'

async function verifyAgeOnServer(age: number) {
  return age >= 13
}

async function checkIfUsernameIsTaken(name: string) {
  const usernames = ['user-1', 'user-2', 'user-3']
  return usernames.includes(name)
}

export default function App() {
  const form = useForm({
    defaultValues: {
      username: '',
      age: 0,
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        console.log({ value })
        // Verify the age on the server
        const isNotOlderThan13 = !(await verifyAgeOnServer(value.age))

        // Verify the availability of the username on the server
        const isUsernameTaken = await checkIfUsernameIsTaken(value.username)

        if (isNotOlderThan13 || isUsernameTaken) {
          return {
            // The `form` key is optional
            form: 'Invalid data',
            fields: {
              ...(isUsernameTaken ? { username: 'Username is taken' } : {}),
              ...(isNotOlderThan13
                ? { age: 'Must be 13 or older to sign' }
                : {}),
            },
          }
        }

        return null
      },
    },
  })

  return (
    <div>
      <h1>Field Errors From The Form's validators Example</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Field
          name="username"
          validators={{
            onSubmit: ({ value }) => (!value ? 'Required field' : null),
          }}
          children={(field) => (
            <div>
              <label htmlFor={field.name}>Username:</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value)
                }}
              />
              {field.state.meta.errors.length > 0 ? (
                <em role="alert">{field.state.meta.errors.join(', ')}</em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="age"
          validators={{
            onSubmit: ({ value }) => (!value ? 'Required field' : null),
          }}
          children={(field) => (
            <div>
              <label htmlFor={field.name}>Age:</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                type="number"
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              {field.state.meta.errors.length > 0 ? (
                <em role="alert">{field.state.meta.errors.join(', ')}</em>
              ) : null}
            </div>
          )}
        />

        {form.state.errorMap.onSubmit ? (
          <div>
            <em>
              There was an error on the form: {form.state.errorMap.onSubmit}
            </em>
          </div>
        ) : null}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </button>
          )}
        />
      </form>
    </div>
  )
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(<App />)
