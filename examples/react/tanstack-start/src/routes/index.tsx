import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { getFormDataFromServer, handleForm } from 'src/utils/form'
import { formOpts } from 'src/utils/form-isomorphic'

type HomeSearch = {
  status?: 'success'
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    return search.status === 'success' ? { status: 'success' } : {}
  },
  component: Home,
  loader: async () => ({
    state: await getFormDataFromServer(),
  }),
})

function Home() {
  const { state } = Route.useLoaderData()
  const { status } = Route.useSearch()
  const handleFormFn = useServerFn(handleForm)

  const form = useForm({
    ...formOpts,
    serverState: state,
  })

  return (
    <main className="page-shell">
      {status === 'success' ? (
        <p className="success-message" role="status">
          Form submitted successfully.
        </p>
      ) : null}

      <p className="eyebrow">TanStack Start</p>
      <h1 id="page-title">Server validated form</h1>
      <form
        action={handleForm.url}
        method="post"
        encType="multipart/form-data"
        noValidate
        onSubmit={async (event) => {
          event.preventDefault()
          event.stopPropagation()
          const formElement = event.currentTarget
          const errors = await form.handleSubmit()

          if (errors.length === 0) {
            await handleFormFn({ data: new FormData(formElement) })
          }
        }}
      >
        <form.Field name="firstName">
          {(field) => {
            const hasErrors = field.errors.length > 0
            const errorId = `${field.name}-errors`

            return (
              <div className="field">
                <label htmlFor={field.name}>First name</label>
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  autoComplete="given-name"
                  value={field.value}
                  aria-invalid={hasErrors}
                  aria-describedby={hasErrors ? errorId : undefined}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {hasErrors ? (
                  <div id={errorId} className="field-errors" role="alert">
                    {field.errors.map((error) => (
                      <p key={error.message}>{error.message}</p>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          }}
        </form.Field>

        <form.Field name="age">
          {(field) => {
            const hasErrors = field.errors.length > 0
            const errorId = `${field.name}-errors`

            return (
              <div className="field">
                <label htmlFor={field.name}>Age</label>
                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={field.value}
                  aria-invalid={hasErrors}
                  aria-describedby={hasErrors ? errorId : undefined}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value === ''
                        ? 0
                        : event.target.valueAsNumber,
                    )
                  }
                />
                {hasErrors ? (
                  <div id={errorId} className="field-errors" role="alert">
                    {field.errors.map((error) => (
                      <p key={error.message}>{error.message}</p>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          }}
        </form.Field>

        <div className="actions">
          <form.Subscribe
            selector={(formState) => [
              formState.canSubmit,
              formState.isSubmitting,
            ]}
          >
            {([canSubmit, isSubmitting]) => (
              <button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? 'Submitting' : 'Submit'}
              </button>
            )}
          </form.Subscribe>
          <button
            type="reset"
            className="secondary"
            onClick={(event) => {
              event.preventDefault()
              form.reset()
            }}
          >
            Reset
          </button>
        </div>
      </form>

      <form.Subscribe selector={(formState) => formState.values}>
        {(values) => (
          <output className="values-preview">
            {JSON.stringify(values, null, 2)}
          </output>
        )}
      </form.Subscribe>
    </main>
  )
}
