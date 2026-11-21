import React from 'react'
import { useForm } from '../../../src'

export function GroupResetFields() {
  const form = useForm({
    defaultValues: {
      details: { name: 'Default name', address: { city: 'Default city' } },
      outside: '',
    },
    validators: [
      {
        triggers: ['change'],
        run: () => ({ fields: { 'details.name': 'Form name error' } }),
      },
    ],
  })

  return (
    <>
      <form.Field
        name="outside"
        validators={[
          {
            triggers: ['blur'],
            run: ({ value }) => (value ? null : 'Outside is required'),
          },
        ]}
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
            <output aria-label="Outside errors">
              {field.meta.original.errors
                .map((error) => error.message)
                .join(', ') || 'None'}
            </output>
          </>
        )}
      </form.Field>
      <form.FormGroup
        name="details"
        validators={[
          {
            triggers: ['change', 'blur'],
            run: ({ value }) =>
              value.name && value.address.city ? null : 'Complete details',
          },
        ]}
      >
        {(group) => (
          <>
            <group.Field
              name="name"
              validators={[
                {
                  triggers: ['change', 'blur'],
                  run: ({ value }) => (value ? null : 'Name is required'),
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
                  <output aria-label="Name errors">
                    {field.meta.original.errors
                      .map((error) => error.message)
                      .join(', ') || 'None'}
                  </output>
                </>
              )}
            </group.Field>
            <group.Field
              name="address.city"
              validators={[
                {
                  triggers: ['change', 'blur'],
                  run: ({ value }) => (value ? null : 'City is required'),
                },
              ]}
            >
              {(field) => (
                <>
                  <label>
                    City
                    <input
                      value={field.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={() => field.handleBlur()}
                    />
                  </label>
                  <output aria-label="City errors">
                    {field.meta.original.errors
                      .map((error) => error.message)
                      .join(', ') || 'None'}
                  </output>
                </>
              )}
            </group.Field>
            <button onClick={() => group.reset()}>Reset group</button>
            <group.Subscribe
              selector={(state) => ({
                isInvalid: state.isInvalid,
                isDirty: state.isDirty,
                isTouched: state.isTouched,
              })}
            >
              {(state) => (
                <>
                  <output aria-label="Group valid">
                    {String(!state.isInvalid)}
                  </output>
                  <output aria-label="Group dirty">
                    {String(state.isDirty)}
                  </output>
                  <output aria-label="Group touched">
                    {String(state.isTouched)}
                  </output>
                </>
              )}
            </group.Subscribe>
            <group.Subscribe selector={(state) => state.errors}>
              {(errors) => (
                <output aria-label="Group errors">
                  {errors.map((error) => error.message).join(', ') || 'None'}
                </output>
              )}
            </group.Subscribe>
          </>
        )}
      </form.FormGroup>
      <button onClick={() => form.validate('change')}>Validate form</button>
    </>
  )
}
