import React from 'react'
import ReactDOM from 'react-dom/client'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

// Form data type definition
interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// Zod schema definition
const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
})

function App() {
  // Default form (schema applied to all fields)
  const defaultForm = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    } as FormData,
    validators: {
      onChange: formSchema,
    },
  })

  // Global disable form
  const disabledForm = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    } as FormData,
    validators: {
      onChange: formSchema,
    },
    disableFieldMapping: true, // Disable schema errors for all fields
  })

  // Selective disable form
  const selectiveForm = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    } as FormData,
    validators: {
      onChange: formSchema,
    },
    disableFieldMapping: {
      fields: {
        username: true,  // Disable schema errors for username field only
        email: false,    // Enable schema errors for email field
        // password, confirmPassword use default (enabled)
      },
    },
  })

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>disableFieldMapping Example</h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Default Form */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px' }}>
          <h2>Default Form (All Schema Errors Enabled)</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              defaultForm.handleSubmit()
            }}
          >
            <defaultForm.Field name="username">
              {(field) => (
                <div style={{ marginBottom: '10px' }}>
                  <label>Username:</label>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div style={{ color: 'red', fontSize: '12px' }}>
                      {field.state.meta.errors[0]}
                    </div>
                  )}
                </div>
              )}
            </defaultForm.Field>

            <defaultForm.Field name="email">
              {(field) => (
                <div style={{ marginBottom: '10px' }}>
                  <label>Email:</label>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div style={{ color: 'red', fontSize: '12px' }}>
                      {field.state.meta.errors[0]}
                    </div>
                  )}
                </div>
              )}
            </defaultForm.Field>

            <button type="submit">Submit</button>
          </form>
        </div>

        {/* Global Disable Form */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px' }}>
          <h2>Global Disable Form</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              disabledForm.handleSubmit()
            }}
          >
            <disabledForm.Field name="username">
              {(field) => (
                <div style={{ marginBottom: '10px' }}>
                  <label>Username:</label>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div style={{ color: 'red', fontSize: '12px' }}>
                      {field.state.meta.errors[0]}
                    </div>
                  )}
                </div>
              )}
            </disabledForm.Field>

            <disabledForm.Field name="email">
              {(field) => (
                <div style={{ marginBottom: '10px' }}>
                  <label>Email:</label>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div style={{ color: 'red', fontSize: '12px' }}>
                      {field.state.meta.errors[0]}
                    </div>
                  )}
                </div>
              )}
            </disabledForm.Field>

            <button type="submit">Submit</button>
          </form>
        </div>

        {/* Selective Disable Form */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px' }}>
          <h2>Selective Disable Form</h2>
          <p style={{ fontSize: '12px', color: '#666' }}>
            username: Schema errors disabled<br/>
            email: Schema errors enabled
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              selectiveForm.handleSubmit()
            }}
          >
            <selectiveForm.Field name="username">
              {(field) => (
                <div style={{ marginBottom: '10px' }}>
                  <label>Username:</label>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div style={{ color: 'red', fontSize: '12px' }}>
                      {field.state.meta.errors[0]}
                    </div>
                  )}
                </div>
              )}
            </selectiveForm.Field>

            <selectiveForm.Field name="email">
              {(field) => (
                <div style={{ marginBottom: '10px' }}>
                  <label>Email:</label>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div style={{ color: 'red', fontSize: '12px' }}>
                      {field.state.meta.errors[0]}
                    </div>
                  )}
                </div>
              )}
            </selectiveForm.Field>

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)
