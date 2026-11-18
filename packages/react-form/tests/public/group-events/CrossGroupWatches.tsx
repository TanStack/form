import React from 'react'
import { useForm } from '../../../src'

export function CrossGroupWatches({
  onListener,
  onValidate,
}: {
  onListener: (name: string) => void
  onValidate: (name: string) => null
}) {
  const form = useForm({
    defaultValues: {
      first: { name: '' },
      second: { watching: '' },
      last: '',
    },
    listeners: [{ triggers: ['change'], run: () => onListener('form') }],
    validators: [{ triggers: ['change'], run: () => onValidate('form') }],
  })

  return (
    <>
      <form.FormGroup
        name="first"
        validators={[{ triggers: ['change'], run: () => onValidate('first') }]}
      >
        {(group) => (
          <group.Field name="name">
            {(field) => (
              <label>
                Name
                <input
                  value={field.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </label>
            )}
          </group.Field>
        )}
      </form.FormGroup>
      <form.FormGroup
        name="second"
        validators={[{ triggers: ['change'], run: () => onValidate('second') }]}
      >
        {() => (
          <form.Field
            name="second.watching"
            listeners={[
              {
                triggers: ['change'],
                watchFields: ['first.name'],
                run: () => onListener('second watching'),
              },
              {
                triggers: ['change'],
                watchFields: ['second'],
                run: () => onListener('unrelated'),
              },
            ]}
            validators={[
              {
                triggers: ['change'],
                watchFields: ['first.name'],
                run: () => onValidate('second watching'),
              },
              {
                triggers: ['change'],
                watchFields: ['second'],
                run: () => onValidate('unrelated'),
              },
            ]}
          >
            {() => null}
          </form.Field>
        )}
      </form.FormGroup>
      <form.Field
        name="last"
        listeners={[
          {
            triggers: ['change'],
            watchFields: ['second.watching'],
            run: () => onListener('last'),
          },
        ]}
        validators={[
          {
            triggers: ['change'],
            watchFields: ['second.watching'],
            run: () => onValidate('last'),
          },
        ]}
      >
        {() => null}
      </form.Field>
    </>
  )
}
