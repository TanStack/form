import { createRoot } from 'react-dom/client'

import { useForm } from '@tanstack/react-form'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function verifyAgeOnServer(age: number) {
  await sleep(Math.floor(Math.random() * 1000))
  return age >= 13
}

async function checkIfUsernameIsTaken(name: string) {
  await sleep(Math.floor(Math.random() * 500))
  const usernames = ['user-1', 'user-2', 'user-3']
  return !usernames.includes(name)
}

export default function App() {
  const form = useForm({
    defaultValues: {
      username: '',
      age: 0,
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        const [isRightAge, isUsernameAvailable] = await Promise.all([
          // Verify the age on the server
          verifyAgeOnServer(value.age),
          // Verify the availability of the username on the server
          checkIfUsernameIsTaken(value.username),
        ])

        if (!isRightAge || !isUsernameAvailable) {
          return {
            // The `form` key is optional
            form: 'Invalid data',
            fields: {
              ...(!isRightAge ? { age: 'Must be 13 or older to sign' } : {}),
              ...(!isUsernameAvailable
                ? { username: 'Username is taken' }
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
              {!field.state.meta.isValid ? (
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
              {!field.state.meta.isValid ? (
                <em role="alert">{field.state.meta.errors.join(', ')}</em>
              ) : null}
            </div>
          )}
        />
        <form.Subscribe
          selector={(state) => [state.errorMap]}
          children={([errorMap]) =>
            errorMap.onSubmit ? (
              <div>
                <em>
                  There was an error on the form: {errorMap.onSubmit.toString()}
                </em>
              </div>
            ) : null
          }
        />
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

createRoot(rootElement).render(
  <>
    <App />

    <TanStackDevtools
      config={{ hideUntilHover: true }}
      plugins={[formDevtoolsPlugin()]}
    />
  </>,
)
