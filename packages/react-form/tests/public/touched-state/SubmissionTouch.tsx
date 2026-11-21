import React, { useState } from 'react'
import { useForm } from '../../../src'

export function SubmissionTouch({
  onEmailSubmit,
}: {
  onEmailSubmit: () => null
}) {
  const [showGroup, setShowGroup] = useState(true)
  const [showEmail, setShowEmail] = useState(false)
  const [serverState, setServerState] = useState({
    values: undefined,
    validationResults: [],
    submissionAttempts: 0,
  })
  const form = useForm({
    defaultValues: {
      profile: { contact: { name: '', email: '' }, other: '' },
      outside: '',
    },
    serverState,
    errorVisibility: ({ state, fieldState }) =>
      state.isTouched && fieldState.meta.isTouched,
  })

  return (
    <>
      <form.Field name="profile">
        {(field) => (
          <>
            <output aria-label="Profile touch">
              {JSON.stringify({
                touched: field.meta.isTouched,
                self: field.meta.isSelfTouched,
                subfields: field.meta.subfields.isSomeTouched,
              })}
            </output>
            <button onClick={() => field.reset()}>Reset profile</button>
          </>
        )}
      </form.Field>
      {showGroup && (
        <>
          <form.FormGroup name="profile.contact">
            {(group) => (
              <>
                <group.Subscribe selector={(state) => state.isTouched}>
                  {(touched) => (
                    <output aria-label="Group touched">
                      {String(touched)}
                    </output>
                  )}
                </group.Subscribe>
                <group.Subscribe selector={(state) => state.submissionAttempts}>
                  {(attempts) => (
                    <output aria-label="Group attempts">{attempts}</output>
                  )}
                </group.Subscribe>
                <button onClick={() => group.handleSubmit()}>
                  Submit group
                </button>
                <button onClick={() => group.reset()}>Reset group</button>
              </>
            )}
          </form.FormGroup>
          <form.Field
            name="profile.contact.name"
            validators={[{ triggers: ['mount'], run: () => 'Name required' }]}
          >
            {(field) => (
              <>
                <label>
                  Name
                  <input
                    value={field.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </label>
                <output aria-label="Name touch">
                  {JSON.stringify({
                    touched: field.meta.isTouched,
                    self: field.meta.isSelfTouched,
                  })}
                </output>
                <output aria-label="Name dirty">
                  {String(field.meta.isDirty)}
                </output>
                <output aria-label="Name errors">
                  {field.errors.map((error) => error.message).join(', ') ||
                    'None'}
                </output>
                <button onClick={() => field.reset()}>Reset name</button>
              </>
            )}
          </form.Field>
          {showEmail && (
            <form.Field
              name="profile.contact.email"
              validators={[{ triggers: [], run: onEmailSubmit }]}
            >
              {(field) => (
                <output aria-label="Email touch">
                  {JSON.stringify({
                    touched: field.meta.isTouched,
                    self: field.meta.isSelfTouched,
                  })}
                </output>
              )}
            </form.Field>
          )}
        </>
      )}
      <form.Field name="profile.other">
        {(field) => (
          <output aria-label="Other touched">
            {String(field.meta.isTouched)}
          </output>
        )}
      </form.Field>
      <form.Field
        name="outside"
        errorVisibility={({ fieldState }) => fieldState.meta.isSelfTouched}
        validators={[{ triggers: ['mount'], run: () => 'Outside required' }]}
      >
        {(field) => (
          <>
            <label>
              Outside
              <input
                value={field.value}
                onBlur={() => field.handleBlur()}
                readOnly
              />
            </label>
            <output aria-label="Outside touched">
              {String(field.meta.isTouched)}
            </output>
            <output aria-label="Outside errors">
              {field.errors.map((error) => error.message).join(', ') || 'None'}
            </output>
          </>
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state.isTouched}>
        {(touched) => (
          <output aria-label="Form touched">{String(touched)}</output>
        )}
      </form.Subscribe>
      <button onClick={() => form.handleSubmit()}>Submit form</button>
      <button onClick={() => form.reset()}>Reset form</button>
      <button
        onClick={() =>
          setServerState({
            values: undefined,
            validationResults: [],
            submissionAttempts: 0,
          })
        }
      >
        Apply server state
      </button>
      <button onClick={() => setShowGroup((previous) => !previous)}>
        {showGroup ? 'Hide group' : 'Show group'}
      </button>
      <button onClick={() => setShowEmail((previous) => !previous)}>
        {showEmail ? 'Hide email' : 'Add email'}
      </button>
    </>
  )
}
