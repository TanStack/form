import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { z } from 'zod'
import { useAppForm } from './app-form.tsx'

const formSchema = z.object({
  name: z.string(),
  age: z.number().gte(13, 'You must be 13 to make an account'),
})

type FormValues = z.infer<typeof formSchema>

export default function App() {
  const form = useAppForm({
    defaultValues: {
      name: '',
      age: 0,
    } as FormValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
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
        <div>
          {/* A type-safe field component*/}
          <form.AppField
            name="name"
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return <field.TextField label="Your Name" />
            }}
          />
        </div>
        <div>
          <form.AppField
            name="age"
            children={(field) => <field.NumberField label="Your Age" />}
          />
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
  <MantineProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MantineProvider>,
)
