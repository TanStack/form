import { assert, describe, expect, it } from 'vitest'
import { createErrorMap } from '../../src/validation/createErrorMap.lib'

describe('createErrorMap', () => {
  it.each([
    { form: 'Check the form', expected: ['Check the form'] },
    {
      form: { message: 'Invalid', code: 'custom' },
      expected: [{ message: 'Invalid', code: 'custom' }],
    },
  ])('normalizes a single form error: $form', ({ form, expected }) => {
    const map = createErrorMap({ form })

    expect(map).toEqual({ form: expected, fields: {} })
  })

  it('accepts single and multiple field errors without a form error', () => {
    const map = createErrorMap({
      fields: { name: 'Required', age: ['Too young', 'Must be an adult'] },
    })

    expect(map).toEqual({
      form: [],
      fields: { name: 'Required', age: ['Too young', 'Must be an adult'] },
    })
  })

  it('allows editing errors without changing the supplied readonly containers', () => {
    const issue = { message: 'Invalid', code: 'custom' }
    // While `expect(old).not.toBe(new)` reads better,
    // we need to verify that
    // 1. It's shallow copied
    // 2. It doesn't modify the input while doing so
    const initial = Object.freeze({
      form: Object.freeze([issue]),
      fields: Object.freeze({ name: Object.freeze([issue]), age: issue }),
    })

    const map = createErrorMap(initial)
    const nameErrors = map.fields.name
    assert(Array.isArray(nameErrors))
    nameErrors.push({ message: 'Too short', code: 'length' })
    map.form.push({ message: 'Check the form', code: 'form' })
    map.fields.age = { message: 'Too young', code: 'age' }

    expect(map).toEqual({
      form: [issue, { message: 'Check the form', code: 'form' }],
      fields: {
        name: [issue, { message: 'Too short', code: 'length' }],
        age: { message: 'Too young', code: 'age' },
      },
    })
    expect(initial).toEqual({
      form: [issue],
      fields: { name: [issue], age: issue },
    })
  })

  it.each([
    { scenario: 'omitted errors', initial: undefined },
    { scenario: 'an empty error map', initial: {} },
  ])(
    'keeps separately created maps independent with $scenario',
    ({ initial }) => {
      const first = createErrorMap(initial)
      const second = createErrorMap(initial)

      first.form.push({ message: 'Invalid form' })
      first.fields.name = { message: 'Required' }

      expect(first).toEqual({
        form: [{ message: 'Invalid form' }],
        fields: { name: { message: 'Required' } },
      })
      expect(second).toEqual({ form: [], fields: {} })
    },
  )
})
