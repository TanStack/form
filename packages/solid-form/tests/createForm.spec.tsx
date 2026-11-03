import { createSignal, flush } from 'solid-js'
import { render } from '@solidjs/web'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { createForm } from '../src'
import type { ValidationIssue } from '../src'

describe('Solid FormApi', () => {
  it('should create a form from a Solid options accessor', () => {
    const [name, setName] = createSignal('tony-hawk')

    function Component() {
      const form = createForm(() => ({ defaultValues: { name: name() } }))

      return (
        <form.Subscribe selector={(state) => state.values.name}>
          {(value) => <span data-testid="name">{value()}</span>}
        </form.Subscribe>
      )
    }

    const container = document.createElement('div')
    const dispose = render(() => <Component />, container)

    expect(container.querySelector('[data-testid="name"]')?.textContent).toBe(
      'tony-hawk',
    )

    setName('rodney-mullen')
    flush()

    expect(container.querySelector('[data-testid="name"]')?.textContent).toBe(
      'rodney-mullen',
    )

    dispose()
  })

  it('should render reactive field children', () => {
    let change!: (value: string) => void

    function Component() {
      const form = createForm(() => ({ defaultValues: { name: 'tony-hawk' } }))

      return (
        <form.Field name="name">
          {(field) => {
            change = (value) => field().handleChange(value)

            return (
              <label>
                {field().name}
                <input value={field().value} />
                <span data-testid="value">{field().value}</span>
              </label>
            )
          }}
        </form.Field>
      )
    }

    const container = document.createElement('div')
    const dispose = render(() => <Component />, container)
    const input = container.querySelector('input')!

    expect(input.value).toBe('tony-hawk')
    expect(container.querySelector('[data-testid="value"]')?.textContent).toBe(
      'tony-hawk',
    )

    change('new-value')
    flush()

    expect(input.value).toBe('new-value')
    expect(container.querySelector('[data-testid="value"]')?.textContent).toBe(
      'new-value',
    )

    dispose()
  })

  it('types root field listener errors without a group error', () => {
    function Component() {
      const form = createForm(() => ({
        defaultValues: { name: '', items: [''] },
      }))

      return (
        <>
          <form.Field
            name="name"
            listeners={[
              {
                triggers: ['change'],
                run: ({ fieldApi }) => {
                  expectTypeOf(fieldApi.errors).toEqualTypeOf<
                    Array<ValidationIssue>
                  >()
                },
              },
            ]}
          >
            {(field) => {
              expectTypeOf(field().errors).toEqualTypeOf<
                Array<ValidationIssue>
              >()
              return null
            }}
          </form.Field>

          <form.ArrayField
            name="items"
            listeners={[
              {
                triggers: ['change'],
                run: ({ fieldApi }) => {
                  expectTypeOf(fieldApi.errors).toEqualTypeOf<
                    Array<ValidationIssue>
                  >()
                },
              },
            ]}
          >
            {() => null}
          </form.ArrayField>
        </>
      )
    }

    void Component
  })
})
