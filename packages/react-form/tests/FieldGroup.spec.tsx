import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import { getFieldGroupHelpers, useForm, useSelector } from '../src'

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

const PasswordFields = withFields(passwordFields, PasswordFieldsImpl, 'fields')

const rangeFields = defineFields({
  lower: helper.strict<string>(),
  upper: helper.strict<string>(),
})

interface RangeFieldsProps {
  fields: typeof rangeFields
  onRender: {
    lower: React.ProfilerOnRenderCallback
    upper: React.ProfilerOnRenderCallback
  }
}

function RangeFieldsImpl({ fields, onRender }: RangeFieldsProps) {
  return (
    <>
      <fields.Field name="lower">
        {(field) => (
          <React.Profiler id="lower" onRender={onRender.lower}>
            <input
              aria-label="Lower"
              value={field.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </React.Profiler>
        )}
      </fields.Field>
      <fields.Field name="upper">
        {(field) => (
          <React.Profiler id="upper" onRender={onRender.upper}>
            <input
              aria-label="Upper"
              value={field.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </React.Profiler>
        )}
      </fields.Field>
    </>
  )
}

const RangeFields = withFields(rangeFields, RangeFieldsImpl, 'fields')

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

const RangeValuesFields = withFields(
  rangeFields,
  RangeValuesFieldsImpl,
  'fields',
)

const memoizedInputFields = defineFields({
  value: helper.strict<string>(),
})

interface MemoizedInputProps {
  field: {
    value: string
    handleChange: (value: string) => void
  }
}

const MemoizedInput = React.memo(function MemoizedInput({
  field,
}: MemoizedInputProps) {
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
  onRender: React.ProfilerOnRenderCallback
}

function MemoizedInputFieldsImpl({
  fields,
  onRender,
}: MemoizedInputFieldsProps) {
  return (
    <fields.Field name="value">
      {(field) => (
        <React.Profiler id="memoized-input" onRender={onRender}>
          <MemoizedInput field={field} />
        </React.Profiler>
      )}
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

      return <NestedFields form={form} fields={{ foo: 'anything' }} />
    }

    const { getByRole, getByTestId } = render(<Component />)

    expect(getByTestId('field')).toHaveTextContent('anything.bar:Initial')

    await user.click(getByRole('button', { name: 'Update' }))

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

    const { getByRole, getByTestId } = render(<Component />)
    expect(getByTestId('field')).toHaveTextContent('first.bar:One')

    await user.click(getByRole('button', { name: 'Show second' }))

    expect(getByTestId('field')).toHaveTextContent('second.bar:Two')
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
    const onRender = vi.fn()

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
          onRender={onRender}
        />
      )
    }

    const { getByLabelText } = render(<Component />)
    const input = getByLabelText('Memoized')

    await user.type(input, 'abc')

    expect(input).toHaveValue('abc')
    expect(onRender).toHaveBeenCalledTimes(4)
  })

  it('does not rerender unrelated sibling fields when one field changes', async () => {
    const onRender = {
      lower: vi.fn(),
      upper: vi.fn(),
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
          onRender={onRender}
        />
      )
    }

    const { getByLabelText } = render(<Component />)
    const initialUpperRenderCount = onRender.upper.mock.calls.length

    await user.type(getByLabelText('Lower'), '12')

    expect(getByLabelText('Lower')).toHaveValue('12')
    expect(onRender.lower).toHaveBeenCalledTimes(3)
    expect(onRender.upper).toHaveBeenCalledTimes(initialUpperRenderCount)
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

    const { getByLabelText, getByTestId } = render(<Component />)

    expect(getByTestId('values')).toHaveTextContent('1:5')

    await user.type(getByLabelText('Lower'), '2')

    expect(getByTestId('values')).toHaveTextContent('12:5')
  })
})
