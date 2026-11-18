import React, { useState } from 'react'
import { useForm } from '../../../src'

export function GroupSubmitNotifications({
  onNotification,
  validateForm,
  validateGroup,
  validateSibling,
  validateOutside,
}: {
  onNotification: (source: string) => void
  validateForm: () => null
  validateGroup: () => null
  validateSibling: () => null
  validateOutside: () => null
}) {
  const [result, setResult] = useState('Pending')
  const form = useForm({
    defaultValues: {
      details: { name: '', watched: '' },
      sibling: { name: '' },
      outside: '',
    },
    listeners: [{ triggers: ['submit'], run: () => onNotification('form') }],
    validators: [{ triggers: [], run: validateForm }],
  })

  return (
    <>
      <form.FormGroup
        name="details"
        validators={[{ triggers: [], run: validateGroup }]}
      >
        {(group) => (
          <>
            <group.Field
              name="name"
              listeners={[
                { triggers: ['submit'], run: () => onNotification('inside') },
              ]}
            >
              {() => null}
            </group.Field>
            <group.Field name="watched">
              {(field) => (
                <output aria-label="Watched touched">
                  {String(field.meta.isTouched)}
                </output>
              )}
            </group.Field>
            <button
              onClick={async () =>
                setResult(JSON.stringify(await group.handleSubmit()))
              }
            >
              Submit group
            </button>
          </>
        )}
      </form.FormGroup>
      <form.FormGroup
        name="sibling"
        validators={[{ triggers: [], run: validateSibling }]}
      >
        {() => null}
      </form.FormGroup>
      <form.Field
        name="outside"
        listeners={[
          {
            triggers: ['submit'],
            watchFields: ['details.watched'],
            run: () => onNotification('watching'),
          },
        ]}
        validators={[{ triggers: [], run: validateOutside }]}
      >
        {(field) => (
          <output aria-label="Outside touched">
            {String(field.meta.isTouched)}
          </output>
        )}
      </form.Field>
      <button
        onClick={async () =>
          setResult(JSON.stringify(await form.handleSubmit()))
        }
      >
        Submit form
      </button>
      <output aria-label="Submission result">{result}</output>
    </>
  )
}
