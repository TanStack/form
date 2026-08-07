import { For, Show } from 'solid-js'
import { render } from 'solid-js/web'
import { createForm } from '@tanstack/solid-form'
import type { Accessor } from 'solid-js'
import type { AnyFieldApi } from '@tanstack/solid-form'

function FieldInfo(props: { field: Accessor<AnyFieldApi> }) {
  return (
    <>
      <Show when={props.field().meta.isTouched && props.field().meta.isInvalid}>
        <em role="alert">
          <For each={props.field().errors}>
            {(error, index) => (
              <>
                {index() > 0 ? ', ' : ''}
                {error.message}
              </>
            )}
          </For>
        </em>
      </Show>
      <Show when={props.field().meta.isValidating}>Validating...</Show>
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
      console.log(value)
    },
  }))

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div>
          <form.Field
            name="firstName"
            validators={[
              {
                run: ({ value }) =>
                  !value
                    ? 'A first name is required'
                    : value.length < 3
                      ? 'First name must be at least 3 characters'
                      : undefined,
                triggers: ['change'],
              },
              {
                run: async ({ value }) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  return (
                    value.includes('error') &&
                    'No "error" allowed in first name'
                  )
                },
                triggers: ['change'],
                triggerDebounceMs: 500,
              },
            ]}
          >
            {(field) => (
              <>
                <label for={field().name}>First Name:</label>
                <input
                  id={field().name}
                  name={field().name}
                  value={field().value}
                  onBlur={field().handleBlur}
                  onInput={(event) =>
                    field().handleChange(event.currentTarget.value)
                  }
                  aria-invalid={field().meta.isInvalid}
                />
                <FieldInfo field={field} />
              </>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="lastName">
            {(field) => (
              <>
                <label for={field().name}>Last Name:</label>
                <input
                  id={field().name}
                  name={field().name}
                  value={field().value}
                  onBlur={field().handleBlur}
                  onInput={(event) =>
                    field().handleChange(event.currentTarget.value)
                  }
                  aria-invalid={field().meta.isInvalid}
                />
                <FieldInfo field={field} />
              </>
            )}
          </form.Field>
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
          {(state) => (
            <>
              <button type="submit" disabled={!state()[0] || state()[1]}>
                {state()[1] ? '...' : 'Submit'}
              </button>
              <button
                type="reset"
                onClick={(event) => {
                  event.preventDefault()
                  form.reset()
                }}
              >
                Reset
              </button>
            </>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}

render(() => <App />, document.getElementById('root')!)
