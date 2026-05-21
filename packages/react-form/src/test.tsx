import React from 'react'
import {
  createLooseFieldComponent,
  createStrictFieldComponent,
} from './AppForm/createComponents.public'
import { createFormHook } from './AppForm/createFormHook.public'
import type { FieldWithValue } from '@tanstack/form-core-v2'

interface SelectMenuProps<TChoices extends string> {
  field: FieldWithValue<TChoices>
  options: Array<NoInfer<TChoices>>
}

function SelectMenu<TChoices extends string>(
  _props: SelectMenuProps<TChoices>,
) {
  return null
}

interface StringFieldProps {
  field: FieldWithValue<string>
  placeholder?: string
  label: string
}

function StringField(props: StringFieldProps) {
  const { label, placeholder, field } = props

  return (
    <label>
      <span>{label}</span>
      <input
        placeholder={placeholder}
        value={field.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
    </label>
  )
}

interface NumberFieldProps {
  field: FieldWithValue<number>
  placeholder?: string
  label: string
}

function NumberField(props: NumberFieldProps) {
  const { label, placeholder, field } = props

  return (
    <label>
      <span>{label}</span>
      <input
        placeholder={placeholder}
        type="number"
        value={field.value}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
        onBlur={field.handleBlur}
      />
    </label>
  )
}

interface FieldErrorProps {
  field: FieldWithValue<any>
}

function FieldError(props: FieldErrorProps) {
  return (
    <span
      style={{
        whiteSpace: 'pre-line',
      }}
    >
      {props.field.errors.map((e) => e.message).join('\n')}
    </span>
  )
}

const { useAppForm } = createFormHook({
  fieldComponents: {
    StringControl: createLooseFieldComponent(StringField),
    NumberControl: createStrictFieldComponent(NumberField),
    ErrorMessages: createStrictFieldComponent(FieldError),
    SelectMenu,
  },
  formComponents: {},
})

export function App() {
  const form = useAppForm({
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    defaultValues: { name: '', age: 0, choice: 'a' as 'a' | 'b' },
    validators: [
      {
        run: () => 'Always',
        triggers: [],
      },
    ],
  })

  return (
    <>
      <form.Field name="name">
        {(field) => (
          <>
            <field.StringControl label="Name" />
            <field.ErrorMessages />
          </>
        )}
      </form.Field>
      <form.Field name="age">
        {(field) => (
          <>
            <field.NumberControl label="Age" />
            <field.ErrorMessages />
          </>
        )}
      </form.Field>
      <form.Field name="choice">
        {(field) => (
          <>
            <field.SelectMenu field={field} options={['a', 'b']} />
            <field.ErrorMessages />
          </>
        )}
      </form.Field>
    </>
  )
}
