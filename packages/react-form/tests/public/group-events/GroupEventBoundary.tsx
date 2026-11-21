import React from 'react'
import { useForm } from '../../../src'

export function GroupEventBoundary({
  onListener,
  onValidate,
}: {
  onListener: (name: string) => void
  onValidate: (name: string) => null
}) {
  const form = useForm({
    defaultValues: {
      section: {
        details: { nested: { name: '' }, unrendered: '' },
        outside: '',
      },
      watching: '',
      watchingGroup: '',
    },
    listeners: [
      { triggers: ['change', 'blur'], run: () => onListener('form') },
    ],
    validators: [
      { triggers: ['change', 'blur'], run: () => onValidate('form') },
    ],
  })

  return (
    <>
      <form.Field
        name="section"
        listeners={[
          { triggers: ['change', 'blur'], run: () => onListener('section') },
        ]}
        validators={[
          { triggers: ['change', 'blur'], run: () => onValidate('section') },
        ]}
      >
        {(field) => (
          <output aria-label="Section blurred">
            {String(field.meta.isBlurred)}
          </output>
        )}
      </form.Field>
      <form.FormGroup
        name="section.details"
        validators={[
          { triggers: ['change', 'blur'], run: () => onValidate('group') },
        ]}
      >
        {(group) => (
          <>
            <group.Field
              name="nested"
              listeners={[
                {
                  triggers: ['change', 'blur'],
                  run: () => onListener('nested'),
                },
              ]}
              validators={[
                {
                  triggers: ['change', 'blur'],
                  run: () => onValidate('nested'),
                },
              ]}
            >
              {() => null}
            </group.Field>
            <group.Field
              name="nested.name"
              listeners={[
                { triggers: ['change', 'blur'], run: () => onListener('name') },
              ]}
              validators={[
                { triggers: ['change', 'blur'], run: () => onValidate('name') },
              ]}
            >
              {(field) => (
                <label>
                  Name
                  <input
                    value={field.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={() => field.handleBlur()}
                  />
                </label>
              )}
            </group.Field>
          </>
        )}
      </form.FormGroup>
      <form.Field
        name="section.outside"
        listeners={[
          { triggers: ['change', 'blur'], run: () => onListener('outside') },
        ]}
        validators={[
          { triggers: ['change', 'blur'], run: () => onValidate('outside') },
        ]}
      >
        {(field) => (
          <label>
            Outside
            <input
              value={field.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={() => field.handleBlur()}
            />
          </label>
        )}
      </form.Field>
      <form.Field
        name="watching"
        listeners={[
          {
            triggers: ['change'],
            watchFields: ['section.details.unrendered'],
            run: () => onListener('watching'),
          },
        ]}
      >
        {() => null}
      </form.Field>
      <form.Field
        name="watchingGroup"
        listeners={[
          {
            triggers: ['change', 'blur'],
            watchFields: ['section.details'],
            run: () => onListener('watching group'),
          },
        ]}
      >
        {() => null}
      </form.Field>
      <button
        onClick={() =>
          form.setFieldValue('section.details.unrendered', 'edited', {
            markAsTouched: false,
            markAsDirty: false,
          })
        }
      >
        Write unrendered field
      </button>
      <button
        onClick={() =>
          form.setFieldValue('section.details.unrendered', 'edited', {
            markAsTouched: false,
            markAsDirty: false,
            causeValidation: false,
          })
        }
      >
        Write without validation
      </button>
      <button>Blur input</button>
      <form.Subscribe
        selector={(state) => state.values.section.details.unrendered}
      >
        {(value) => <output aria-label="Unrendered value">{value}</output>}
      </form.Subscribe>
      <form.Subscribe selector={(state) => state.isTouched}>
        {(isTouched) => (
          <output aria-label="Form touched">{String(isTouched)}</output>
        )}
      </form.Subscribe>
      <form.Subscribe selector={(state) => state.isDirty}>
        {(isDirty) => (
          <output aria-label="Form dirty">{String(isDirty)}</output>
        )}
      </form.Subscribe>
    </>
  )
}
