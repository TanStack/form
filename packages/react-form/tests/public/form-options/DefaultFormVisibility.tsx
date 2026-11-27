import React from 'react'
import { createFormHook } from '../../../src'

const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  defaultFormOptions: {
    errorVisibility: ({ fieldState }) => fieldState.meta.isTouched,
  },
})

export function DefaultFormVisibility() {
  const inherited = useAppForm({
    defaultValues: { name: '' },
  })
  const overridden = useAppForm({
    defaultValues: { name: '' },
    errorVisibility: () => false,
  })
  const cleared = useAppForm({
    defaultValues: { name: '' },
    errorVisibility: undefined,
  })

  return (
    <>
      <inherited.Field
        name="name"
        validators={[
          { triggers: ['mount', 'change'], run: () => 'Inherited error' },
        ]}
      >
        {(field) => (
          <>
            <label>
              Inherited name
              <input
                value={field.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </label>
            <output aria-label="Inherited errors">
              {field.errors.map((error) => error.message).join(', ') || 'None'}
            </output>
          </>
        )}
      </inherited.Field>
      <overridden.Field
        name="name"
        validators={[{ triggers: ['mount'], run: () => 'Overridden error' }]}
      >
        {(field) => (
          <output aria-label="Overridden errors">
            {field.errors.map((error) => error.message).join(', ') || 'None'}
          </output>
        )}
      </overridden.Field>
      <cleared.Field
        name="name"
        validators={[{ triggers: ['mount'], run: () => 'Cleared error' }]}
      >
        {(field) => (
          <output aria-label="Cleared errors">
            {field.errors.map((error) => error.message).join(', ') || 'None'}
          </output>
        )}
      </cleared.Field>
      <button onClick={() => overridden.handleSubmit()}>
        Submit overridden
      </button>
    </>
  )
}
