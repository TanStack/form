import { For } from 'solid-js'
import { render } from 'solid-js/web'
import { createForm } from '@tanstack/solid-form'
import type { Accessor } from 'solid-js'
import type { AnyFieldApi } from '@tanstack/solid-form'
import './index.css'

function FieldError(props: { field: Accessor<AnyFieldApi> }) {
  return (
    <small
      role={props.field().meta.isInvalid ? 'alert' : undefined}
      aria-live="polite"
    >
      <For each={props.field().errors}>
        {(error, index) => (
          <>
            {index() > 0 ? '\n' : ''}
            {error.message}
          </>
        )}
      </For>
    </small>
  )
}

function App() {
  const form = createForm(() => ({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: ({ value, createValidationError }) => {
      console.log(value)
      return createValidationError({
        fields: {
          firstName: 'Name already exists',
          lastName: 'Name already exists',
        },
      })
    },
  }))

  return (
    <div>
      <h1>Basic Form Example</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="firstName"
          validators={[
            {
              run: ({ value }) => {
                if (value.length === 0) return 'A first name is required'
                if (value.length < 3) return 'First name is too short'
              },
              triggers: ['change', 'blur'],
              triggerDebounceMs: 300,
            },
            {
              run: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                return (
                  value.toLowerCase().includes('error') &&
                  'No "error" allowed in first name'
                )
              },
              triggers: ['change'],
              bailIfInvalid: true,
            },
          ]}
        >
          {(field) => (
            <label classList={{ validating: field().meta.isValidating }}>
              <span>First Name</span>
              <input
                name={field().name}
                value={field().value}
                onBlur={field().handleBlur}
                onInput={(event) =>
                  field().handleChange(event.currentTarget.value)
                }
                aria-invalid={field().meta.isInvalid}
              />
              <FieldError field={field} />
            </label>
          )}
        </form.Field>
        <form.Field name="lastName">
          {(field) => (
            <label classList={{ validating: field().meta.isValidating }}>
              <span>Last Name</span>
              <input
                name={field().name}
                value={field().value}
                onBlur={field().handleBlur}
                onInput={(event) =>
                  field().handleChange(event.currentTarget.value)
                }
                aria-invalid={field().meta.isInvalid}
              />
              <FieldError field={field} />
            </label>
          )}
        </form.Field>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
          {(state) => (
            <button type="submit" disabled={!state()[0] || state()[1]}>
              {state()[1] ? '...' : 'Submit'}
            </button>
          )}
        </form.Subscribe>
        <button
          type="reset"
          onClick={(event) => {
            event.preventDefault()
            form.reset()
          }}
        >
          Reset
        </button>
      </form>
    </div>
  )
}

render(() => <App />, document.getElementById('root')!)
