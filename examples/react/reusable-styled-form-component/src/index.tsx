import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Form } from './Form'
import { z } from 'zod'
import { Select } from './Select'

export default function App() {
  return (
    <div className="items-center justify-center flex h-full w-full">
      <Form
        className="space-y-6 w-72"
        formOptions={{
          defaultValues: {
            username: '',
            countryCode: '+1',
            phoneNumber: '',
            password: '',
            showPassword: false,
          },
        }}
      >
        <Form.Field
          name="username"
          children={(field) => {
            return <Form.Field.Text field={field} label="Username" />
          }}
        />
        <div className="relative flex">
          <Form.Field
            name="countryCode"
            children={(field) => {
              return (
                <Form.Field.Select
                  className="rounded-r-none w-20"
                  field={field}
                  displayValue
                >
                  <Select.OptionGroup label="Country code">
                    <Select.Option value="+1">+1 United States</Select.Option>
                    <Select.Option value="+44">
                      +44 United Kingdom
                    </Select.Option>
                    <Select.Option value="+49">+49 Germany</Select.Option>
                    <Select.Option value="+47">+47 Norway</Select.Option>
                  </Select.OptionGroup>
                </Form.Field.Select>
              )
            }}
          />
          <Form.Field
            name="phoneNumber"
            validators={{}}
            children={(field) => {
              return (
                <div className="relative w-full">
                  <Form.Field.Text
                    className="rounded-l-none"
                    field={field}
                    label="Phone Number"
                  />
                  <Form.Field.Error field={field} />
                </div>
              )
            }}
          />
        </div>
        <Form.Field
          name="password"
          validators={{
            onChange: z
              .string()
              .min(9, "Password can't be less than 9 characters")
              .max(20, "Password can't be more than 20 characters")
              .refine(
                (value) => /[A-Z]/.test(value),
                'Password must include a capital letter',
              )
              .refine(
                (value) => /\d/.test(value),
                'Password must include a number',
              ),
          }}
          children={(field) => {
            return (
              <div className="relative">
                <Form.Field.Text field={field} label="Password" />
                <Form.Field.Error field={field} />
              </div>
            )
          }}
        />
        <Form.Field
          name="showPassword"
          children={(field) => {
            return <Form.Field.Checkbox field={field} label="Show Password" />
          }}
        />
      </Form>
    </div>
  )
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(<App />)
