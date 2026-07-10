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
          e.currentTarget.submit()
        }
      }}
    >
      <form.Field name="age">
        {(field) => {
          return (
            <div>
              <input
                name="age"
                type="number"
                value={field.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              {field.errors.map((error) => (
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
