import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { describe, expect, it } from 'vitest'
import { createForm } from '../src'

describe('Solid FormApi', () => {
  it('should create a form from a Solid options accessor', () => {
    function Component() {
      const [name, setName] = createSignal('tony-hawk')
      const form = createForm(() => ({ defaultValues: { name: name() } }))

      setName('rodney-mullen')

      return (
        <form.Subscribe selector={(state) => state.values.name}>
          {(value) => <span data-testid="name">{value()}</span>}
        </form.Subscribe>
      )
    }

    const container = document.createElement('div')
    const dispose = render(() => <Component />, container)

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

    expect(input.value).toBe('new-value')
    expect(container.querySelector('[data-testid="value"]')?.textContent).toBe(
      'new-value',
    )

    dispose()
  })
})
