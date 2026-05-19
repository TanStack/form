import { useForm } from '@tanstack/react-form'
import ReactDOM from 'react-dom/client'
import type { AnyFieldApi } from '@tanstack/react-form'
import './index.css'

interface FieldInfoProps {
  field: AnyFieldApi
}
function FieldError({ field }: FieldInfoProps) {
  return (
    <small role={field.meta.isInvalid ? 'alert' : undefined} aria-live="polite">
      {field.errors.map((e) => e.message).join('\n')}
    </small>
  )
}

function App() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: ({ value, createValidationError }) => {
      // Do something with form data
      console.log(value)

      // If your endpoint returned validation errors, pass them on
      return createValidationError({
        fields: {
          // Set field-specific errors from the form!
          firstName: 'Name already exists',
          lastName: 'Name already exists',
        },
      })
    },
  })

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
        {/* A type-safe field component*/}
        <form.Field
          name="firstName"
          validators={[
            {
              run: ({ value }) => {
                if (value.length === 0) return 'A first name is required'
                if (value.length < 3) return 'First name is too short'
              },
              // Define what should trigger validation. Submissions trigger validation by default.
              triggers: ['change', 'blur'],
              triggerDebounceMs: 300,
            },
            {
              // Supports async functions!
              run: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                return (
                  value.toLowerCase().includes('error') &&
                  'No "error" allowed in first name'
                )
              },
              triggers: ['change'],
              // prevent expensive validators from running
              bailIfInvalid: true,
            },
          ]}
        >
          {(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <label className={field.meta.isValidating ? 'validating' : ''}>
                <span>First Name</span>

                <input
                  name={field.name}
                  value={field.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.meta.isInvalid}
                />
                <FieldError field={field} />
              </label>
            )
          }}
        </form.Field>
        <form.Field name="lastName">
          {(field) => (
            <label className={field.meta.isValidating ? 'validating' : ''}>
              <span>Last Name</span>
              <input
                name={field.name}
                value={field.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={field.meta.isInvalid}
              />
              <FieldError field={field} />
            </label>
          )}
        </form.Field>
        {/** Subscribe to form state to have reactive components */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? '...' : 'Submit'}
            </button>
          )}
        </form.Subscribe>
        <button
          type="reset"
          onClick={(e) => {
            // Avoid unexpected resets of form elements (especially <select> elements)
            e.preventDefault()
            form.reset()
          }}
        >
          Reset
        </button>
      </form>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
