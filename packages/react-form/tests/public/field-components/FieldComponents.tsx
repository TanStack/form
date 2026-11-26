import React from 'react'
import { createFormHook, getFormHookHelpers } from '../../../src'
import type { FieldWithValue } from '../../../src'

function TextInput({
  field,
  label,
}: {
  field: FieldWithValue<string>
  label: string
}) {
  return (
    <label>
      {label}
      <input
        value={field.value}
        onChange={(event) => field.handleChange(event.target.value)}
      />
    </label>
  )
}

function Summary({ source }: { source: FieldWithValue<unknown> }) {
  return <output aria-label="Name summary">{String(source.value)}</output>
}

function Description({ label }: { label: string }) {
  return <span>{label}</span>
}

function Choices<TValue extends string>({
  field,
  options,
}: {
  field: FieldWithValue<TValue>
  options: ReadonlyArray<NoInfer<TValue>>
}) {
  return (
    <fieldset>
      <legend>Color</legend>
      {options.map((option) => (
        <label key={option}>
          {option}
          <input
            type="radio"
            name={field.name}
            value={option}
            checked={field.value === option}
            onChange={() => field.handleChange(option)}
          />
        </label>
      ))}
      <output aria-label="Selected color">{field.value}</output>
    </fieldset>
  )
}

const { fieldComponent } = getFormHookHelpers()
const { useAppForm } = createFormHook({
  fieldComponents: {
    TextInput: fieldComponent.strict()({
      component: TextInput,
      replaceProperty: 'field',
    }),
    Summary: fieldComponent.loose()({
      component: Summary,
      replaceProperty: 'source',
    }),
    Description: fieldComponent.strict<string>()({ component: Description }),
    Choices: fieldComponent.loose<string>()({ component: Choices }),
  },
  formComponents: {},
})

export function FieldComponents() {
  const form = useAppForm({
    defaultValues: { name: '', color: 'red' as 'red' | 'blue' },
  })

  return (
    <>
      <form.Field name="name">
        {(field) => (
          <>
            <field.TextInput label="Name" />
            <field.Summary />
            <field.Description label="Choose a name" />
          </>
        )}
      </form.Field>
      <form.Field name="color">
        {(field) => <field.Choices field={field} options={['red', 'blue']} />}
      </form.Field>
    </>
  )
}
