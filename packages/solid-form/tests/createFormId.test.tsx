import { describe, expect, it } from 'vitest'
import { render } from '@solidjs/testing-library'
import { createForm } from '../src/index'

function Comp() {
  const form = createForm(() => ({ defaultValues: { firstName: '' } }))
  return <form id={form.formId} data-testid="form" />
}

describe('createForm formId', () => {
  it('uses the provided formId when one is given', () => {
    function WithId() {
      const form = createForm(() => ({
        defaultValues: { firstName: '' },
        formId: 'my-form',
      }))
      return <form id={form.formId} data-testid="form" />
    }

    const { getByTestId } = render(() => <WithId />)

    expect(getByTestId('form').getAttribute('id')).toBe('my-form')
  })

  it('derives the default formId from Solid so it survives hydration', () => {
    // `form-core` falls back to `uuid()`, which is seeded from `Math.random()`
    // and so differs between the server render and the client render. Solid's
    // `createUniqueId()` is the adapter's SSR-safe counterpart: on the client
    // it yields `cl-<n>`, and under hydration it derives the id from the
    // hydration context so both renders agree. Asserting the id comes from
    // that sequence is what pins the default to the hydration-safe source.
    const { getByTestId } = render(() => <Comp />)

    expect(getByTestId('form').getAttribute('id')).toMatch(/^cl-\d+$/)
  })
})
