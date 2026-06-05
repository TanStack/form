import ReactDOM from 'react-dom/client'
import './index.css'
import { sharedFormOptions } from './sharedForm'
import { FormSection } from './FormSection'
import { FormSubmitButton } from './FormSubmitButton'
import { useAppForm } from './appForm/createFormHook'

function App() {
  const form = useAppForm({
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
          {(field) => (
            <>
              <field.Text />
              <field.Number />
              <field.SelectMenu field={field} options={['Anything', 'Goes']} />
              <field.Error />
            </>
          )}
        </form.Field>
        <form.Field name="age">
          {(field) => (
            <>
              <field.Text />
              <field.Number />
              <field.SelectMenu field={field} options={['Anything', 'Goes']} />
              <field.Error />
            </>
          )}
        </form.Field>
        <form.Field name="fooOrBar">
          {(field) => (
            <>
              <field.Text />
              <field.Number />
              <field.SelectMenu field={field} options={['Anything', 'Goes']} />
              <field.SelectMenu field={field} options={['foo', 'bar']} />
              <field.Error />
            </>
          )}
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

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
