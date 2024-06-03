/// <reference types="../../node_modules/@types/react-dom/experimental" />
'use client'

import { useFormState } from 'react-dom'
import { useForm, initialFormState, mergeForm, useTransform } from '@tanstack/react-form'
import someAction from './action'
import { formOpts } from './shared-code'
import type { FormApi } from '@tanstack/react-form'

export const ClientComp = () => {
  const [state, action] = useFormState(someAction, initialFormState)

  const form = useForm({
    ...formOpts,
    transform: useTransform(
      (baseForm: FormApi<any, any>) => mergeForm(baseForm, state),
      [state],
    ),
  })

  const formErrors = form.useStore((formState) => formState.errors)

  return (
    <form action={action as never} onSubmit={() => form.handleSubmit()}>
      {formErrors.map((error) => (
        <p key={error as string}>{error}</p>
      ))}

      <form.Field
        name="age"
        validators={{
          onChange: ({ value }) =>
            value < 8 ? 'Client validation: You must be at least 8' : undefined,
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
                <p key={error as string}>{error}</p>
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
