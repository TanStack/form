import React from 'react'
import { useForm } from '../../../src'

export function SubmitOnlyValidation({
  options,
}: {
  options: { triggers?: [] }
}) {
  const form = useForm({
    defaultValues: { details: { name: '' } },
    validators: [
      { ...options, run: () => 'Form validation' },
      { ...options, skipOnSubmit: true, run: () => 'Skipped form validation' },
    ],
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.FormGroup
        name="details"
        validators={[
          { ...options, run: () => 'Group validation' },
          {
            ...options,
            skipOnSubmit: true,
            run: () => 'Skipped group validation',
          },
        ]}
      >
        {(group) => (
          <>
            <group.Field
              name="name"
              errorVisibility={() => true}
              validators={[
                { ...options, run: () => 'Field validation' },
                {
                  ...options,
                  skipOnSubmit: true,
                  run: () => 'Skipped field validation',
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
                      onBlur={field.handleBlur}
                    />
                  </label>
                  <output aria-label="Field errors">
                    {field.errors.map((error) => error.message).join(', ') ||
                      'None'}
                  </output>
                </>
              )}
            </group.Field>
            <group.Subscribe selector={(state) => state.errors}>
              {(errors) => (
                <output aria-label="Group errors">
                  {errors.map((error) => error.message).join(', ') || 'None'}
                </output>
              )}
            </group.Subscribe>
            <button type="button" onClick={() => group.handleSubmit()}>
              Submit group
            </button>
          </>
        )}
      </form.FormGroup>
      <form.Subscribe selector={(state) => state.errors}>
        {(errors) => (
          <output aria-label="Form errors">
            {errors.map((error) => error.message).join(', ') || 'None'}
          </output>
        )}
      </form.Subscribe>
      <button type="button">Blur input</button>
      <button type="submit">Submit form</button>
    </form>
  )
}
