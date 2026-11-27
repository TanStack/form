import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import React from 'react'
import { defineFieldGroup, useForm, useSelector } from '../src'

const { fields: nestedFields, bindComponent: bindNestedFields } =
  defineFieldGroup(({ strict }) => ({
    foo: strict<{ bar: string }>(),
  }))

interface NestedFieldsProps {
  fields: typeof nestedFields
}

function NestedFieldsImpl({ fields }: NestedFieldsProps) {
  return (
    <>
      <fields.Field name="foo.bar">
        {(field) => (
          <span data-testid="field">
            {field.name}:{field.value}
          </span>
        )}
      </fields.Field>
      <button
        type="button"
        onClick={() => fields.setFieldValue('foo.bar', 'Updated')}
      >
        Update
      </button>
    </>
  )
}

const NestedFields = bindNestedFields(NestedFieldsImpl, 'fields')

const { fields: passwordFields, bindComponent: bindPasswordFields } =
  defineFieldGroup(({ strict }) => ({
    password: strict<string>(),
    confirmPassword: strict<string>(),
  }))

interface PasswordFieldsProps {
  fields: typeof passwordFields
  listener: () => void
}

function PasswordFieldsImpl({ fields, listener }: PasswordFieldsProps) {
  return (
    <>
      <fields.Field name="password">
        {(field) => (
          <input
            aria-label="Password"
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </fields.Field>
      <fields.Field
        name="confirmPassword"
        listeners={[
          {
            triggers: ['change'],
            watchFields: ['password'],
            run: listener,
          },
        ]}
      >
        {() => null}
      </fields.Field>
    </>
  )
}

const PasswordFields = bindPasswordFields(PasswordFieldsImpl, 'fields')

const { fields: rangeFields, bindComponent: bindRangeFields } =
  defineFieldGroup(({ strict }) => ({
    lower: strict<string>(),
    upper: strict<string>(),
  }))

interface RangeValuesFieldsProps {
  fields: typeof rangeFields
}

function RangeValuesFieldsImpl({ fields }: RangeValuesFieldsProps) {
  const values = useSelector(fields.atom)

  return (
    <>
      <span data-testid="values">
        {values.lower}:{values.upper}
      </span>
      <fields.Field name="lower">
        {(field) => (
          <input
            aria-label="Lower"
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </fields.Field>
      <fields.Field name="upper">
        {(field) => (
          <input
            aria-label="Upper"
            value={field.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
        )}
      </fields.Field>
    </>
  )
}

const RangeValuesFields = bindRangeFields(RangeValuesFieldsImpl, 'fields')

describe('FieldGroup', () => {
  it('defaults omitted bindings to same-named form fields', async () => {
    function Component() {
      const form = useForm({
        defaultValues: {
          foo: {
            bar: 'Initial',
          },
        },
      })

      return <NestedFields form={form} />
    }

    const { getByRole, getByTestId } = await render(<Component />)

    expect(getByTestId('field')).toHaveTextContent('foo.bar:Initial')

    await getByRole('button', { name: 'Update' }).click()

    expect(getByTestId('field')).toHaveTextContent('foo.bar:Updated')
  })

  it('resolves nested logical field names and forwards field methods', async () => {
    function Component() {
      const form = useForm({
        defaultValues: {
          foo: {
            bar: 'Identity',
          },
          anything: {
            bar: 'Initial',
          },
        },
      })

      return <NestedFields form={form} fields={{ foo: 'anything' }} />
    }

    const { getByRole, getByTestId } = await render(<Component />)

    expect(getByTestId('field')).toHaveTextContent('anything.bar:Initial')

    await getByRole('button', { name: 'Update' }).click()

    expect(getByTestId('field')).toHaveTextContent('anything.bar:Updated')
  })

  it('updates logical field bindings when props change', async () => {
    function Component() {
      const [binding, setBinding] = React.useState<'first' | 'second'>('first')
      const form = useForm({
        defaultValues: {
          first: { bar: 'One' },
          second: { bar: 'Two' },
        },
      })

      return (
        <>
          <NestedFields form={form} fields={{ foo: binding }} />
          <button type="button" onClick={() => setBinding('second')}>
            Show second
          </button>
        </>
      )
    }

    const { getByRole, getByTestId } = await render(<Component />)
    expect(getByTestId('field')).toHaveTextContent('first.bar:One')

    await getByRole('button', { name: 'Show second' }).click()

    expect(getByTestId('field')).toHaveTextContent('second.bar:Two')
  })

  it('resolves watched field names for listeners', async () => {
    const listener = vi.fn()

    function Component() {
      const form = useForm({
        defaultValues: {
          account: {
            password: '',
            confirmPassword: '',
          },
        },
      })

      return (
        <PasswordFields
          form={form}
          fields={{
            password: 'account.password',
            confirmPassword: 'account.confirmPassword',
          }}
          listener={listener}
        />
      )
    }

    const { getByLabelText } = await render(<Component />)

    await userEvent.type(getByLabelText('Password'), 'a')

    expect(listener).toHaveBeenCalledOnce()
  })

  it('exposes bound field values through a group-level atom', async () => {
    function Component() {
      const form = useForm({
        defaultValues: {
          min: '1',
          max: '5',
        },
      })

      return (
        <RangeValuesFields
          form={form}
          fields={{
            lower: 'min',
            upper: 'max',
          }}
        />
      )
    }

    const { getByLabelText, getByTestId } = await render(<Component />)

    expect(getByTestId('values')).toHaveTextContent('1:5')

    await userEvent.type(getByLabelText('Lower'), '2')

    expect(getByTestId('values')).toHaveTextContent('12:5')
  })
})
