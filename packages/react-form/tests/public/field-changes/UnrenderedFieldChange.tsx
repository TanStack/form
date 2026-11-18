import React from 'react'
import { useForm } from '../../../src'

export function UnrenderedFieldChange({
  onChange,
  onValidate,
  onWatchedReset,
}: {
  onChange: (fieldName: string | undefined) => void
  onValidate: (fieldName: string | undefined) => null
  onWatchedReset: () => void
}) {
  const form = useForm({
    defaultValues: { profile: { name: '' }, watching: '' },
    listeners: [
      {
        triggers: ['change'],
        run: ({ triggerFieldApi }) => onChange(triggerFieldApi?.name),
      },
    ],
    validators: [
      {
        triggers: ['change'],
        run: ({ triggerFieldApi }) => onValidate(triggerFieldApi?.name),
      },
    ],
  })

  return (
    <>
      <form.Field
        name="watching"
        listeners={[
          {
            triggers: ['reset'],
            watchFields: ['profile.name'],
            run: onWatchedReset,
          },
        ]}
      >
        {() => null}
      </form.Field>
      <button
        onClick={() =>
          form.setFieldValue('profile.name', 'Ada', {
            markAsTouched: false,
            markAsDirty: false,
            markAsBlurred: false,
          })
        }
      >
        Write unrendered value
      </button>
      <button onClick={() => form.resetField('profile.name')}>
        Reset name
      </button>
      <form.Subscribe selector={(state) => state.values.profile.name}>
        {(value) => <output aria-label="Name value">{value}</output>}
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
