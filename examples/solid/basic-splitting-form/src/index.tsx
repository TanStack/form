import { render } from 'solid-js/web'
import { createForm } from '@tanstack/solid-form'
import { FormSection } from './FormSection'
import { FormSubmitButton } from './FormSubmitButton'
import { StringField } from './StringField'
import { sharedFormOptions } from './sharedForm'
import './index.css'

function App() {
  const form = createForm(() => ({
    ...sharedFormOptions,
    onSubmit: ({ value }) => {
      console.log(value)
    },
  }))

  return (
    <div>
      <h1>Form Splitting Example</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field name="firstName">
          {(field) => <StringField field={field} label="First Name" />}
        </form.Field>
        <form.Field name="lastName">
          {(field) => <StringField field={field} label="Last Name" />}
        </form.Field>

        <FormSection form={form} />

        <FormSubmitButton form={form} />
        <button
          type="reset"
          onClick={(event) => {
            event.preventDefault()
            form.reset()
          }}
        >
          Reset
        </button>
      </form>
    </div>
  )
}

render(() => <App />, document.getElementById('root')!)
