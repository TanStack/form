import { For, Loading, Show } from 'solid-js'
import { useMutation, useQuery } from '@tanstack/solid-query'
import { createForm } from '@tanstack/solid-form'
import { db, sleep } from './mock-db'
import type { Accessor } from 'solid-js'
import type { AnyFieldApi } from '@tanstack/solid-form'
import type { StoredUser } from './mock-db'

function FieldInfo(props: { field: Accessor<AnyFieldApi> }) {
  return (
    <>
      <Show when={props.field().meta.isInvalid}>
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

export function App() {
  const userQuery = useQuery(() => ({
    queryKey: ['data'],
    queryFn: () => db.getData(),
  }))

  // Query data is async in Solid 2: reading it before it loads suspends to
  // the nearest `Loading`. The editor is created once the user has loaded.
  return (
    <Loading fallback={<p>Loading...</p>}>
      <Show when={userQuery.data} keyed>
        {(user) => (
          <UserEditor user={user} onSaved={() => userQuery.refetch()} />
        )}
      </Show>
    </Loading>
  )
}

function UserEditor(props: {
  user: StoredUser
  onSaved: () => Promise<unknown>
}) {
  const saveUserMutation = useMutation(() => ({
    mutationFn: (value: StoredUser) => db.saveUser(value),
    onSuccess: () => props.onSaved(),
  }))

  const form = createForm(() => ({
    defaultValues: props.user,
    onSubmit: async ({ formApi, value }) => {
      await saveUserMutation.mutate(value)
      formApi.reset(value)
    },
    errorVisibility: ({ fieldState }) => fieldState.meta.isTouched,
  }))

  return (
    <div>
      <h1>Query Integration Form Example</h1>
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
                await sleep(1000)
                return (
                  value.includes('error') && 'No "error" allowed in first name'
                )
              },
              triggers: ['change'],
              triggerDebounceMs: 500,
            },
          ]}
        >
          {(field) => (
            <div>
              <label for={field().name}>First Name:</label>
              <input
                id={field().name}
                name={field().name}
                value={field().value}
                onBlur={field().handleBlur}
                onInput={(event) =>
                  field().handleChange(event.currentTarget.value)
                }
                aria-invalid={field().meta.isInvalid ? 'true' : 'false'}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
        <form.Field name="lastName">
          {(field) => (
            <div>
              <label for={field().name}>Last Name:</label>
              <input
                id={field().name}
                name={field().name}
                value={field().value}
                onBlur={field().handleBlur}
                onInput={(event) =>
                  field().handleChange(event.currentTarget.value)
                }
                aria-invalid={field().meta.isInvalid ? 'true' : 'false'}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
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
