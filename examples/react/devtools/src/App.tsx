import { useForm } from '@tanstack/react-form'

import type { AnyFieldApi } from '@tanstack/react-form'

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(',')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

export default function App() {
  const form1 = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  const form2 = useForm({
    defaultValues: {
      age: 0,
    },
    validators: {
      onChange({ value }) {
        if (value.age < 15) {
          return 'needs to be above 15'
        }
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      if (value.age < 20) throw 'needs to be above 20'
    },
  })

  return (
    <div>
      <h1>Form Devtools Example</h1>

      <h2>Form 1</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form1.handleSubmit()
        }}
      >
        <div>
          <form1.Field
            name="firstName"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? 'A first name is required'
                  : value.length < 3
                    ? 'First name must be at least 3 characters'
                    : undefined,
            }}
            children={(field) => {
              return (
                <>
                  <label htmlFor={field.name}>First Name:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              )
            }}
          />
        </div>

        <div>
          <form1.Field
            name="lastName"
            children={(field) => (
              <>
                <label htmlFor={field.name}>Last Name:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>

        <form1.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </button>
              <button
                type="reset"
                onClick={(e) => {
                  e.preventDefault()
                  form1.reset()
                }}
              >
                Reset
              </button>
            </>
          )}
        />

        <form1.Subscribe
          selector={(state) => [state.submissionAttempts]}
          children={([submissionAttempts]) => (
            <div>submission attempts: {submissionAttempts}</div>
          )}
        />
      </form>

      <h2>Form 2</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form2.handleSubmit()
        }}
      >
        <div>
          <form2.Field
            name="age"
            validators={{
              onChange: ({ value }) =>
                value < 10 ? 'Age must be at least 10' : undefined,
            }}
            children={(field) => {
              return (
                <>
                  <label htmlFor={field.name}>age:</label>
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(parseInt(e.target.value))
                    }
                  />
                  <FieldInfo field={field} />
                </>
              )
            }}
          />

          <form2.Subscribe
            selector={(state) => [state.submissionAttempts]}
            children={([submissionAttempts]) => (
              <div>submission attempts: {submissionAttempts}</div>
            )}
          />
        </div>
      </form>
    </div>
  )
}
