import ReactDOM from 'react-dom/client'
import { useForm } from '@tanstack/react-form'

const ARRAY = [...new Array(1000).keys()]
const values = ARRAY.map((i) => ({ message: 'Field ' + i }))

function App() {
  const form = useForm({
    defaultValues: { fields: values },
  })

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>TanStack Form - Array field</h1>
      <h2>Values amount: {ARRAY.length}</h2>
      {values.map((_, i) => (
        <form.Field
          key={i}
          name={`fields[${i}].message`}
          validators={[
            {
              validate: ({ value }) =>
                value.length <= 3 && { message: 'Too short (debounced)' },
              signals: ['change'],
              signalDebounceMs: 500,
            },
          ]}
        >
          {(field) => (
            <span style={{ position: 'relative' }}>
              <input
                value={field.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.meta.isInvalid && (
                <span
                  style={{
                    position: 'absolute',
                    backgroundColor: 'black',
                    left: 0,
                    top: '100%',
                    zIndex: 1,
                    color: 'white',
                  }}
                >
                  {field.meta.errors[0].message}
                </span>
              )}
            </span>
          )}
        </form.Field>
      ))}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
