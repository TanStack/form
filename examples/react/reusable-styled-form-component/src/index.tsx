import * as React from 'react'
import { createRoot } from 'react-dom/client'
import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  formatPhoneNumberIntl,
} from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en'
import { z } from 'zod'

import { Form } from './Form'
import { Select } from './Select'

function Username({ useStore }) {
  const submissionAttempts = useStore((state) => state.submissionAttempts)

  function checkUsernameTaken(username) {
    return new Promise<void>((resolve, reject) => {
      const isTaken = [
        'NoobMaster69',
        'RickAstley',
        'Michael',
        'Tanner',
      ].includes(username)
      if (isTaken) {
        reject(`The username ${username} is already taken`)
      } else {
        resolve()
      }
    })
  }

  return (
    <Form.Field
      name="username"
      validators={
        submissionAttempts !== 0 && {
          onChange: z
            .string()
            .min(3, "Username can't be less than 3 characters"),
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: async ({ value }) => {
            await checkUsernameTaken(value)
          },
        }
      }
      children={(field) => (
        <div className="relative">
          <Form.Field.Text
            field={field}
            hasErrorField
            label="Username"
            autoComplete="name"
            maxLength={30}
          />
          <Form.Field.Error field={field} />
        </div>
      )}
    />
  )
}

function Phone({ useStore }) {
  const submissionAttempts = useStore((state) => state.submissionAttempts)
  const countryCode = getCountryCallingCode(
    useStore((state) => state.values.country),
  )
  return (
    <div className="relative flex">
      <Form.Field
        name="country"
        children={(field) => (
          <Form.Field.Select className="rounded-r-none w-20" field={field}>
            <Select.OptionGroup label="Country code" />
            {getCountries().map((country) => (
              <Select.Option
                key={country}
                value={country}
                displayValue={'+' + getCountryCallingCode(country)}
              >
                {en[country]} +{getCountryCallingCode(country)}
              </Select.Option>
            ))}
          </Form.Field.Select>
        )}
      />
      <Form.Field
        name="phoneNumber"
        validators={
          submissionAttempts !== 0 && {
            onChange: z
              .string()
              .refine(
                (value) => isValidPhoneNumber('+' + countryCode + value),
                'Invalid phone number',
              ),
          }
        }
        children={(field) => (
          <div className="relative w-full">
            <Form.Field.Text
              className="rounded-l-none"
              field={field}
              hasErrorField
              label="Phone Number"
              type="tel"
              autoComplete="tel"
              maxLength={20}
              onChange={(e) => {
                const phoneNumberValue = e.target.value.replace(
                  /[^0-9\s()+-]/g,
                  '',
                )
                field.handleChange(phoneNumberValue)
              }}
            />
            <Form.Field.Error field={field} />
          </div>
        )}
      />
    </div>
  )
}

function Password({ useStore }) {
  const submissionAttempts = useStore((state) => state.submissionAttempts)
  const showPassword = useStore((state) => state.values.showPassword)
  return (
    <>
      <Form.Field
        name="password"
        validators={
          submissionAttempts !== 0 && {
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
          }
        }
        children={(field) => (
          <div className="relative">
            <Form.Field.Text
              field={field}
              hasErrorField
              label="Password"
              autoComplete="password"
              type={showPassword ? 'text' : 'password'}
            />
            <Form.Field.Error field={field} />
          </div>
        )}
      />
      <Form.Field
        name="showPassword"
        children={(field) => (
          <Form.Field.Checkbox field={field} label="Show Password" />
        )}
      />
    </>
  )
}

export default function App() {
  return (
    <div className="items-center justify-center flex h-full w-full">
      <Form
        className="space-y-6 w-72"
        formOptions={{
          defaultValues: {
            username: '',
            country: 'US',
            phoneNumber: '',
            password: '',
            showPassword: false,
          },
          onSubmit: (form) => {
            const submitValues = {
              username: form.value.username,
              phone: formatPhoneNumberIntl(
                '+' +
                  getCountryCallingCode(form.value.country) +
                  form.value.phoneNumber,
              ),
              password: form.value.password,
            }
            console.log(submitValues)
            alert(JSON.stringify(submitValues, null, 2))
          },
        }}
      >
        {(useStore) => (
          <>
            <Username useStore={useStore} />
            <Phone useStore={useStore} />
            <Password useStore={useStore} />
            <div className="flex justify-between items-center">
              <Form.ResetButton>Reset</Form.ResetButton>
              <Form.SubmitButton>Submit</Form.SubmitButton>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(<App />)
