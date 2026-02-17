'use client'

import { useActionState } from 'react'
import {
  initialFormState,
  mergeForm,
  useForm,
  useTransform,
} from '@tanstack/react-form-nextjs'
import { z } from 'zod'
import someAction from './action'
import { formOpts } from './shared-code'

// Required as `z.coerce.number()` defined the type as `unknown`, so we need to do the coercion and validation manually
const zodAtLeast8 = z
  .custom<number>()
  .refine((value) => Number.isFinite(Number(value)), 'Invalid number')
  .transform((value) => Number(value))
  .refine((value) => value >= 8, 'Age must be at least 8')

export const ClientComp = () => {
  const [state, action] = useActionState(someAction, initialFormState)

  const form = useForm({
    ...formOpts,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state ?? {}),
      [state],
    ),
  })

  return (
    <form action={action as never} onSubmit={() => form.handleSubmit()}>
      <form.Field
        name="age"
        validators={{
          onChange: zodAtLeast8,
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
