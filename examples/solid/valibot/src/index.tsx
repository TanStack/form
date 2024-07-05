/* @refresh reload */
import { render } from 'solid-js/web'

import { createForm } from '@tanstack/solid-form'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import * as v from 'valibot'
import type { FieldApi } from '@tanstack/solid-form'

interface FieldInfoProps {
  field: FieldApi<any, any, any, any>
}

function FieldInfo(props: FieldInfoProps) {
  return (
    <>
      {props.field.state.meta.isTouched ? (
        <em>{props.field.state.meta.errors}</em>
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
    // Add a validator to support Valibot usage in Form and Field
    validatorAdapter: valibotValidator(),
  }))

  return (
    <div>
      <h1>Valibot Form Example</h1>
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
              onChange: v.pipe(
                v.string(),
                v.minLength(3, 'You must have a length of at least 3'),
              ),
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: v.pipeAsync(
                v.string(),
                v.checkAsync(async (value) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  return !value.includes('error')
                }, "No 'error' allowed in first name"),
              ),
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
