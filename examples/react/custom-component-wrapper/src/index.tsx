import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { useForm } from '@tanstack/react-form'
import type {
  DeepKeys,
  DeepValue,
  FieldOptions,
  ReactFormApi,
} from '@tanstack/react-form'

// Our types (to move into `core`)
type SelfKeys<T> = {
  [K in keyof T]: K
}[keyof T]

// Utility type to narrow allowed TName values to only specific types
// IE: DeepKeyValueName<{ foo: string; bar: number }, string> = 'foo'
type DeepKeyValueName<TFormData, TField> = SelfKeys<{
  [K in DeepKeys<TFormData> as DeepValue<TFormData, K> extends TField
    ? K
    : never]: K
}>

// The rest of the app
interface TextInputFieldProps<
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, string>,
> extends FieldOptions<TFormData, TName> {
  form: ReactFormApi<TFormData, any>
  // Your custom props
  size?: 'small' | 'large'
}

function TextInputField<
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, string>,
>({ form, name, size, ...fieldProps }: TextInputFieldProps<TFormData, TName>) {
  return (
    <form.Field<TName, any, any>
      {...fieldProps}
      name={name}
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
          </>
        )
      }}
    />
  )
}

export default function App() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      age: 0,
      foo: [] as Array<{ bar: string; baz: number }>,
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
        <div>
          {/* A type-safe, wrapped field component*/}
          <TextInputField
            form={form}
            name="firstName"
            validators={{
              onChange: ({ value }) => {
                if (value.length < 3) {
                  return 'Name must be at least 3 characters long'
                }
                return undefined
              },
            }}
          />
        </div>
        <div>
          {/* Correctly throws a warning when the wrong data type is passed */}
          <TextInputField form={form} name="age" />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </button>
              <button type="reset" onClick={() => form.reset()}>
                Reset
              </button>
            </>
          )}
        />
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
