import React from 'react'
import { useForm } from '../../../src'

export function GroupResetPending({
  validateName,
  validateNext,
  validateOutside,
}: {
  validateName: (signal: AbortSignal) => Promise<string | null>
  validateNext: () => null
  validateOutside: () => Promise<string | null>
}) {
  const form = useForm({
    defaultValues: { details: { name: '' }, outside: '' },
  })

  return (
    <>
      <form.Field
        name="outside"
        validators={[{ triggers: ['blur'], run: () => validateOutside() }]}
      >
        {(field) => (
          <>
            <label>
              Outside
              <input
                value={field.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={() => field.handleBlur()}
              />
            </label>
            <output aria-label="Outside validating">
              {String(field.meta.isValidating)}
            </output>
            <output aria-label="Outside errors">
              {field.meta.original.errors
                .map((error) => error.message)
                .join(', ') || 'None'}
            </output>
          </>
        )}
      </form.Field>
      <form.FormGroup name="details">
        {(group) => (
          <>
            <group.Field
              name="name"
              validators={[
                {
                  triggers: ['blur'],
                  run: ({ signal }) => validateName(signal),
                },
                {
                  triggers: ['blur'],
                  bailIfInvalid: true,
                  run: () => validateNext(),
                },
              ]}
            >
              {(field) => (
                <>
                  <label>
                    Name
                    <input
                      value={field.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={() => field.handleBlur()}
                    />
                  </label>
                  <output aria-label="Name validating">
                    {String(field.meta.isValidating)}
                  </output>
                  <output aria-label="Name errors">
                    {field.meta.original.errors
                      .map((error) => error.message)
                      .join(', ') || 'None'}
                  </output>
                </>
              )}
            </group.Field>
            <button onClick={() => group.validate('blur')}>
              Validate group
            </button>
            <button onClick={() => group.reset()}>Reset group</button>
            <group.Subscribe selector={(state) => state.isInvalid}>
              {(isInvalid) => (
                <output aria-label="Group valid">{String(!isInvalid)}</output>
              )}
            </group.Subscribe>
          </>
        )}
      </form.FormGroup>
    </>
  )
}
