'use client'

import { useActionState } from 'react'
import { initialServerFormState, useForm } from '@tanstack/react-form'
import someAction from './action'
import { formOpts } from './shared-code'

export const ClientComp = () => {
  const [serverState, action, isPending] = useActionState(
    someAction,
    initialServerFormState,
  )

  const form = useForm({
    ...formOpts,
    serverState,
  })

  return (
    <form
      action={action}
      onSubmit={async (e) => {
        e.preventDefault()
        const errors = await form.handleSubmit()
        if (errors.length === 0) {
          e.target.submit()
        }
      }}
    >
      <form.Field name="firstName">
        {(field) => {
          return (
            <div>
              <label htmlFor={field.name}>First name</label>
              <input
                id={field.name}
                name={field.name}
                type="text"
                value={field.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.meta.errors.map((error) => (
                <p key={error.message}>{error.message}</p>
              ))}
            </div>
          )
        }}
      </form.Field>

      <form.Field name="age">
        {(field) => {
          return (
            <div>
              <label htmlFor={field.name}>Age</label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                value={field.value}
                onBlur={field.handleBlur}
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
          <button type="submit" disabled={!canSubmit || isPending}>
            {isSubmitting || isPending ? '...' : 'Submit'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
