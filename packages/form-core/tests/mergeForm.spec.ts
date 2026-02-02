import { describe, expect, it } from 'vitest'
import { FormApi } from '../src/FormApi'
import { mergeForm, mutateMergeDeep } from '../src/mergeForm'

type TestObject = Record<string, any>

describe('mutateMergeDeep', () => {
  it('should prevent prototype pollution through __proto__', () => {
    const target: TestObject = {}
    const malicious = {
      __proto__: {
        polluted: true,
      },
    }

    mutateMergeDeep(target, malicious)
    expect(({} as TestObject).polluted).toBeUndefined()
    expect((Object.prototype as TestObject).polluted).toBeUndefined()
  })

  it('should prevent prototype pollution through constructor', () => {
    const target: TestObject = {}
    const malicious = {
      constructor: {
        prototype: {
          polluted: true,
        },
      },
    }

    mutateMergeDeep(target, malicious)
    expect(({} as TestObject).polluted).toBeUndefined()
  })

  it('should handle null values correctly', () => {
    const target = { details: null }
    const source = { details: { age: 25 } }

    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ details: { age: 25 } })
  })

  it('should preserve object references when updating nested objects', () => {
    const target: { user: { details: TestObject } } = { user: { details: {} } }
    const source = { user: { details: { name: 'test' } } }

    const originalDetails = target.user.details
    mutateMergeDeep(target, source)
    expect(target.user.details).toBe(originalDetails)
    expect(target.user.details.name).toBe('test')
  })

  it('Should merge two objects by mutating', () => {
    const a = { a: 1 }
    const b = { b: 2 }
    mutateMergeDeep(a, b)
    expect(a).toStrictEqual({ a: 1, b: 2 })
  })

  it('Should merge two objects including overwriting with undefined', () => {
    const a = { a: 1 }
    const b = { a: undefined }
    mutateMergeDeep(a, b)
    expect(a).toStrictEqual({ a: undefined })
  })

  it('Should merge two object by overriding arrays', () => {
    const target = { a: [1] }
    const source = { a: [2] }
    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ a: [2] })
  })

  it('Should merge add array element when it does not exist in target', () => {
    const target = { a: [] }
    const source = { a: [2] }
    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ a: [2] })
  })

  it('Should override the target array if source is undefined', () => {
    const target = { a: [2] }
    const source = { a: undefined }
    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ a: undefined })
  })

  it('Should merge update array element when it does not exist in source', () => {
    const target = { a: [2] }
    const source = { a: [] }
    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ a: [] })
  })

  it('Should merge two deeply nested objects', () => {
    const a = { a: { a: 1 } }
    const b = { a: { b: 2 } }
    mutateMergeDeep(a, b)
    expect(a).toStrictEqual({ a: { a: 1, b: 2 } })
  })

  it('should return empty object when target is null', () => {
    const result = mutateMergeDeep(null, { a: 1 })
    expect(result).toStrictEqual({})
  })

  it('should return empty object when target is undefined', () => {
    const result = mutateMergeDeep(undefined, { a: 1 })
    expect(result).toStrictEqual({})
  })

  it('should return empty object when target is not an object', () => {
    const result = mutateMergeDeep('string' as any, { a: 1 })
    expect(result).toStrictEqual({})
  })

  it('should return target unchanged when source is null', () => {
    const target = { a: 1 }
    const result = mutateMergeDeep(target, null)
    expect(result).toBe(target)
    expect(result).toStrictEqual({ a: 1 })
  })

  it('should return target unchanged when source is undefined', () => {
    const target = { a: 1 }
    const result = mutateMergeDeep(target, undefined)
    expect(result).toBe(target)
    expect(result).toStrictEqual({ a: 1 })
  })

  it('should return target unchanged when source is not an object', () => {
    const target = { a: 1 }
    const result = mutateMergeDeep(target, 'string' as any)
    expect(result).toBe(target)
    expect(result).toStrictEqual({ a: 1 })
  })

  it('should replace arrays completely without merging their elements', () => {
    const target = {
      users: [
        { id: 1, name: 'Old User', deleted: true },
        { id: 2, name: 'Another User' },
      ],
    }
    const source = {
      users: [{ id: 1, name: 'New User' }],
    }

    mutateMergeDeep(target, source)

    expect(target.users).toHaveLength(1)
    expect(target.users[0]).toStrictEqual({ id: 1, name: 'New User' })
    expect(target.users[0]).not.toHaveProperty('deleted')
  })

  it('should handle circular references without stack overflow', () => {
    const target: any = { data: { value: 1 } }
    target.data.self = target.data

    const source = { data: { newValue: 2 } }

    expect(() => mutateMergeDeep(target, source)).not.toThrow()
    expect(target.data.newValue).toBe(2)
    expect(target.data.value).toBe(1)
    expect(target.data.self).toBe(target.data)
  })

  it('should not merge symbol keys (Object.keys limitation)', () => {
    const sym = Symbol('test')
    const target = { [sym]: 'original', regular: 'value' }
    const source = { [sym]: 'new', regular: 'updated' }

    mutateMergeDeep(target, source)

    expect(target[sym]).toBe('original')

    expect(target.regular).toBe('updated')
  })
})

describe('mergeForm', () => {

  // `as any` required: FormApi has 12 generic params with TSubmitMeta defaulting to `never`,
  // incompatible with mergeForm's `any` constraint. Type limitation only - runtime is correct.
  // Production usage via useTransform receives AnyFormApi, avoiding this.

  it('should merge state into form using mutateMergeDeep', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
        age: 0,
      },
    })

    form.mount()

    const newState = {
      values: {
        name: 'John',
        age: 30,
      },
    }

    const result = mergeForm(form as any, newState)

    expect(result).toBe(form)

    expect(form.state.values).toStrictEqual({
      name: 'John',
      age: 30,
    })
  })

  it('should handle partial state updates', () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
        lastName: '',
      },
    })

    form.mount()

    mergeForm(form as any, {
      values: {
        firstName: 'Jane',
      },
    })

    expect(form.state.values.firstName).toBe('Jane')
    expect(form.state.values.lastName).toBe('')
  })

  it('should handle deeply nested state updates', () => {
    const form = new FormApi({
      defaultValues: {
        user: {
          profile: {
            name: '',
            age: 0,
          },
        },
      },
    })

    form.mount()

    mergeForm(form as any, {
      values: {
        user: {
          profile: {
            name: 'Alice',
          },
        },
      },
    })

    expect(form.state.values.user.profile.name).toBe('Alice')
    expect(form.state.values.user.profile.age).toBe(0)
  })
})
