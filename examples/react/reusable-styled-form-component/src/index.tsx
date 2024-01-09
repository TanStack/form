import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Form } from './Form'
import { z } from 'zod'

export default function App() {
  return (
    <div className="items-center justify-center flex h-full w-full">
      <Form
        className="space-y-8 w-56"
        formOptions={{
          defaultValues: {
            username: '',
            password: '',
          },
        }}
      >
        <Form.Field
          name="username"
          children={(field) => {
            return <Form.Field.Text field={field} label="Username" />
          }}
        />
        <Form.Field
          name="password"
          validators={{
            onChange: z
              .string()
              .min(9, "Password can't be less than 9 characters")
              .max(20, "Password can't be more than 20 characters")
              .refine((value) => /[A-Z]/.test(value), {
                message: 'Password must include a capital letter',
              })
              .refine((value) => /\d/.test(value), {
                message: 'Password must include a number',
              }),
          }}
          children={(field) => {
            return <Form.Field.Text field={field} label="Password" />
          }}
        />
      </Form>
    </div>
  )
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(<App />)
