import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { useForm } from '@tanstack/react-form'
import type { DeepKeys, DeepValue, ReactFormApi } from '@tanstack/react-form'

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

export type Pretty<T> = {
  [K in keyof T]: T[K]
} & {}

// The rest of the app
type InputFieldProps<
  TFormData extends object,
  TName extends DeepKeyValueName<TFormData, string>,
> = {
  form: ReactFormApi<TFormData, any>
  name: TName
  // Your custom props
  size?: 'small' | 'large'
}

function TextInputField<
  TFormData extends object,
  TName extends DeepKeyValueName<TFormData, string>,
>({ form, name }: InputFieldProps<TFormData, TName>) {
  return (
    <form.Field
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
      0: '',
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
          <TextInputField form={form} name="firstName" />
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
