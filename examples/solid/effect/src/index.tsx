/* @refresh reload */
import { render } from 'solid-js/web'

import { createForm } from '@tanstack/solid-form'
import { Schema } from '@effect/schema'
import { effectValidator } from '@tanstack/effect-form-adapter'
import type { FieldApi } from '@tanstack/solid-form'

const Person = Schema.Struct({
  firstName: Schema.String.pipe(Schema.minLength(3)),
  lastName: Schema.String.pipe(Schema.minLength(3)),
})

interface FieldInfoProps {
  field: FieldApi<any, any, any, any>
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
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
    // Add a validator to support Zod usage in Form and Field
    validatorAdapter: effectValidator,
  }))

  return (
    <div>
      <h1>TanStack Form Solid Effect Example App</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div>
          {/* A type-safe field component*/}
          <form.Field
            name="firstName"
            validators={{
              onChange: Person.fields.firstName,
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <label for={field().name}>First Name:</label>
                  <input
                    id={field().name}
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
            validators={{
              onChange: Person.fields.lastName,
            }}
            children={(field) => (
              <>
                <label for={field().name}>Last Name:</label>
                <input
                  id={field().name}
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
    </div>
  )
}

const root = document.getElementById('root')

render(() => <App />, root!)
