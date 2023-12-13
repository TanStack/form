/// <reference types="../../node_modules/@types/react-dom/experimental" />
'use client'

import { useFormState } from 'react-dom'
import someAction from './action'
import { formFactory } from './shared-code'
import { useTransform, mergeForm, FormApi } from '@tanstack/react-form'

export const ClientComp = () => {
  const [state, action] = useFormState(someAction, formFactory.initialFormState)

  const form = formFactory.useForm({
    transform: useTransform(
      (baseForm: FormApi) => mergeForm(baseForm, state),
      [state],
    ),
  })

  const errorMap = form.useStore((state) => state.errorMap)

  return (
    <form.Provider>
      <form action={action as never}>
        <form.Field
          name="age"
          validators={{
            onChange: ({ value }) =>
              value < 8
                ? 'Client validation: You must be at least 8'
                : undefined,
          }}
        >
          {(form) => {
            return (
              <div>
                <input
                  name="age"
                  type="number"
                  value={form.state.value}
                  onChange={(e) => form.handleChange(e.target.valueAsNumber)}
                />
                {form.state.meta.errors.map((error) => (
                  <p key={error as string}>{error}</p>
                ))}
                {errorMap && <p>{JSON.stringify(errorMap)}</p>}
              </div>
            )
          }}
        </form.Field>

        <button type={'submit'}>Update data</button>
      </form>
    </form.Provider>
  )
}
