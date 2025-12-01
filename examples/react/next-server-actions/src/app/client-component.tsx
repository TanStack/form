'use client'

import { useActionState } from 'react'
import {
  initialFormState,
  mergeForm,
  useForm,
  useMerge,
} from '@tanstack/react-form-nextjs'
import { z } from 'zod'
import someAction from './action'
import { formOpts } from './shared-code'

export const ClientComp = () => {
  const [state, action] = useActionState(someAction, initialFormState)

  const form = useForm({
    ...formOpts,
  })

  useMerge({
    form,
    fn: (baseForm) => mergeForm(baseForm, state ?? {}),
    deps: [state],
  })

  return (
    <form action={action as never} onSubmit={() => form.handleSubmit()}>
      <form.Field
        name="age"
        validators={{
          onChange: z.coerce.number().min(8),
        }}
      >
        {(field) => {
          return (
            <div>
              <input
                name="age"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error?.message ?? ''}>{error?.message}</p>
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
