import { createRoot } from 'octane'
import { useForm } from '@tanstack/octane-form'
import type { AnyFieldApi } from '@tanstack/octane-form'

function FieldInfo({ field }: { field: AnyFieldApi }) @{
  <>
    @if (field.state.meta.isTouched && !field.state.meta.isValid) {
      <em>{field.state.meta.errors.join(',')}</em>
    }
    @if (field.state.meta.isValidating) {
      <>Validating...</>
    }
  </>
}

function App() @{
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  <div>
    <h1>Simple Octane Form Example</h1>
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <div>
        <form.Field
          name="firstName"
          validators={{
            onChange: ({ value }) => !value
              ? 'A first name is required'
              : value.length < 3
                ? 'First name must be at least 3 characters'
                : undefined,
          }}
          children={(field) => <>
            <label htmlFor={field.name}>First Name:</label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onInput={(e) => field.handleChange(e.currentTarget.value)}
            />
            <FieldInfo field={field} />
          </>}
        />
      </div>

      <div>
        <form.Field
          name="lastName"
          children={(field) => <>
            <label htmlFor={field.name}>Last Name:</label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onInput={(e) => field.handleChange(e.currentTarget.value)}
            />
            <FieldInfo field={field} />
          </>}
        />
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => <>
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit'}
          </button>
          <button
            type="reset"
            onClick={(e) => {
              e.preventDefault()
              form.reset()
            }}
          >
            Reset
          </button>
        </>}
      />
    </form>
  </div>
}

const target = document.getElementById('root')
if (!target) throw new Error('Missing #root')
createRoot(target).render(App)
