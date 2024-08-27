import {
  ServerValidateError,
  createForm,
  createServerValidate,
  createTransform,
  formOptions,
  getFormData,
  mergeForm,
  initialFormState,
} from '@tanstack/solid-form'
import { action, cache, createAsync } from '@solidjs/router'

const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    lastName: '',
  },
})

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (value.age < 12) {
      return 'Server validation: You must be at least 12 to sign up'
    }
  },
})

const onSubmit = action(async (formData: FormData) => {
  'use server'
  console.log('ALIVE')

  try {
    await serverValidate(formData)
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.reload
    }
  }
})

const getFormDataLocal = cache(async () => {
  'use server'
  return getFormData()
}, '_tanstackInternals')

// export const route = {
//   // preload: () => {
//   //   getFormData()
//   // }
// } satisfies RouteDefinition

export default function Home() {
  const data = createAsync(() => {
    return getFormDataLocal()
  })

  const form = createForm(() => ({
    ...formOpts,
    ...({
      transform: createTransform(
        (baseForm) => mergeForm(baseForm, data() ?? initialFormState),
        [data],
      ),
    } as unknown as {}),
  }))

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form action={onSubmit} method="post">
        <div>
          {/* A type-safe field component*/}
          <form.Field
            name="firstName"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? 'A first name is required'
                  : value.length < 3
                    ? 'First name must be at least 3 characters'
                    : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                return (
                  value.includes('error') && 'No "error" allowed in first name'
                )
              },
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
