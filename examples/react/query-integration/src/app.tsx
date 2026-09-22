import { useForm } from '@tanstack/react-form'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { db, sleep } from './mock-db'
import type { StoredUser } from './mock-db'
import type { AnyFieldApi } from '@tanstack/react-form'

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.meta.isInvalid && (
        <em>{field.errors.map((error) => error.message).join(',')}</em>
      )}
      {field.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

const emptyUser: StoredUser = {
  firstName: '',
  lastName: '',
}

export function App() {
  const userQuery = useQuery({
    queryKey: ['data'],
    queryFn: () => db.getData(),
    // Keeps the old values present while refetching new ones
    placeholderData: keepPreviousData,
  })

  const saveUserMutation = useMutation({
    mutationFn: async (value: StoredUser) => {
      return db.saveUser(value)
    },
    onSuccess: async () => {
      // Invalidating query to recheck fresh data
      await userQuery.refetch()
    },
  })

  const form = useForm({
    defaultValues: userQuery.data ?? emptyUser,
    onSubmit: async ({ formApi, value }) => {
      await saveUserMutation.mutateAsync(value)

      // Pass optimistic values to the form so that it doesn't show old values
      formApi.reset(value)
    },
    // Only show errors if the field has been touched
    errorVisibility: ({ fieldState }) => fieldState.meta.isTouched,
  })

  if (userQuery.isLoading) return <p>Loading..</p>

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
              <label htmlFor={field.name}>First Name:</label>
              <input
                id={field.name}
                name={field.name}
                value={field.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
        <form.Field name="lastName">
          {(field) => (
            <div>
              <label htmlFor={field.name}>Last Name:</label>
              <input
                id={field.name}
                name={field.name}
                value={field.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <>
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </button>
              <button type="reset" onClick={() => form.reset()}>
                Reset
              </button>
            </>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}
