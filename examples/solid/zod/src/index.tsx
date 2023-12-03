/* @refresh reload */
import { render } from 'solid-js/web'

import { createForm, type FieldApi } from '@tanstack/solid-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'

interface FieldInfoProps {
  field: FieldApi<any, any, unknown, unknown>
}

function FieldInfo(props: FieldInfoProps) {
  return (
    <>
      {props.field.state.meta.touchedErrors ? (
        <em>{props.field.state.meta.touchedErrors}</em>
      ) : null}
      {props.field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

function App() {
  const form = createForm(() => ({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: async (values) => {
      // Do something with form data
      console.log(values)
    },
    // Add a validator to support Zod usage in Form and Field
    validator: zodValidator,
  }))

  return (
    <div>
      <h1>Zod Form Example</h1>
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
                onChange: z
                  .string()
                  .min(3, 'First name must be at least 3 characters'),
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: z.string().refine(
                  async (value) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    return !value.includes('error')
                  },
                  {
                    message: "No 'error' allowed in first name",
                  },
                ),
              }}
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <label for={field().name}>First Name:</label>
                    <input
                      name={field().name}
                      value={field().state.value}
                      onBlur={field().handleBlur}
                      onInput={(e) => field().handleChange(e.target.value)}
                    />
                    <FieldInfo field={field()} />
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
                  <label for={field().name}>Last Name:</label>
                  <input
                    name={field().name}
                    value={field().state.value}
                    onBlur={field().handleBlur}
                    onInput={(e) => field().handleChange(e.target.value)}
                  />
                  <FieldInfo field={field()} />
                </>
              )}
            />
          </div>
          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
            children={(state) => {
              return (
                <button type="submit" disabled={!state().canSubmit}>
                  {state().isSubmitting ? '...' : 'Submit'}
                </button>
              )
            }}
          />
        </form>
      </form.Provider>
    </div>
  )
}

const root = document.getElementById('root')

render(() => <App />, root!)
