import { describe, expect, it } from 'vitest'
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

    expect(map).toMatchObject({ form: expected, fields: {} })
  })

  it('normalizes initial field validation errors', () => {
    const map = createErrorMap({
      fields: { name: 'Required', age: ['Too young', 'Must be an adult'] },
    })

    expect(map).toMatchObject({
      form: [],
      fields: { name: ['Required'], age: ['Too young', 'Must be an adult'] },
    })
  })

  it('allows editing errors without changing the supplied readonly containers', () => {
    const issue = { message: 'Invalid' }
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
    expect(nameErrors).toBeInstanceOf(Array)
    map.addFieldError('name', { message: 'Too short' })
    map.addFormError({ message: 'Check the form' })
    map.addFieldError('age', { message: 'Too young' })

    expect(map).toMatchObject({
      form: [issue, { message: 'Check the form' }],
      fields: {
        name: [issue, { message: 'Too short' }],
        age: [issue, { message: 'Too young' }],
      },
    })
    expect(initial).toEqual({
      form: [issue],
      fields: { name: [issue], age: issue },
    })
  })
})
