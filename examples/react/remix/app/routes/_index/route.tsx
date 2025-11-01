import { Form, useActionData } from '@remix-run/react'

import { mergeForm, useForm, useTransform } from '@tanstack/react-form'
import {
  ServerValidateError,
  createServerValidate,
  formOptions,
  initialFormState,
} from '@tanstack/react-form/remix'
import { useStore } from '@tanstack/react-store'

import type { ActionFunctionArgs } from '@remix-run/node'

const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    age: 0,
    score: 0,
  },
})

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (value.age < 12) {
      return {
        fields: {
          age: 'Field level error: You must be at least 12 to sign up',
        },
        form: 'Form level error: You must be at least 12 to sign up', // Can be omitted or be a string for form-level errors
      }
    }

    if (value.score <= 90) {
      return 'Form level error: Score must be over 90' // Also valid; Form-level
    }
  },
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  try {
    const validatedData = await serverValidate(formData)
    console.log('validatedData', validatedData)
    // Persist the form data to the database
    // await sql`
    //   INSERT INTO users (name, email, password)
    //   VALUES (${validatedData.name}, ${validatedData.email}, ${validatedData.password})
    // `
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState
    }

    // Some other error occurred while validating your form
    throw e
  }

  // Your form has successfully validated!
  return null
}

export default function Index() {
  const actionData = useActionData<typeof action>()

  const form = useForm({
    ...formOpts,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, actionData ?? {}),
      [actionData],
    ),
  })
  const formErrors = useStore(form.store, (formState) => formState.errors)

  return (
    <Form method="post" onSubmit={() => form.handleSubmit()}>
      {formErrors.map((error) => (
        <p key={error as string}>{error}</p>
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
                name={field.name}
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
      <form.Field
        name="score"
        validators={{
          onChange: ({ value }) =>
            value < 80
              ? 'Client validation: You must be at least 80'
              : undefined,
        }}
      >
        {(field) => {
          return (
            <div>
              <input
                name={field.name}
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
    </Form>
  )
}
