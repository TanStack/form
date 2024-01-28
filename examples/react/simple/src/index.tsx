import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { useForm } from '@tanstack/react-form'

export default function App() {
  const form = useForm({
    defaultValues: {
      people: [] as Array<{age: number, name: string}>
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      alert(JSON.stringify(value, null, 2))
    },
  })

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Field name="people">
          {(field) => {
            return <div>
              {field.state.value.map((_, i) => {
                return <form.Field name={`people[${i}].name`}>
                  {subField => {
                    return (
                      <div><label><div>Name for person {i}</div><input value={subField.state.value} onChange={e => subField.handleChange(e.target.value)} /></label></div>
                    )}}
                </form.Field>
              })}
              <button onClick={() => field.pushValue({name: "", age: 0})} type="button">Add person</button>
            </div>
          }}
        </form.Field>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </button>
          )}
        />
      </form>
    </div>
  )
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(<App />)
