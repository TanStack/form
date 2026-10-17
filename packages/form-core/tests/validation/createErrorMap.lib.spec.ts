import { assert, describe, expect, it } from 'vitest'
import { createErrorMapFactory } from '../../src/validation/createErrorMap.lib'
import type { StandardSchemaV1Issue } from '../../src/standardSchema.public'

describe('createErrorMap', () => {
  it.each([
    { form: 'Check the form', expected: ['Check the form'] },
    {
      form: { message: 'Invalid', code: 'custom' },
      expected: [{ message: 'Invalid', code: 'custom' }],
    },
  ])('normalizes a single form error: $form', ({ form, expected }) => {
    const createErrorMap = createErrorMapFactory({ name: '' })

    const map = createErrorMap({ form })

    expect(map).toEqual({ form: expected, fields: {} })
  })

  it('accepts single and multiple field errors without a form error', () => {
    const createErrorMap = createErrorMapFactory({ name: '', age: 0 })

    const map = createErrorMap({
      fields: { name: 'Required', age: ['Too young', 'Must be an adult'] },
    })

    expect(map).toEqual({
      form: [],
      fields: { name: 'Required', age: ['Too young', 'Must be an adult'] },
    })
  })

  it('allows editing errors without changing the supplied readonly containers', () => {
    const createErrorMap = createErrorMapFactory({ name: '', age: 0 })
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
      const createErrorMap = createErrorMapFactory({ name: '' })
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

  it('keeps maps created from an empty schema issue list independent', () => {
    const createErrorMap = createErrorMapFactory({ name: '' })
    const issues: Array<StandardSchemaV1Issue> = []
    const first = createErrorMap(issues)
    const second = createErrorMap(issues)

    first.form.push({ message: 'Invalid form' })
    first.fields.name = { message: 'Required' }

    expect(first).toEqual({
      form: [{ message: 'Invalid form' }],
      fields: { name: { message: 'Required' } },
    })
    expect(second).toEqual({ form: [], fields: {} })
    expect(issues).toEqual([])
  })

  it('keeps all schema issues in the form summary and groups nested field issues', () => {
    const createErrorMap = createErrorMapFactory({ users: [{ name: '' }] })
    const rootIssue: StandardSchemaV1Issue = { message: 'Invalid form' }
    const required: StandardSchemaV1Issue = {
      message: 'Required',
      path: ['users', { key: '0' }, 'name'],
    }
    const tooShort: StandardSchemaV1Issue = {
      message: 'Too short',
      path: ['users', 0, 'name'],
    }

    const map = createErrorMap([rootIssue, required, tooShort])

    expect(map).toEqual({
      form: [rootIssue, required, tooShort],
      fields: { 'users[0].name': [required, tooShort] },
    })
  })

  it('allows editing schema field errors independently of the summary and input', () => {
    const createErrorMap = createErrorMapFactory({ name: '' })
    const issue: StandardSchemaV1Issue = {
      message: 'Required',
      path: ['name'],
    }
    const issues = Object.freeze([issue])
    const map = createErrorMap(issues)

    const nameErrors = map.fields.name
    assert(Array.isArray(nameErrors))
    nameErrors.push({ message: 'Too short' })

    expect(map.form).toEqual([issue])

    map.form.push({ message: 'Check the form' })

    expect(map).toEqual({
      form: [issue, { message: 'Check the form' }],
      fields: { name: [issue, { message: 'Too short' }] },
    })
    expect(issues).toEqual([issue])
  })
})
