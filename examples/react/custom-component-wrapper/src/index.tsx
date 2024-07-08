import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { useForm } from '@tanstack/react-form'
import type {
  DeepKeyValueName,
  FieldOptions,
  ReactFormApi,
} from '@tanstack/react-form'

/**
 * Export these components to your design system or a dedicated component location
 */
interface TextInputFieldProps<
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, string>,
> extends FieldOptions<TFormData, TName> {
  form: ReactFormApi<TFormData, any>
  // Your custom props
  label: string
}

function TextInputField<
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, string>,
>({ form, name, label, ...fieldProps }: TextInputFieldProps<TFormData, TName>) {
  return (
    // Manually type-cast form.Field to work around this issue:
    // https://twitter.com/crutchcorn/status/1809827621485900049
    <form.Field<TName, any, any>
      {...fieldProps}
      name={name}
      children={(field) => {
        return (
          <div style={{ marginBottom: '1rem' }}>
            <div>
              <label htmlFor={field.name}>{label}</label>
            </div>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.isValidating ? (
              <div style={{ color: 'gray' }}>Validating...</div>
            ) : null}
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
              <div style={{ color: 'red' }}>
                {field.state.meta.errors.join(', ')}
              </div>
            ) : null}
          </div>
        )
      }}
    />
  )
}

function SubmitButton({ form }: { form: ReactFormApi<any, any> }) {
  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <>
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit'}
          </button>
        </>
      )}
    />
  )
}

/**
 * Then use it in your application
 */
export default function App() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      age: 0,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  return (
    <div>
      <h1>Wrapped Fields Form Example</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        {/* A type-safe, wrapped field component*/}
        <TextInputField
          label={'First name:'}
          form={form}
          name="firstName"
          validators={{
            onChangeAsync: async ({ value }) => {
              await new Promise((resolve) => setTimeout(resolve, 1000))
              if (value.length < 3) {
                return 'Name must be at least 3 characters long'
              }
              return undefined
            },
          }}
        />
        {/* Correctly throws a warning when the wrong data type is passed */}
        <TextInputField label={'Age:'} form={form} name="age" />
        <SubmitButton form={form} />
        <button type="reset" onClick={() => form.reset()}>
          Reset
        </button>
      </form>
    </div>
  )
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
