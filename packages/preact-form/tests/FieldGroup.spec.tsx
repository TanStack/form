import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/preact'
import { userEvent } from '@testing-library/user-event'
import Preact from 'preact/compat'
import { defineFieldGroup, useForm, useSelector } from '../src'

const user = userEvent.setup()

function RenderCounter({
  children,
  onRender,
}: {
  children: Preact.ReactNode
  id: string
  onRender: () => void
}) {
  onRender()
  return <>{children}</>
}

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
            onChange={(event) => field.handleChange(event.currentTarget.value)}
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

interface RangeFieldsProps {
  fields: typeof rangeFields
  onRender: {
    lower: () => void
    upper: () => void
  }
}

function RangeFieldsImpl({ fields, onRender }: RangeFieldsProps) {
  return (
    <>
      <fields.Field name="lower">
        {(field) => (
          <RenderCounter id="lower" onRender={onRender.lower}>
            <input
              aria-label="Lower"
              value={field.value}
              onChange={(event) =>
                field.handleChange(event.currentTarget.value)
              }
            />
          </RenderCounter>
        )}
      </fields.Field>
      <fields.Field name="upper">
        {(field) => (
          <RenderCounter id="upper" onRender={onRender.upper}>
            <input
              aria-label="Upper"
              value={field.value}
              onChange={(event) =>
                field.handleChange(event.currentTarget.value)
              }
            />
          </RenderCounter>
        )}
      </fields.Field>
    </>
  )
}

const RangeFields = bindRangeFields(RangeFieldsImpl, 'fields')

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
            onChange={(event) => field.handleChange(event.currentTarget.value)}
          />
        )}
      </fields.Field>
      <fields.Field name="upper">
        {(field) => (
          <input
            aria-label="Upper"
            value={field.value}
            onChange={(event) => field.handleChange(event.currentTarget.value)}
          />
        )}
      </fields.Field>
    </>
  )
}

const RangeValuesFields = bindRangeFields(RangeValuesFieldsImpl, 'fields')

const { fields: memoizedInputFields, bindComponent: bindMemoizedInputFields } =
  defineFieldGroup(({ strict }) => ({
    value: strict<string>(),
  }))

interface MemoizedInputProps {
  field: {
    value: string
    handleChange: (value: string) => void
  }
}

const MemoizedInput = Preact.memo(function MemoizedInputComponent({
  field,
}: MemoizedInputProps) {
  return (
    <input
      aria-label="Memoized"
      value={field.value}
      onChange={(event) => field.handleChange(event.currentTarget.value)}
    />
  )
})

interface MemoizedInputFieldsProps {
  fields: typeof memoizedInputFields
  onRender: () => void
}

function MemoizedInputFieldsImpl({
  fields,
  onRender,
}: MemoizedInputFieldsProps) {
  return (
    <fields.Field name="value">
      {(field) => (
        <RenderCounter id="memoized-input" onRender={onRender}>
          <MemoizedInput field={field} />
        </RenderCounter>
      )}
    </fields.Field>
  )
}

const MemoizedInputFields = bindMemoizedInputFields(
  MemoizedInputFieldsImpl,
  'fields',
)

const { fields: arrayFields, bindComponent: bindArrayFields } =
  defineFieldGroup(({ strict }) => ({
    items: strict<Array<string>>(),
  }))

const ArrayFields = bindArrayFields(
  ({ fields }: { fields: typeof arrayFields }) => {
    const values = useSelector(fields.atom)
    return (
      <>
        <span data-testid="array-values">{values.items.join(',')}</span>
        <button
          type="button"
          onClick={() => fields.moveFieldValue('items', 0, 2)}
        >
          Move item
        </button>
      </>
    )
  },
  'fields',
)

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

    const { getByRole, getByTestId } = render(<Component />)

    expect(getByTestId('field')).toHaveTextContent('foo.bar:Initial')

    await user.click(getByRole('button', { name: 'Update' }))

    expect(getByTestId('field')).toHaveTextContent('foo.bar:Updated')
  })

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

  it('exposes subscribed field meta from field group children', () => {
    const MetaFields = bindNestedFields(
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

      return <MemoizedInputFields form={form} onRender={onRender} />
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

  it('forwards array methods from the core field group API', async () => {
    function Component() {
      const form = useForm({
        defaultValues: {
          nested: { items: ['a', 'b', 'c'] },
        },
      })

      return <ArrayFields form={form} fields={{ items: 'nested.items' }} />
    }

    const { getByRole, getByTestId } = render(<Component />)

    await user.click(getByRole('button', { name: 'Move item' }))

    expect(getByTestId('array-values')).toHaveTextContent('b,c,a')
  })
})
