import { describe, expect, it } from 'vitest'
import {
  PARSED_ISSUES,
  parseIssuesFactory,
} from '../../src/validation/parseIssues.lib'

describe('parseIssuesFactory - fieldErrorTarget', () => {
  it('routes field issues to their paths and keeps pathless issues on the form', () => {
    const nameIssue = { message: 'Name is required', path: ['name'] }
    const otherNameIssue = { message: 'Name is too short', path: ['name'] }
    const itemIssue = {
      message: 'Item name is required',
      path: [{ key: 'items' }, { key: '0' }, { key: 'name' }],
    }
    const formIssue = { message: 'Check the form' }
    const emptyPathIssue = { message: 'Empty path', path: [] }
    const normalizedEmptyPathIssue = {
      message: 'Path normalizes to empty',
      path: ['', { key: '' }],
    }
    const parseIssues = parseIssuesFactory(
      { name: '', items: [{ name: '' }] },
      'field',
    )

    const result = parseIssues([
      nameIssue,
      formIssue,
      otherNameIssue,
      itemIssue,
      emptyPathIssue,
      normalizedEmptyPathIssue,
    ])

    expect(result).toMatchObject({
      form: [formIssue, emptyPathIssue, normalizedEmptyPathIssue],
      fields: {
        name: [nameIssue, otherNameIssue],
        'items[0].name': [itemIssue],
      },
    })
  })

  it('routes issues to both their fields and the form in their original order', () => {
    const nameIssue = { message: 'Name is required', path: ['name'] }
    const formIssue = { message: 'Check the form' }
    const otherNameIssue = { message: 'Name is too short', path: ['name'] }
    const parseIssues = parseIssuesFactory({ name: '' }, 'field-and-self')

    const result = parseIssues([nameIssue, formIssue, otherNameIssue])

    expect(result).toMatchObject({
      form: [nameIssue, formIssue, otherNameIssue],
      fields: { name: [nameIssue, otherNameIssue] },
    })
  })

  it('routes all issues only to the form when the target is self', () => {
    const nameIssue = { message: 'Name is required', path: ['name'] }
    const formIssue = { message: 'Check the form' }
    const emailIssue = { message: 'Invalid email', path: ['email'] }
    const parseIssues = parseIssuesFactory({ name: '', email: '' }, 'self')

    const result = parseIssues([nameIssue, formIssue, emailIssue])

    expect(result).toMatchObject({
      form: [nameIssue, formIssue, emailIssue],
      fields: {},
    })
  })

  it.each(['field', 'field-and-self', 'self'] as const)(
    'returns an empty error map for no issues with target %s',
    (fieldErrorTarget) => {
      const parseIssues = parseIssuesFactory({ name: '' }, fieldErrorTarget)

      const result = parseIssues([])

      expect(result).toMatchObject({
        form: [],
        fields: {},
      })
    },
  )
})
