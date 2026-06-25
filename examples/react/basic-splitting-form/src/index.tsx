import { TanStackDevtools } from '@tanstack/react-devtools'
import { useForm } from '@tanstack/react-form'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import ReactDOM from 'react-dom/client'
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
      <TanStackDevtools
        plugins={[formDevtoolsPlugin()]}
        config={{
          hideUntilHover: false,
        }}
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
