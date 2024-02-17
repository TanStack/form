import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { useForm } from '@tanstack/react-form'
import type { FieldApi } from '@tanstack/react-form'

function IsDirtyInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return <code>isDirty? {field.state.meta.isDirty ? 'true' : 'false'}</code>
}

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.touchedErrors ? (
        <em>{field.state.meta.touchedErrors}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

export default function App() {
  const form = useForm({
    defaultValues: {
      firstName: 'Jack',
      lastName: '',
      hobbies: [
        { name: 'running', description: 'Running a few laps in the morning' },
        { name: 'pilates', description: 'Doing 30 mins of pilates after work' },
      ],
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <div>
            {/* A type-safe field component*/}
            <form.Field
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
                  return (
                    value.includes('error') &&
                    'No "error" allowed in first name'
                  )
                },
              }}
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <label htmlFor={field.name}>First Name:</label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <IsDirtyInfo field={field} />
                    <FieldInfo field={field} />
                  </>
                )
              }}
            />
          </div>
          <div>
            <form.Field
              name="lastName"
              children={(field) => (
                <>
                  <label htmlFor={field.name}>Last Name:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <IsDirtyInfo field={field} />
                  <FieldInfo field={field} />
                </>
              )}
            />
          </div>
          <form.Field
            name="hobbies"
            mode="array"
            children={(hobbiesField) => (
              <div>
                Hobbies
                <div>
                  {!hobbiesField.state.value.length
                    ? 'No hobbies found.'
                    : hobbiesField.state.value.map((_, i) => (
                        <div key={i}>
                          <hobbiesField.Field
                            index={i}
                            name="name"
                            children={(field) => {
                              return (
                                <div>
                                  <label htmlFor={field.name}>Name:</label>
                                  <input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                  />
                                  <button
                                    type="button"
                                    onClick={() => hobbiesField.removeValue(i)}
                                  >
                                    X
                                  </button>
                                  <FieldInfo field={field} />
                                </div>
                              )
                            }}
                          />
                          <hobbiesField.Field
                            index={i}
                            name="description"
                            children={(field) => {
                              return (
                                <div>
                                  <label htmlFor={field.name}>
                                    Description:
                                  </label>
                                  <input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                  />
                                  <FieldInfo field={field} />
                                </div>
                              )
                            }}
                          />
                        </div>
                      ))}
                  <IsDirtyInfo field={hobbiesField} />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    hobbiesField.pushValue({
                      name: '',
                      description: '',
                    })
                  }
                >
                  Add hobby
                </button>
              </div>
            )}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </button>
            )}
          />
          <form.Subscribe
            selector={(state) => [state.isTouched, state.isDirty]}
            children={([isTouched, isDirty]) => (
              <div>
                <p>
                  <code>isTouched:{isTouched ? 'true' : 'false'}</code>
                </p>
                <p>
                  <code>isDirty:{isDirty ? 'true' : 'false'}</code>
                </p>
              </div>
            )}
          />
        </form>
      </form.Provider>
    </div>
  )
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(<App />)
