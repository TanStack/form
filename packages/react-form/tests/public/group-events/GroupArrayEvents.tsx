import React from 'react'
import { useForm } from '../../../src'

export function GroupArrayEvents({
  onListener,
  onValidate,
}: {
  onListener: (name: string) => void
  onValidate: (name: string) => null
}) {
  const form = useForm({
    defaultValues: { users: [{ name: '', tags: ['initial'] }] },
    listeners: [{ triggers: ['change'], run: () => onListener('form') }],
    validators: [{ triggers: ['change'], run: () => onValidate('form') }],
  })

  return (
    <>
      <form.ArrayField
        name="users"
        listeners={[{ triggers: ['change'], run: () => onListener('users') }]}
        validators={[{ triggers: ['change'], run: () => onValidate('users') }]}
      >
        {(field) => (
          <button onClick={() => field.filterValues(() => true)}>
            Filter users
          </button>
        )}
      </form.ArrayField>
      <form.FormGroup
        name="users[0]"
        validators={[{ triggers: ['change'], run: () => onValidate('group') }]}
      >
        {(group) => (
          <>
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
            <group.ArrayField
              name="tags"
              listeners={[
                { triggers: ['change'], run: () => onListener('tags') },
              ]}
              validators={[
                { triggers: ['change'], run: () => onValidate('tags') },
              ]}
            >
              {(field) => (
                <>
                  <button onClick={() => field.pushValue('added')}>
                    Add tag
                  </button>
                  <button onClick={() => field.filterValues(() => true)}>
                    Filter tags
                  </button>
                  <output aria-label="Tags">{field.value.join(', ')}</output>
                </>
              )}
            </group.ArrayField>
          </>
        )}
      </form.FormGroup>
    </>
  )
}
