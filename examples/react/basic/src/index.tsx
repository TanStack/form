import ReactDOM from 'react-dom/client'
import { useForm } from '@tanstack/react-form'

const ARRAY = [...new Array(1000).keys()]
const values = ARRAY.map((i) => ({ id: i, message: 'Field ' + i }))

function App() {
  const form = useForm({
    defaultValues: { fields: values },
    validators: [
      {
        validate: ({ fieldApi }) => {
          if (!fieldApi) return
          return {
            fields: {
              [fieldApi.name]: { message: 'Bounce!' },
            },
          }
        },
        signals: [
          { signal: 'change', enabled: ({ fieldApi }) => fieldApi !== null },
        ],
        signalDebounceMs: 500,
      },
    ],
  })

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>TanStack Form - Array field</h1>

      <button onClick={() => form.swapFieldValues('fields', 0, 1)}>
        Swap 0 and 1
      </button>
      <button
        onClick={() =>
          form.pushFieldValue('fields', {
            id: form.state.values.fields.length,
            message: `New Field`,
          })
        }
      >
        Push
      </button>
      <br />
      <form.ArrayField name="fields">
        {(field) => (
          <>
            <h2>Values amount: {field.value.length}</h2>
            {field.value.map((element: any, i: number) => (
              <form.Field key={element.id} name={`fields[${i}].message`}>
                {(field) => (
                  <span style={{ position: 'relative' }}>
                    <input
                      value={field.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <span>{field.meta.isValid ? '✅' : '❌'}</span>
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
          </>
        )}
      </form.ArrayField>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
