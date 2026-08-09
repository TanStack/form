import { describe, expect, it } from 'vitest'

import {
  callUpdater,
  concatenateFieldNames,
  evaluate,
  getBy,
  isNil,
  isNotNil,
  isPromiseLike,
  normalizeToArray,
  resolveFieldUpdateOptions,
  setBy,
} from '../src/utils.lib'

describe('utils', () => {
  it('resolves field update defaults from the triggering event', () => {
    expect(resolveFieldUpdateOptions(undefined, 'change')).toMatchObject({
      causeValidation: true,
      markAsBlurred: false,
      markAsDirty: true,
      markAsTouched: true,
      _skipFieldCreation: false,
      fieldApiOverride: null,
      doPropagate: true,
    })

    expect(resolveFieldUpdateOptions(undefined, 'blur')).toMatchObject({
      markAsBlurred: true,
      markAsDirty: false,
      markAsTouched: false,
    })

    expect(resolveFieldUpdateOptions(undefined, 'submit')).toMatchObject({
      markAsBlurred: false,
      markAsDirty: false,
      markAsTouched: true,
    })

    expect(resolveFieldUpdateOptions(undefined, 'noEvent')).toMatchObject({
      markAsBlurred: false,
      markAsDirty: false,
      markAsTouched: false,
      _skipFieldCreation: true,
    })
  })

  it('honors explicit field update options', () => {
    const fieldApiOverride = {} as never

    expect(
      resolveFieldUpdateOptions(
        {
          causeValidation: false,
          markAsBlurred: true,
          markAsDirty: false,
          markAsTouched: false,
          _skipFieldCreation: false,
          fieldApiOverride,
          doPropagate: false,
        },
        'change',
      ),
    ).toEqual({
      causeValidation: false,
      markAsBlurred: true,
      markAsDirty: false,
      markAsTouched: false,
      _skipFieldCreation: false,
      fieldApiOverride,
      doPropagate: false,
    })
  })

  it('reads nested values through object and array paths', () => {
    const source = { user: { names: ['Ada'] } }

    expect(getBy(source, 'user.names[0]')).toBe('Ada')
    expect(getBy(source, 'user.missing.name')).toBeUndefined()
    expect(getBy({ user: null }, 'user')).toBeNull()
    expect(getBy({ user: null }, 'user.name')).toBeUndefined()
  })

  it('sets nested object values immutably', () => {
    const source = { user: null as null | { name: string } }

    expect(setBy(source, 'user.name', 'Ada')).toEqual({
      user: { name: 'Ada' },
    })
    expect(source.user).toBeNull()
  })

  it('sets array values and preserves sparse indexes', () => {
    expect(setBy({}, 'items[2].name', 'Ada')).toEqual({
      items: { 2: { name: 'Ada' } },
    })

    expect(setBy({ items: [] }, 'items[2].name', 'Ada')).toEqual({
      items: [undefined, undefined, { name: 'Ada' }],
    })

    expect(setBy(['first'], '[2]', 'third')).toEqual(['first', 'third'])
    expect(setBy([], '[2]', 'third')).toEqual([undefined, undefined, 'third'])
    expect(setBy(undefined, [undefined], 'third')).toEqual([undefined, 'third'])
  })

  it('calls updater functions with the current value', () => {
    expect(callUpdater((value: number) => value + 1, 1)).toBe(2)
    expect(setBy({ count: 1 }, 'count', (value: number) => value + 1)).toEqual({
      count: 2,
    })
  })

  it('normalizes optional single-or-many values to arrays', () => {
    expect(normalizeToArray(null)).toEqual([])
    expect(normalizeToArray(undefined)).toEqual([])
    expect(normalizeToArray('one')).toEqual(['one'])
    expect(normalizeToArray(['one', 'two'])).toEqual(['one', 'two'])
  })

  it('compares supported value shapes deeply', () => {
    expect(evaluate(NaN, NaN)).toBe(true)
    expect(evaluate(1, '1' as never)).toBe(false)
    expect(evaluate(new Date(1), new Date(1))).toBe(true)
    expect(evaluate(new Date(1), new Date(2))).toBe(false)
    expect(
      evaluate(
        new File(['a'], 'a.txt', { lastModified: 1 }),
        new File(['a'], 'a.txt', { lastModified: 1 }),
      ),
    ).toBe(true)
    expect(
      evaluate(
        new File(['a'], 'a.txt', { lastModified: 1 }),
        new File(['b'], 'b.txt', { lastModified: 1 }),
      ),
    ).toBe(false)
    expect(
      evaluate(
        new File(['a'], 'a.txt', { lastModified: 1 }),
        new File(['a'], 'a.txt', { lastModified: 2 }),
      ),
    ).toBe(false)
    expect(evaluate(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true)
    expect(evaluate(new Map([['a', 1]]), new Map([['a', 2]]))).toBe(false)
    expect(evaluate(new Map([['a', 1]]), new Map())).toBe(false)
    expect(evaluate(new Set(['a']), new Set(['a']))).toBe(true)
    expect(evaluate(new Set(['a']), new Set(['b']))).toBe(false)
    expect(evaluate(new Set(['a']), new Set())).toBe(false)
    expect(evaluate({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
    expect(evaluate({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false)
    expect(evaluate({ a: 1 }, { a: 1, b: 2 })).toBe(false)
  })

  it('concatenates field names with dot and bracket notation', () => {
    expect(concatenateFieldNames('', 'name')).toBe('name')
    expect(concatenateFieldNames('user', '')).toBe('user')
    expect(concatenateFieldNames('items', '[0]')).toBe('items[0]')
    expect(concatenateFieldNames('user', 'name')).toBe('user.name')
  })

  it('checks nil and promise-like values', () => {
    expect(isNotNil('value')).toBe(true)
    expect(isNotNil(null)).toBe(false)
    expect(isNil(undefined)).toBe(true)
    expect(isNil('value')).toBe(false)
    expect(isPromiseLike(Promise.resolve())).toBe(true)
    expect(isPromiseLike({ then: () => undefined })).toBe(true)
    expect(isPromiseLike({ then: true })).toBe(false)
    expect(isPromiseLike(null)).toBe(false)
  })
})
