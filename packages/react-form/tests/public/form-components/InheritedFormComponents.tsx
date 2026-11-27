import React from 'react'
import { createFormHook, getFormHookHelpers } from '../../../src'
import type { ReactNode } from 'react'
import type { AnyReactFormApi } from '../../../src'

function FormValues({ form, label }: { form: AnyReactFormApi; label: string }) {
  return (
    <>
      <form.Subscribe selector={(state) => state.values}>
        {(values) => (
          <output aria-label={`${label} values`}>
            {JSON.stringify(values)}
          </output>
        )}
      </form.Subscribe>
      <button type="button" onClick={() => form.reset()}>
        Reset {label}
      </button>
    </>
  )
}

const { formComponent } = getFormHookHelpers()
const Values = formComponent.create({
  component: FormValues,
  replaceProperty: 'form',
})

function Toolbar({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <section aria-label={label}>
      <Values label={label} />
      {children}
    </section>
  )
}

const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: { Toolbar },
})
const { useAppForm: useOtherForm } = createFormHook({
  fieldComponents: {},
  formComponents: { Toolbar },
})

export function InheritedFormComponents() {
  const first = useAppForm({ defaultValues: { name: 'Alice' } })
  const second = useOtherForm({ defaultValues: { count: 1 } })

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
      <first.Toolbar label="First">
        <second.Toolbar label="Second" />
        <Values label="First after nested" />
      </first.Toolbar>
    </>
  )
}
