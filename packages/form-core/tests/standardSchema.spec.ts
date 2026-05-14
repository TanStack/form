import { describe, expect, it, vi } from 'vitest'
import {
  isStandardSchema,
  parseStandardSchema,
  prefixSchemaToErrors,
} from '../src/standardSchema.lib'
import type {
  StandardSchemaV1,
  StandardSchemaV1Issue,
} from '../src/standardSchema.public'

function getSchema<TOutput>(
  validate: StandardSchemaV1<unknown, TOutput>['~standard']['validate'],
): StandardSchemaV1<unknown, TOutput> {
  return {
    '~standard': {
      version: 1,
      vendor: 'test',
      validate,
    },
  }
}

describe('standard schema validation', () => {
  describe('prefixSchemaToErrors', () => {
    it('does not use an empty string as a field path for root issues', () => {
      const issues = [
        { message: 'Invalid form' },
        { message: 'Still invalid', path: [] },
        { message: 'Empty string paths are root errors', path: [''] },
      ] satisfies Array<StandardSchemaV1Issue>

      expect(prefixSchemaToErrors(issues, {})).toEqual({})
    })

    it('prefixes nested object paths and preserves multiple issues for the same field', () => {
      const issues = [
        { message: 'Name is required', path: ['user', 'name'] },
        { message: 'Name is too short', path: ['user', { key: 'name' }] },
      ] satisfies Array<StandardSchemaV1Issue>

      expect(prefixSchemaToErrors(issues, { user: { name: '' } })).toEqual({
        'user.name': issues,
      })
    })

    it('uses bracket notation for array indexes from number or string path segments', () => {
      const issues = [
        { message: 'First name is required', path: ['users', 0, 'name'] },
        { message: 'Second name is required', path: ['users', '1', 'name'] },
      ] satisfies Array<StandardSchemaV1Issue>

      expect(
        prefixSchemaToErrors(issues, {
          users: [{ name: '' }, { name: '' }],
        }),
      ).toEqual({
        'users[0].name': [issues[0]],
        'users[1].name': [issues[1]],
      })
    })

    it('keeps building the path after traversal reaches a primitive value', () => {
      const issue = {
        message: 'Length is too short',
        path: ['name', 'length'],
      } satisfies StandardSchemaV1Issue

      expect(prefixSchemaToErrors([issue], { name: '' })).toEqual({
        'name.length': [issue],
      })
    })

    it('skips undefined path segments', () => {
      const issue = {
        message: 'Value is required',
        path: ['user', undefined, 'name'],
      } as StandardSchemaV1Issue

      expect(prefixSchemaToErrors([issue], { user: { name: '' } })).toEqual({
        'user.name': [issue],
      })
    })

    it('skips empty string path segments as no accessor', () => {
      const issues = [
        { message: 'Middle segment', path: ['foo', '', 'bar'] },
        { message: 'Leading segment', path: ['', 'bar'] },
        { message: 'Object segment', path: ['foo', { key: '' }, 'baz'] },
      ] satisfies Array<StandardSchemaV1Issue>

      expect(
        prefixSchemaToErrors(issues, {
          foo: { bar: '', baz: '' },
          bar: '',
        }),
      ).toEqual({
        'foo.bar': [issues[0]],
        bar: [issues[1]],
        'foo.baz': [issues[2]],
      })
    })

    it('does not treat empty string path segments as array indexes', () => {
      const issue = {
        message: 'Name is required',
        path: ['users', '', 'name'],
      } satisfies StandardSchemaV1Issue

      expect(prefixSchemaToErrors([issue], { users: [{ name: '' }] })).toEqual({
        'users.name': [issue],
      })
    })
  })

  describe('isStandardSchema', () => {
    it('identifies standard schema objects', () => {
      expect(isStandardSchema(getSchema((value) => ({ value })))).toBe(true)
    })

    it('rejects validator functions and plain objects', () => {
      expect(isStandardSchema(() => null)).toBe(false)
      expect(
        isStandardSchema({ run: () => null } as unknown as StandardSchemaV1),
      ).toBe(false)
    })
  })

  describe('parseStandardSchema', () => {
    it('returns schema output for successful validation', async () => {
      const schema = getSchema((value) => ({
        value: { parsed: String(value).toUpperCase() },
      }))

      await expect(parseStandardSchema(schema, 'value', 'form')).resolves.toEqual(
        {
          result: null,
          schemaResult: { parsed: 'VALUE' },
          hasSchemaResult: true,
        },
      )
    })

    it('returns field issues directly for field scope', async () => {
      const issues = [
        { message: 'Field is required', path: ['name'] },
      ] satisfies Array<StandardSchemaV1Issue>
      const schema = getSchema(() => ({ issues }))

      await expect(parseStandardSchema(schema, '', 'field')).resolves.toEqual({
        result: issues,
        schemaResult: null,
        hasSchemaResult: false,
      })
    })

    it('returns prefixed field errors for form scope', async () => {
      const issues = [
        { message: 'Name is required', path: ['users', 0, 'name'] },
      ] satisfies Array<StandardSchemaV1Issue>
      const schema = getSchema(() => Promise.resolve({ issues }))

      await expect(
        parseStandardSchema(schema, { users: [{ name: '' }] }, 'form'),
      ).resolves.toEqual({
        result: {
          form: issues,
          fields: {
            'users[0].name': issues,
          },
        },
        schemaResult: null,
        hasSchemaResult: false,
      })
    })

    it('returns all schema issues as form-level errors and filters root issues from fields', async () => {
      const issues = [
        { message: 'Invalid form' },
        { message: 'Empty string paths are root errors', path: [''] },
        { message: 'Name is required', path: ['name'] },
      ] satisfies Array<StandardSchemaV1Issue>
      const schema = getSchema(() => ({ issues }))

      await expect(
        parseStandardSchema(schema, { name: '' }, 'form'),
      ).resolves.toEqual({
        result: {
          form: issues,
          fields: {
            name: [issues[2]],
          },
        },
        schemaResult: null,
        hasSchemaResult: false,
      })
    })

    it('calls validate with the provided value', async () => {
      const validate = vi.fn((value: unknown) => ({ value }))
      const schema = getSchema(validate)
      const value = { name: 'Test' }

      await parseStandardSchema(schema, value, 'form')

      expect(validate).toHaveBeenCalledWith(value)
    })
  })
})
