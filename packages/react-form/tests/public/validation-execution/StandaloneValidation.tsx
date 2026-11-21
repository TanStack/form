import React, { useState } from 'react'
import { useForm } from '../../../src'

export function StandaloneValidation({
  validateGroup = () => 'Group error',
  validateNext = () => null,
  validateField = (name) => `${name} error`,
  shouldValidateGroup = () => true,
}: {
  validateGroup?: () => string | null | Promise<string | null>
  validateNext?: () => string | null
  validateField?: (name: string) => string | null | Promise<string | null>
  shouldValidateGroup?: () => boolean
}) {
  const [formResult, setFormResult] = useState('Pending')
  const [groupResult, setGroupResult] = useState('Pending')
  const form = useForm({
    defaultValues: { details: { first: '', second: '' } },
    validators: [{ triggers: ['change', 'blur'], run: () => 'Form error' }],
  })

  return (
    <>
      <button
        onClick={async () =>
          setFormResult(JSON.stringify(await form.validate('change')))
        }
      >
        Validate form change
      </button>
      <button
        onClick={async () =>
          setFormResult(JSON.stringify(await form.validate('blur')))
        }
      >
        Validate form blur
      </button>
      <output aria-label="Form result">{formResult}</output>
      <form.FormGroup
        name="details"
        validators={[
          {
            triggers: [
              { trigger: 'change', when: shouldValidateGroup },
              { trigger: 'blur', when: shouldValidateGroup },
            ],
            run: () => validateGroup(),
          },
          {
            triggers: ['change', 'blur'],
            bailIfInvalid: true,
            run: () => validateNext(),
          },
        ]}
      >
        {(group) => (
          <>
            <group.Field
              name="first"
              validators={[
                {
                  triggers: ['change', 'blur'],
                  run: () => validateField('First'),
                },
              ]}
            >
              {(field) => (
                <>
                  <label>
                    First
                    <input
                      value={field.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={() => field.handleBlur()}
                    />
                  </label>
                  <output aria-label="First errors">
                    {field.errors.map((error) => error.message).join(', ') ||
                      'None'}
                  </output>
                </>
              )}
            </group.Field>
            <group.Field
              name="second"
              validators={[
                {
                  triggers: ['change', 'blur'],
                  run: () => validateField('Second'),
                },
              ]}
            >
              {(field) => (
                <>
                  <label>
                    Second
                    <input
                      value={field.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={() => field.handleBlur()}
                    />
                  </label>
                  <output aria-label="Second errors">
                    {field.errors.map((error) => error.message).join(', ') ||
                      'None'}
                  </output>
                  <output aria-label="Second validating">
                    {String(field.meta.isValidating)}
                  </output>
                </>
              )}
            </group.Field>
            <button
              onClick={async () => {
                try {
                  setGroupResult(JSON.stringify(await group.validate('change')))
                } catch {
                  setGroupResult('Rejected')
                }
              }}
            >
              Validate group change
            </button>
            <button
              onClick={async () => {
                try {
                  setGroupResult(JSON.stringify(await group.validate('blur')))
                } catch {
                  setGroupResult('Rejected')
                }
              }}
            >
              Validate group blur
            </button>
            <button onClick={() => group.reset()}>Reset group</button>
            <group.Subscribe selector={(state) => state.isValidating}>
              {(isValidating) => (
                <output aria-label="Group validating">
                  {String(isValidating)}
                </output>
              )}
            </group.Subscribe>
            <group.Subscribe selector={(state) => state.errors}>
              {(errors) => (
                <output aria-label="Group errors">
                  {errors.map((error) => error.message).join(', ') || 'None'}
                </output>
              )}
            </group.Subscribe>
            <output aria-label="Group result">{groupResult}</output>
          </>
        )}
      </form.FormGroup>
    </>
  )
}
