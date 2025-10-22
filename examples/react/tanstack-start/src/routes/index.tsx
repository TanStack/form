import { createFileRoute } from '@tanstack/react-router'
import { mergeForm, useForm, useTransform } from '@tanstack/react-form-start'
import { useStore } from '@tanstack/react-store'
import { getFormDataFromServer, handleForm } from 'src/utils/form'
import { formOpts } from 'src/utils/form-isomorphic'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => ({
    state: await getFormDataFromServer(),
  }),
})

function Home() {
  const { state } = Route.useLoaderData()

  const form = useForm({
    ...formOpts,
    transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
  })

  const formErrors = useStore(form.store, (formState) => formState.errors)

  return (
    <form action={handleForm.url} method="post" encType={'multipart/form-data'}>
      {formErrors.map((error) => (
        <p key={error as never as string}>{error}</p>
      ))}

      <form.Field
        name="age"
        validators={{
          onChange: ({ value }) =>
            value < 8 ? 'Client validation: You must be at least 8' : undefined,
        }}
      >
        {(field) => {
          return (
            <div>
              <input
                name="age"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
