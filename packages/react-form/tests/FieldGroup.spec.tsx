import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { getFieldGroupHelpers, useForm } from '../src'

const user = userEvent.setup()

const { defineFields, helper, withFields } = getFieldGroupHelpers()

const nestedFields = defineFields({
  foo: helper.strict<{ bar: string }>(),
})

interface NestedFieldsProps {
  fields: typeof nestedFields
}

function NestedFieldsImpl({ fields }: NestedFieldsProps) {
  return (
    <>
      <fields.Field name="foo.bar">
        {(field) => <span data-testid="field">{field.name}:{field.value}</span>}
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

const NestedFields = withFields(nestedFields, NestedFieldsImpl, 'fields')

const passwordFields = defineFields({
  password: helper.strict<string>(),
  confirmPassword: helper.strict<string>(),
})

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

const PasswordFields = withFields(
  passwordFields,
  PasswordFieldsImpl,
  'fields',
)

const rangeFields = defineFields({
  lower: helper.strict<string>(),
  upper: helper.strict<string>(),
})

interface RangeFieldsProps {
  fields: typeof rangeFields
  renderCounts: {
    lower: number
    upper: number
  }
}

function RangeFieldsImpl({ fields, renderCounts }: RangeFieldsProps) {
  return (
    <>
      <fields.Field name="lower">
        {(field) => {
          renderCounts.lower++
          return (
            <input
              aria-label="Lower"
              value={field.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          )
        }}
      </fields.Field>
      <fields.Field name="upper">
        {(field) => {
          renderCounts.upper++
          return (
            <input
              aria-label="Upper"
              value={field.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          )
        }}
      </fields.Field>
    </>
  )
}

const RangeFields = withFields(rangeFields, RangeFieldsImpl, 'fields')

const memoizedInputFields = defineFields({
  value: helper.strict<string>(),
})

interface MemoizedInputProps {
  field: {
    value: string
    handleChange: (value: string) => void
  }
  renderCount: {
    value: number
  }
}

const MemoizedInput = React.memo(function MemoizedInput({
  field,
  renderCount,
}: MemoizedInputProps) {
  renderCount.value++

  return (
    <input
      aria-label="Memoized"
      value={field.value}
      onChange={(event) => field.handleChange(event.target.value)}
    />
  )
})

interface MemoizedInputFieldsProps {
  fields: typeof memoizedInputFields
  renderCount: {
    value: number
  }
}

function MemoizedInputFieldsImpl({
  fields,
  renderCount,
}: MemoizedInputFieldsProps) {
  return (
    <fields.Field name="value">
      {(field) => <MemoizedInput field={field} renderCount={renderCount} />}
    </fields.Field>
  )
}

const MemoizedInputFields = withFields(
  memoizedInputFields,
  MemoizedInputFieldsImpl,
  'fields',
)

describe('FieldGroup', () => {
  it('resolves nested logical field names and forwards field methods', async () => {
    function Component() {
      const form = useForm({
        defaultValues: {
          anything: {
            bar: 'Initial',
          },
        },
      })

      return (
        <NestedFields form={form} fields={{ foo: 'anything' }} />
      )
    }

    const { getByRole, getByTestId } = render(<Component />)

    expect(getByTestId('field')).toHaveTextContent('anything.bar:Initial')

    await user.click(getByRole('button', { name: 'Update' }))

    expect(getByTestId('field')).toHaveTextContent('anything.bar:Updated')
  })

  it('exposes subscribed field meta from field group children', () => {
    const MetaFields = withFields(
      nestedFields,
      ({ fields }: NestedFieldsProps) => (
        <fields.Field name="foo.bar">
          {(field) => (
            <span data-testid="meta">{String(field.meta.isValidating)}</span>
          )}
        </fields.Field>
      ),
      'fields',
    )

    function Component() {
      const form = useForm({
        defaultValues: {
          anything: {
            bar: 'Initial',
          },
        },
      })

      return <MetaFields form={form} fields={{ foo: 'anything' }} />
    }

    const { getByTestId } = render(<Component />)

    expect(getByTestId('meta')).toHaveTextContent('false')
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

    const { getByLabelText } = render(<Component />)

    await user.type(getByLabelText('Password'), 'a')

    expect(listener).toHaveBeenCalledOnce()
  })

  it('updates extracted memoized field components when field values change', async () => {
    const renderCount = { value: 0 }

    function Component() {
      const form = useForm({
        defaultValues: {
          value: '',
        },
      })

      return (
        <MemoizedInputFields
          form={form}
          fields={{ value: 'value' }}
          renderCount={renderCount}
        />
      )
    }

    const { getByLabelText } = render(<Component />)
    const input = getByLabelText('Memoized')

    await user.type(input, 'abc')

    expect(input).toHaveValue('abc')
    expect(renderCount.value).toBeGreaterThan(1)
  })

  it('does not rerender unrelated sibling fields when one field changes', async () => {
    const renderCounts = {
      lower: 0,
      upper: 0,
    }

    function Component() {
      const form = useForm({
        defaultValues: {
          min: '',
          max: '',
        },
      })

      return (
        <RangeFields
          form={form}
          fields={{
            lower: 'min',
            upper: 'max',
          }}
          renderCounts={renderCounts}
        />
      )
    }

    const { getByLabelText } = render(<Component />)
    const initialUpperRenderCount = renderCounts.upper

    await user.type(getByLabelText('Lower'), '12')

    expect(getByLabelText('Lower')).toHaveValue('12')
    expect(renderCounts.lower).toBeGreaterThan(1)
    expect(renderCounts.upper).toBe(initialUpperRenderCount)
  })
})
