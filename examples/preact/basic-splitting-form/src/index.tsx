import { useForm } from '@tanstack/preact-form'
import { render } from 'preact'
import './index.css'
import { StringField } from './StringField'
import { sharedFormOptions } from './sharedForm'
import { FormSection } from './FormSection'
import { FormSubmitButton } from './FormSubmitButton'

function App() {
  const form = useForm({
    ...sharedFormOptions,
    onSubmit: ({ value }) => {
      // Do something with form data
      console.log(value)
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
        <form.Field name="firstName">
          {(field) => <StringField field={field} />}
        </form.Field>
        <form.Field name="lastName">
          {(field) => <StringField field={field} />}
        </form.Field>

        <FormSection form={form} />

        <FormSubmitButton form={form} />
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

render(<App />, document.getElementById('root')!)
