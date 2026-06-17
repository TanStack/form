import { describe, expect, it } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('field - isDefaultValue', () => {
  it('tracks leaf fields independently from dirty state', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    expect(field.meta.isDefaultValue).toBe(true)

    field.handleChange('Alice')
    expect(field.meta.isDefaultValue).toBe(false)

    field.handleChange('')
    expect(field.meta.isDefaultValue).toBe(true)
    expect(field.meta.isDirty).toBe(true)
    expect(field.meta.isPristine).toBe(false)
  })

  it('does not cache primitive field comparisons', () => {
    const form = new InternalFormApi({ defaultValues: { user: { name: '' } } })
    const user = form._getOrCreateFieldApi({ name: 'user' })
    const name = form._getOrCreateFieldApi({ name: 'user.name' })

    expect(name.meta.isDefaultValue).toBe(true)
    expect(name._defaultValueCache).toBeNull()

    name.handleChange('Tony')
    expect(name.meta.isDefaultValue).toBe(false)
    expect(name._defaultValueCache).toBeNull()
    expect(user._defaultValueCache?.isDefaultValue).toBe(false)
  })

  it('derives parent fields from descendant values', () => {
    const form = new InternalFormApi({
      defaultValues: {
        user: { firstName: 'Tony', lastName: 'Hawk' },
      },
    })
    const user = form._getOrCreateFieldApi({ name: 'user' })
    const firstName = form._getOrCreateFieldApi({ name: 'user.firstName' })
    const lastName = form._getOrCreateFieldApi({ name: 'user.lastName' })

    expect(user.meta.isDefaultValue).toBe(true)
    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(lastName.meta.isDefaultValue).toBe(true)

    firstName.handleChange('Anthony')
    expect(firstName.meta.isDefaultValue).toBe(false)
    expect(user.meta.isDefaultValue).toBe(false)
    expect(lastName.meta.isDefaultValue).toBe(true)

    firstName.handleChange('Tony')
    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(user.meta.isDefaultValue).toBe(true)
  })

  it('keeps descendants default when an ancestor cache reports default', () => {
    const form = new InternalFormApi({
      defaultValues: { user: { name: 'Tony' } },
    })
    const user = form._getOrCreateFieldApi({ name: 'user' })

    expect(user.meta.isDefaultValue).toBe(true)

    const name = form._getOrCreateFieldApi({ name: 'user.name' })
    expect(name.meta.isDefaultValue).toBe(true)
  })

  it('handles array mutations and path cache invalidation', () => {
    const form = new InternalFormApi({
      defaultValues: {
        items: [{ name: 'a' }, { name: 'b' }],
      },
    })
    const items = form._getOrCreateFieldApi({ name: 'items' })
    const firstName = form._getOrCreateFieldApi({ name: 'items[0].name' })

    expect(items.meta.isDefaultValue).toBe(true)
    expect(firstName.meta.isDefaultValue).toBe(true)

    items.swapValues(0, 1)
    expect(firstName.name).toBe('items[1].name')
    expect(firstName.meta.isDefaultValue).toBe(false)
    expect(items.meta.isDefaultValue).toBe(false)

    items.swapValues(0, 1)
    expect(firstName.name).toBe('items[0].name')
    expect(firstName.meta.isDefaultValue).toBe(true)
    expect(items.meta.isDefaultValue).toBe(true)
  })

  it('returns arrays to default after inverse operations', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })
    const items = form._getOrCreateFieldApi({ name: 'items' })

    items.moveValue(0, 2)
    expect(items.meta.isDefaultValue).toBe(false)

    items.moveValue(2, 0)
    expect(items.meta.isDefaultValue).toBe(true)

    items.insertValue(1, 'x')
    expect(items.meta.isDefaultValue).toBe(false)

    items.removeValue(1)
    expect(items.meta.isDefaultValue).toBe(true)

    items.pushValue('d')
    expect(items.meta.isDefaultValue).toBe(false)

    items.removeValue(3)
    expect(items.meta.isDefaultValue).toBe(true)

    items.clearValues()
    expect(items.meta.isDefaultValue).toBe(false)

    items.reset()
    expect(items.meta.isDefaultValue).toBe(true)
  })
})
