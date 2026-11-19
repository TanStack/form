import { Loading, createMemo, flush } from 'solid-js'
import { render } from '@solidjs/web'
import { describe, expect, it } from 'vitest'
import { createForm } from '../src'

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('async form options', () => {
  it('waits for async default values instead of throwing', async () => {
    let resolve!: (name: string) => void

    function Component() {
      const name = createMemo(() => new Promise<string>((r) => (resolve = r)))
      const form = createForm(() => ({ defaultValues: { name: name() } }))

      return (
        <form.Field name="name">
          {(field) => <span data-testid="name">{field().value}</span>}
        </form.Field>
      )
    }

    const container = document.createElement('div')
    const dispose = render(
      () => (
        <Loading fallback={<span data-testid="loading" />}>
          <Component />
        </Loading>
      ),
      container,
    )
    flush()
    expect(container.querySelector('[data-testid="loading"]')).not.toBeNull()

    resolve('tony-hawk')
    await tick()
    flush()
    expect(container.querySelector('[data-testid="name"]')?.textContent).toBe(
      'tony-hawk',
    )
    dispose()
  })

  it('waits for async form group props instead of throwing', async () => {
    let resolve!: (name: string) => void

    function Component() {
      const form = createForm(() => ({
        defaultValues: { person: { name: 'tony-hawk' } },
      }))
      // The group's name comes from an async value.
      const key = createMemo(() => new Promise<string>((r) => (resolve = r)))

      return (
        <form.FormGroup name={key() as 'person'}>
          {(group) => (
            <group.Field name="name">
              {(field) => <span data-testid="name">{field().value}</span>}
            </group.Field>
          )}
        </form.FormGroup>
      )
    }

    const container = document.createElement('div')
    const dispose = render(
      () => (
        <Loading fallback={<span data-testid="loading" />}>
          <Component />
        </Loading>
      ),
      container,
    )
    flush()

    resolve('person')
    await tick()
    flush()
    expect(container.querySelector('[data-testid="name"]')?.textContent).toBe(
      'tony-hawk',
    )
    dispose()
  })
})
