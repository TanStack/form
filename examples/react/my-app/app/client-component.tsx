'use client'

import { useActionState } from 'react'
import { useForm } from '@tanstack/react-form'
import someAction from './action'
import { formOpts } from './shared-code'

// What should this value be set to?
const initialFormState = {}

export const ClientComp = () => {
  const [state, action] = useActionState(someAction, initialFormState as never)

  // How to consume `state` into `useForm`?
  const form = useForm({
    ...formOpts,
    ...state,
  })

  return (
    <form action={action as never} onSubmit={() => form.handleSubmit()}>
      <form.Field
        name="age"
        validators={[
          {
            run: ({ value }) =>
              value < 8
                ? 'Client validation: You must be at least 8'
                : undefined,
            triggers: ['change'],
          },
        ]}
      >
        {(field) => {
          return (
            <div>
              <input
                name={field.name} // must explicitly set the name attribute for the POST request
                type="number"
                value={field.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              {field.meta.errors.map((error) => (
                <p key={error.message}>{error.message}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
