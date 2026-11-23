import React from 'react'
import { createFormHook, getFormHookHelpers } from '../../../src'
import type { AnyReactFormApi } from '../../../src'

function FormControls({
  owner,
  label,
}: {
  owner: AnyReactFormApi
  label: string
}) {
  return (
    <section aria-label={label}>
      <owner.Subscribe selector={(state) => state.values}>
        {(values) => (
          <output aria-label={`${label} values`}>
            {JSON.stringify(values)}
          </output>
        )}
      </owner.Subscribe>
      <button type="button" onClick={() => owner.reset()}>
        Reset {label}
      </button>
    </section>
  )
}

const { formComponent } = getFormHookHelpers()
const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: {
    FormControls: formComponent.create(FormControls, 'owner'),
  },
})

/* eslint-disable @eslint-react/static-components -- Form-bound components have stable references. */
export function OwningForms() {
  const first = useAppForm({ defaultValues: { name: 'Alice' } })
  const second = useAppForm({ defaultValues: { count: 1 } })
  const { FormControls: FirstControls } = first
  const unexpectedProps = { owner: second, label: 'First' }

  return (
    <>
      <first.Field name="name">
        {(field) => (
          <input
            aria-label="First name"
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </first.Field>
      <second.Field name="count">
        {(field) => (
          <input
            aria-label="Second count"
            type="number"
            value={field.value}
            onChange={(event) => field.handleChange(Number(event.target.value))}
          />
        )}
      </second.Field>
      <FirstControls {...unexpectedProps} />
      <second.FormControls label="Second" />
    </>
  )
}
/* eslint-enable @eslint-react/static-components */
