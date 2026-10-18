import { describe, expectTypeOf, it } from 'vitest'
import type { StandardSchemaV1Issue } from '../../src/standardSchema.public'
import type {
  CreateErrorMapFn,
  ValidationFailureItem,
} from '../../src/validation/state.public'

declare const createErrorMap: CreateErrorMapFn<unknown>
declare const createNameErrorMap: CreateErrorMapFn<{ name: string }>

describe('CreateErrorMapFn', () => {
  it('keeps string and issue errors mutable', () => {
    const strings = createErrorMap({ form: ['Required'] })
    const scalarString = createErrorMap({ form: 'Required' })
    const readonlyStrings = createErrorMap({ form: ['Required'] as const })
    const issues = createErrorMap({ form: [{ message: 'Required' }] })
    const scalarIssue = createErrorMap({ form: { message: 'Required' } })
    const readonlyIssues = createErrorMap({
      form: [{ message: 'Required' }] as const,
    })

    strings.form.push('Too short')
    scalarString.form.push('Too short')
    readonlyStrings.form.push('Too short')
    issues.form.push({ message: 'Too short' })
    scalarIssue.form.push({ message: 'Too short' })
    readonlyIssues.form.push({ message: 'Required' })
    strings.fields.name = 'Required'
    strings.fields.age = ['Too young', 'Must be an adult']
    issues.fields.name = { message: 'Required' }
    issues.fields.age = [{ message: 'Too young' }]
  })

  it('accepts strings and issues when no error item type can be inferred', () => {
    const omitted = createErrorMap()
    const empty = createErrorMap({ form: [] })
    const emptyFields = createErrorMap({ fields: { name: [] } })

    expectTypeOf(omitted.form).toEqualTypeOf<Array<ValidationFailureItem>>()
    expectTypeOf(empty.form).toEqualTypeOf<Array<ValidationFailureItem>>()
    expectTypeOf(emptyFields.form).toEqualTypeOf<Array<ValidationFailureItem>>()
    empty.form.push('Required')
    omitted.form.push({ message: 'Invalid' })
    emptyFields.fields.name = { message: 'Invalid' }
  })

  it('retains custom issue types inferred from form or field errors', () => {
    const issue = { message: 'Invalid name', code: 'name' as const }
    const fromForm = createErrorMap({ form: [issue] })
    const fromFields = createErrorMap({
      form: [],
      fields: { name: [issue], age: issue },
    })

    expectTypeOf(fromForm.form).toEqualTypeOf<Array<typeof issue>>()
    expectTypeOf(fromFields.form).toEqualTypeOf<Array<typeof issue>>()
    fromForm.fields.name = [issue]
    fromFields.form.push(issue)
  })

  it('rejects invalid errors and field paths', () => {
    // @ts-expect-error Numbers are not validation errors.
    createErrorMap({ form: 42 })
    // @ts-expect-error Issue objects require a message.
    createErrorMap({ form: { code: 'invalid' } })
    // @ts-expect-error Initial field paths must belong to the scoped values.
    createNameErrorMap({ fields: { missing: 'Invalid' } })
    // @ts-expect-error Known paths must not hide an invalid path in the same map.
    createNameErrorMap({ fields: { name: 'Required', missing: 'Invalid' } })

    const map = createNameErrorMap()
    map.fields.name = 'Required'
    // @ts-expect-error Mutation also checks field paths.
    map.fields.missing = 'Invalid'
  })

  it('rejects schema issue arrays as initial maps', () => {
    const issues: ReadonlyArray<StandardSchemaV1Issue> = []

    // @ts-expect-error Schema issue arrays must be converted with parseIssues.
    createErrorMap(issues)
    // @ts-expect-error Empty arrays are not partial error maps either.
    createErrorMap([])
  })
})
