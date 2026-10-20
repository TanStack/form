import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('InternalFormApi - swapFieldValues', () => {
  it('swaps items and keeps existing nested fields attached to their items', () => {
    const form = new InternalFormApi({
      defaultValues: {
        items: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }],
      },
    })
    const arrayField = form._getOrCreateFieldApi({ name: 'items' })
    const item0 = form._getOrCreateFieldApi({ name: 'items[0]' })
    const item2 = form._getOrCreateFieldApi({ name: 'items[2]' })
    const name0 = form._getOrCreateFieldApi({ name: 'items[0].name' })
    const name2 = form._getOrCreateFieldApi({ name: 'items[2].name' })

    form.swapFieldValues('items', 0, 2)

    expect(form.state.values).toEqual({
      items: [{ name: 'Carol' }, { name: 'Bob' }, { name: 'Alice' }],
    })
    expect(name0.name).toBe('items[2].name')
    expect(name0.value).toBe('Alice')
    expect(name2.name).toBe('items[0].name')
    expect(name2.value).toBe('Carol')

    expect(arrayField.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isBlurred: false,
    })
    const untouchedMeta = { isTouched: false, isDirty: false, isBlurred: false }
    expect(item0.meta).toMatchObject(untouchedMeta)
    expect(name0.meta).toMatchObject(untouchedMeta)
    expect(item2.meta).toMatchObject(untouchedMeta)
    expect(name2.meta).toMatchObject(untouchedMeta)

    name0.handleChange('Alicia')
    name2.handleChange('Caroline')

    expect(form.state.values).toEqual({
      items: [{ name: 'Caroline' }, { name: 'Bob' }, { name: 'Alicia' }],
    })
  })

  it('leaves values and interaction state unchanged when both indices are equal', () => {
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
    const field = form._getOrCreateFieldApi({ name: 'items' })

    form.swapFieldValues('items', 1, 1)

    expect(form.state).toMatchObject({
      values: { items: ['a', 'b'] },
      isTouched: false,
      isDirty: false,
    })
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
    })
  })

  it('warns and preserves values when the field is not an array', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { name: 'Alice' } })

    form.swapFieldValues('name', 0, 1)

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('swapFieldValues')]),
    )
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: false,
      isDirty: false,
    })
  })

  it('swaps values without marking the form touched or dirty when metadata flags are false', () => {
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })

    form.swapFieldValues('items', 0, 1, {
      markAsTouched: false,
      markAsDirty: false,
      markAsBlurred: false,
    })

    expect(form.state).toMatchObject({
      values: { items: ['b', 'a'] },
      isTouched: false,
      isDirty: false,
      isPristine: true,
    })
  })
})

describe('InternalFormApi - moveFieldValue', () => {
  it('moves an item forward and keeps existing nested fields attached to their items', () => {
    const form = new InternalFormApi({
      defaultValues: {
        items: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Carol' },
          { name: 'Dan' },
        ],
      },
    })
    const arrayField = form._getOrCreateFieldApi({ name: 'items' })
    const item0 = form._getOrCreateFieldApi({ name: 'items[0]' })
    const item1 = form._getOrCreateFieldApi({ name: 'items[1]' })
    const item2 = form._getOrCreateFieldApi({ name: 'items[2]' })
    const item3 = form._getOrCreateFieldApi({ name: 'items[3]' })
    const name0 = form._getOrCreateFieldApi({ name: 'items[0].name' })
    const name1 = form._getOrCreateFieldApi({ name: 'items[1].name' })
    const name2 = form._getOrCreateFieldApi({ name: 'items[2].name' })
    const name3 = form._getOrCreateFieldApi({ name: 'items[3].name' })

    // Before:    0      1      2      3
    // After:     1      2      0      3
    // Fields:    name1  name2  name0  name3
    form.moveFieldValue('items', 0, 2)

    expect(form.state.values).toEqual({
      items: [
        { name: 'Bob' },
        { name: 'Carol' },
        { name: 'Alice' },
        { name: 'Dan' },
      ],
    })
    expect(name0.name).toBe('items[2].name')
    expect(name0.value).toBe('Alice')
    expect(name1.name).toBe('items[0].name')
    expect(name1.value).toBe('Bob')
    expect(name2.name).toBe('items[1].name')
    expect(name2.value).toBe('Carol')
    expect(name3.name).toBe('items[3].name')
    expect(name3.value).toBe('Dan')

    expect(arrayField.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isBlurred: false,
    })
    const untouchedMeta = { isTouched: false, isDirty: false, isBlurred: false }
    expect(item0.meta).toMatchObject(untouchedMeta)
    expect(name0.meta).toMatchObject(untouchedMeta)
    expect(item1.meta).toMatchObject(untouchedMeta)
    expect(name1.meta).toMatchObject(untouchedMeta)
    expect(item2.meta).toMatchObject(untouchedMeta)
    expect(name2.meta).toMatchObject(untouchedMeta)
    expect(item3.meta).toMatchObject(untouchedMeta)
    expect(name3.meta).toMatchObject(untouchedMeta)

    name0.handleChange('Alicia')
    name1.handleChange('Bobby')
    name2.handleChange('Caroline')
    name3.handleChange('Daniel')

    expect(form.state.values).toEqual({
      items: [
        { name: 'Bobby' },
        { name: 'Caroline' },
        { name: 'Alicia' },
        { name: 'Daniel' },
      ],
    })
  })

  it('moves an item backward while preserving the other items in order', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c', 'd'] },
    })

    form.moveFieldValue('items', 2, 0)

    expect(form.state.values).toEqual({ items: ['c', 'a', 'b', 'd'] })
  })

  it('leaves values and interaction state unchanged when both indices are equal', () => {
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
    const field = form._getOrCreateFieldApi({ name: 'items' })

    form.moveFieldValue('items', 1, 1)

    expect(form.state).toMatchObject({
      values: { items: ['a', 'b'] },
      isTouched: false,
      isDirty: false,
    })
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
    })
  })

  it('warns and preserves values when the field is not an array', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { name: 'Alice' } })

    form.moveFieldValue('name', 0, 1)

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('moveFieldValue')]),
    )
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: false,
      isDirty: false,
    })
  })

  it('warns and leaves values and interaction state unchanged for an out-of-bounds move', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
    const field = form._getOrCreateFieldApi({ name: 'items' })

    form.moveFieldValue('items', 0, 2)

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('out of bounds')]),
    )
    expect(form.state).toMatchObject({
      values: { items: ['a', 'b'] },
      isTouched: false,
      isDirty: false,
    })
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
    })
  })

  it('moves values without marking the form touched or dirty when metadata flags are false', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })

    form.moveFieldValue('items', 0, 2, {
      markAsTouched: false,
      markAsDirty: false,
      markAsBlurred: false,
    })

    expect(form.state).toMatchObject({
      values: { items: ['b', 'c', 'a'] },
      isTouched: false,
      isDirty: false,
      isPristine: true,
    })
  })
})

describe('InternalFormApi - pushFieldValue', () => {
  it('marks only the array field touched and dirty when appending an item', () => {
    const form = new InternalFormApi({
      defaultValues: { items: [{ name: 'Alice' }, { name: 'Bob' }] },
    })
    const arrayField = form._getOrCreateFieldApi({ name: 'items' })
    const item0 = form._getOrCreateFieldApi({ name: 'items[0]' })
    const item1 = form._getOrCreateFieldApi({ name: 'items[1]' })
    const name0 = form._getOrCreateFieldApi({ name: 'items[0].name' })
    const name1 = form._getOrCreateFieldApi({ name: 'items[1].name' })

    form.pushFieldValue('items', { name: 'Carol' })

    expect(form.state.values).toEqual({
      items: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }],
    })
    expect(arrayField.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isBlurred: false,
    })
    const item2 = form._getOrCreateFieldApi({ name: 'items[2]' })
    const name2 = form._getOrCreateFieldApi({ name: 'items[2].name' })
    const untouchedMeta = { isTouched: false, isDirty: false, isBlurred: false }
    expect(item0.meta).toMatchObject(untouchedMeta)
    expect(name0.meta).toMatchObject(untouchedMeta)
    expect(item1.meta).toMatchObject(untouchedMeta)
    expect(name1.meta).toMatchObject(untouchedMeta)
    expect(item2.meta).toMatchObject(untouchedMeta)
    expect(name2.meta).toMatchObject(untouchedMeta)
  })

  it('warns and preserves values and interaction state when the field is not an array', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { name: 'Alice' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })

    form.pushFieldValue('name', 'Bob')

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('pushFieldValue')]),
    )
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: false,
      isDirty: false,
    })
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
    })
  })
})

describe('InternalFormApi - insertFieldValue', () => {
  it('inserts an item at the beginning without changing the order of existing items', () => {
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })

    form.insertFieldValue('items', 0, 'x')

    expect(form.state.values).toEqual({ items: ['x', 'a', 'b'] })
  })

  it('inserts an item between existing items and keeps nested fields attached to their items', () => {
    const form = new InternalFormApi({
      defaultValues: {
        items: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }],
      },
    })
    const arrayField = form._getOrCreateFieldApi({ name: 'items' })
    const item0 = form._getOrCreateFieldApi({ name: 'items[0]' })
    const item1 = form._getOrCreateFieldApi({ name: 'items[1]' })
    const item2 = form._getOrCreateFieldApi({ name: 'items[2]' })
    const name0 = form._getOrCreateFieldApi({ name: 'items[0].name' })
    const name1 = form._getOrCreateFieldApi({ name: 'items[1].name' })
    const name2 = form._getOrCreateFieldApi({ name: 'items[2].name' })

    // Before:    0      1      2
    // After:     0      x      1      2
    // Fields:    name0  -      name1  name2
    form.insertFieldValue('items', 1, { name: 'Dan' })

    expect(form.state).toMatchObject({
      values: {
        items: [
          { name: 'Alice' },
          { name: 'Dan' },
          { name: 'Bob' },
          { name: 'Carol' },
        ],
      },
      isTouched: true,
      isDirty: true,
      isPristine: false,
    })
    expect(arrayField.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isPristine: false,
    })
    expect(name0.name).toBe('items[0].name')
    expect(name0.value).toBe('Alice')
    expect(name1.name).toBe('items[2].name')
    expect(name1.value).toBe('Bob')
    expect(name2.name).toBe('items[3].name')
    expect(name2.value).toBe('Carol')

    const untouchedMeta = { isTouched: false, isDirty: false, isBlurred: false }
    expect(item0.meta).toMatchObject(untouchedMeta)
    expect(name0.meta).toMatchObject(untouchedMeta)
    expect(item1.meta).toMatchObject(untouchedMeta)
    expect(name1.meta).toMatchObject(untouchedMeta)
    expect(item2.meta).toMatchObject(untouchedMeta)
    expect(name2.meta).toMatchObject(untouchedMeta)

    name0.handleChange('Alicia')
    name1.handleChange('Bobby')
    name2.handleChange('Caroline')

    expect(form.state.values).toEqual({
      items: [
        { name: 'Alicia' },
        { name: 'Dan' },
        { name: 'Bobby' },
        { name: 'Caroline' },
      ],
    })
  })

  it('inserts the first item into an empty array', () => {
    const form = new InternalFormApi({
      defaultValues: { items: [] as Array<string> },
    })

    form.insertFieldValue('items', 0, 'x')

    expect(form.state.values).toEqual({ items: ['x'] })
  })

  it('warns and preserves values when the field is not an array', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { name: 'Alice' } })

    form.insertFieldValue('name', 0, 'Bob')

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('insertFieldValue')]),
    )
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: false,
      isDirty: false,
    })
  })

  it('warns and leaves values and interaction state unchanged for a negative insertion index', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
    const field = form._getOrCreateFieldApi({ name: 'items' })

    form.insertFieldValue('items', -1, 'x')

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('out of bounds')]),
    )
    expect(form.state).toMatchObject({
      values: { items: ['a', 'b'] },
      isTouched: false,
      isDirty: false,
    })
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
    })
  })

  it('warns and leaves values and interaction state unchanged for an insertion index beyond the array length', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
    const field = form._getOrCreateFieldApi({ name: 'items' })

    form.insertFieldValue('items', 3, 'x')

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('out of bounds')]),
    )
    expect(form.state).toMatchObject({
      values: { items: ['a', 'b'] },
      isTouched: false,
      isDirty: false,
    })
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
    })
  })

  it('inserts values without marking the form touched or dirty when metadata flags are false', () => {
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })

    form.insertFieldValue('items', 1, 'x', {
      markAsTouched: false,
      markAsDirty: false,
      markAsBlurred: false,
    })

    expect(form.state).toMatchObject({
      values: { items: ['a', 'x', 'b'] },
      isTouched: false,
      isDirty: false,
      isPristine: true,
    })
  })
})

describe('InternalFormApi - clearFieldValues', () => {
  it('clears all items, deactivates their fields, and keeps the array field usable', () => {
    const form = new InternalFormApi({
      defaultValues: { items: [{ name: 'Alice' }, { name: 'Bob' }] },
    })
    const arrayField = form._getOrCreateFieldApi({ name: 'items' })
    const name0 = form._getOrCreateFieldApi({ name: 'items[0].name' })
    const name1 = form._getOrCreateFieldApi({ name: 'items[1].name' })

    form.clearFieldValues('items')

    expect(form.state.values).toEqual({ items: [] })
    expect(arrayField.value).toEqual([])
    expect(arrayField.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isBlurred: false,
    })

    name0.handleChange('Ignored old row 0')
    name1.handleChange('Ignored old row 1')

    expect(form.state.values).toEqual({ items: [] })

    // Reuse index 0; its old field must not overwrite the new item.
    arrayField.pushValue({ name: 'Carol' })
    const newItem0 = form._getOrCreateFieldApi({ name: 'items[0]' })
    const newName0 = form._getOrCreateFieldApi({ name: 'items[0].name' })
    const untouchedMeta = { isTouched: false, isDirty: false, isBlurred: false }
    expect(newItem0.meta).toMatchObject(untouchedMeta)
    expect(newName0.meta).toMatchObject(untouchedMeta)
    newName0.handleChange('Caroline')
    name0.handleChange('Ignored old row 0')

    expect(arrayField.value).toEqual([{ name: 'Caroline' }])
    expect(form.state.values).toEqual({ items: [{ name: 'Caroline' }] })
  })

  it('warns and preserves values when the field is not an array', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { name: 'Alice' } })

    form.clearFieldValues('name')

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('clearFieldValues')]),
    )
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: false,
      isDirty: false,
    })
  })

  it('clears values without marking the form touched or dirty when metadata flags are false', () => {
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })

    form.clearFieldValues('items', {
      markAsTouched: false,
      markAsDirty: false,
      markAsBlurred: false,
    })

    expect(form.state).toMatchObject({
      values: { items: [] },
      isTouched: false,
      isDirty: false,
      isPristine: true,
    })
  })
})

describe('InternalFormApi - removeFieldValue', () => {
  it('removes middle, first, and last items while preserving the remaining order', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c', 'd', 'e', 'f'] },
    })

    // Before: 0  1  2  3  4  5
    // After:  0  2  3  4  5
    form.removeFieldValue('items', 1)

    expect(form.state.values).toEqual({ items: ['a', 'c', 'd', 'e', 'f'] })

    // Before: 0  2  3  4  5
    // After:  2  3  4  5
    form.removeFieldValue('items', 0)

    expect(form.state.values).toEqual({ items: ['c', 'd', 'e', 'f'] })

    // Before: 2  3  4  5
    // After:  2  3  4
    form.removeFieldValue('items', 3)

    expect(form.state.values).toEqual({ items: ['c', 'd', 'e'] })
  })

  it('warns and preserves values when the field is not an array', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { name: 'Alice' } })

    form.removeFieldValue('name', 0)

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('removeFieldValue')]),
    )
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: false,
      isDirty: false,
    })
  })

  it('warns and leaves values and interaction state unchanged for a negative removal index', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
    const field = form._getOrCreateFieldApi({ name: 'items' })

    form.removeFieldValue('items', -1)

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('out of bounds')]),
    )
    expect(form.state).toMatchObject({
      values: { items: ['a', 'b'] },
      isTouched: false,
      isDirty: false,
    })
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
    })
  })

  it('warns and leaves values and interaction state unchanged for a removal index outside the array', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
    const field = form._getOrCreateFieldApi({ name: 'items' })

    form.removeFieldValue('items', 2)

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('out of bounds')]),
    )
    expect(form.state).toMatchObject({
      values: { items: ['a', 'b'] },
      isTouched: false,
      isDirty: false,
    })
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
    })
  })

  it('deactivates the removed field and keeps surviving nested fields attached to their items', () => {
    const form = new InternalFormApi({
      defaultValues: {
        items: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }],
      },
    })
    const arrayField = form._getOrCreateFieldApi({ name: 'items' })
    const item0 = form._getOrCreateFieldApi({ name: 'items[0]' })
    const item2 = form._getOrCreateFieldApi({ name: 'items[2]' })
    const name0 = form._getOrCreateFieldApi({ name: 'items[0].name' })
    const name1 = form._getOrCreateFieldApi({ name: 'items[1].name' })
    const name2 = form._getOrCreateFieldApi({ name: 'items[2].name' })

    // Before:    0      1      2
    // After:     0      2
    // Fields:    name0  name2
    form.removeFieldValue('items', 1)

    expect(form.state.values).toEqual({
      items: [{ name: 'Alice' }, { name: 'Carol' }],
    })
    expect(name0.name).toBe('items[0].name')
    expect(name0.value).toBe('Alice')
    expect(name2.name).toBe('items[1].name')
    expect(name2.value).toBe('Carol')

    expect(arrayField.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isBlurred: false,
    })
    const untouchedMeta = { isTouched: false, isDirty: false, isBlurred: false }
    expect(item0.meta).toMatchObject(untouchedMeta)
    expect(name0.meta).toMatchObject(untouchedMeta)
    expect(item2.meta).toMatchObject(untouchedMeta)
    expect(name2.meta).toMatchObject(untouchedMeta)

    name0.handleChange('Alicia')
    name2.handleChange('Caroline')
    name1.handleChange('Ignored removed row')

    expect(form.state.values).toEqual({
      items: [{ name: 'Alicia' }, { name: 'Caroline' }],
    })
  })

  it('applies markAsBlurred only to the array when removing an item', () => {
    const form = new InternalFormApi({
      defaultValues: {
        items: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }],
      },
    })
    const arrayField = form._getOrCreateFieldApi({ name: 'items' })
    const item0 = form._getOrCreateFieldApi({ name: 'items[0]' })
    const item2 = form._getOrCreateFieldApi({ name: 'items[2]' })
    const name0 = form._getOrCreateFieldApi({ name: 'items[0].name' })
    const name2 = form._getOrCreateFieldApi({ name: 'items[2].name' })

    form.removeFieldValue('items', 1, { markAsBlurred: true })

    expect(form.state.values).toEqual({
      items: [{ name: 'Alice' }, { name: 'Carol' }],
    })
    expect(arrayField.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isBlurred: true,
    })
    const untouchedMeta = { isTouched: false, isDirty: false, isBlurred: false }
    expect(item0.meta).toMatchObject(untouchedMeta)
    expect(name0.meta).toMatchObject(untouchedMeta)
    expect(item2.meta).toMatchObject(untouchedMeta)
    expect(name2.meta).toMatchObject(untouchedMeta)
  })

  it('removes values without marking the form touched or dirty when metadata flags are false', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })

    form.removeFieldValue('items', 1, {
      markAsTouched: false,
      markAsDirty: false,
      markAsBlurred: false,
    })

    expect(form.state).toMatchObject({
      values: { items: ['a', 'c'] },
      isTouched: false,
      isDirty: false,
      isPristine: true,
    })
  })
})

describe('InternalFormApi - replaceFieldValue', () => {
  it('replaces items at their indices and keeps existing nested fields usable', () => {
    const form = new InternalFormApi({
      defaultValues: {
        items: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }],
      },
    })
    const arrayField = form._getOrCreateFieldApi({ name: 'items' })
    const item0 = form._getOrCreateFieldApi({ name: 'items[0]' })
    const item1 = form._getOrCreateFieldApi({ name: 'items[1]' })
    const item2 = form._getOrCreateFieldApi({ name: 'items[2]' })
    const name0 = form._getOrCreateFieldApi({ name: 'items[0].name' })
    const name1 = form._getOrCreateFieldApi({ name: 'items[1].name' })
    const name2 = form._getOrCreateFieldApi({ name: 'items[2].name' })

    // Before:    0      1      2
    // After:     0      x      2
    // Fields:    name0  name1  name2
    form.replaceFieldValue('items', 1, { name: 'Dan' })

    expect(form.state).toMatchObject({
      values: {
        items: [{ name: 'Alice' }, { name: 'Dan' }, { name: 'Carol' }],
      },
      isTouched: true,
      isDirty: true,
      isPristine: false,
    })
    expect(arrayField.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isPristine: false,
    })

    form.replaceFieldValue('items', 0, { name: 'Alicia' })

    expect(form.state.values).toEqual({
      items: [{ name: 'Alicia' }, { name: 'Dan' }, { name: 'Carol' }],
    })

    form.replaceFieldValue('items', 2, { name: 'Caroline' })

    expect(form.state.values).toEqual({
      items: [{ name: 'Alicia' }, { name: 'Dan' }, { name: 'Caroline' }],
    })
    expect(name0.name).toBe('items[0].name')
    expect(name0.value).toBe('Alicia')
    expect(name1.name).toBe('items[1].name')
    expect(name1.value).toBe('Dan')
    expect(name2.name).toBe('items[2].name')
    expect(name2.value).toBe('Caroline')

    const untouchedMeta = { isTouched: false, isDirty: false, isBlurred: false }
    expect(item0.meta).toMatchObject(untouchedMeta)
    expect(name0.meta).toMatchObject(untouchedMeta)
    expect(item1.meta).toMatchObject(untouchedMeta)
    expect(name1.meta).toMatchObject(untouchedMeta)
    expect(item2.meta).toMatchObject(untouchedMeta)
    expect(name2.meta).toMatchObject(untouchedMeta)

    name0.handleChange('Alice edited')
    name1.handleChange('Dan edited')
    name2.handleChange('Carol edited')

    expect(form.state.values).toEqual({
      items: [
        { name: 'Alice edited' },
        { name: 'Dan edited' },
        { name: 'Carol edited' },
      ],
    })
  })

  it('warns and preserves values when the field is not an array', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { name: 'Alice' } })

    form.replaceFieldValue('name', 0, 'Bob')

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('replaceFieldValue')]),
    )
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: false,
      isDirty: false,
    })
  })

  it('warns and leaves values and interaction state unchanged for a negative replacement index', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
    const field = form._getOrCreateFieldApi({ name: 'items' })

    form.replaceFieldValue('items', -1, 'x')

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('out of bounds')]),
    )
    expect(form.state).toMatchObject({
      values: { items: ['a', 'b'] },
      isTouched: false,
      isDirty: false,
    })
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
    })
  })

  it('warns and leaves values and interaction state unchanged for a replacement index outside the array', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
    const field = form._getOrCreateFieldApi({ name: 'items' })

    form.replaceFieldValue('items', 2, 'x')

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('out of bounds')]),
    )
    expect(form.state).toMatchObject({
      values: { items: ['a', 'b'] },
      isTouched: false,
      isDirty: false,
    })
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
    })
  })

  it('warns and leaves values and interaction state unchanged for a fractional replacement index', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
    const field = form._getOrCreateFieldApi({ name: 'items' })

    form.replaceFieldValue('items', 0.5, 'x')

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('out of bounds')]),
    )
    expect(form.state).toMatchObject({
      values: { items: ['a', 'b'] },
      isTouched: false,
      isDirty: false,
    })
    expect(field.meta).toMatchObject({
      isTouched: false,
      isDirty: false,
    })
  })

  it('revalidates replaced nested values and preserves errors on other items', async () => {
    const requiredName = ({ value }: { value: string }) =>
      value ? undefined : 'Name is required'
    const form = new InternalFormApi({
      defaultValues: { items: [{ name: '' }, { name: '' }] },
    })
    form._getOrCreateFieldApi({ name: 'items' })._register()
    const name0 = form._getOrCreateFieldApi({
      name: 'items[0].name',
      validators: [{ triggers: ['change'], run: requiredName }],
    })
    const name1 = form._getOrCreateFieldApi({
      name: 'items[1].name',
      validators: [{ triggers: ['change'], run: requiredName }],
    })
    name0._register()
    name1._register()

    name0.handleChange('')
    name1.handleChange('')

    await expect
      .poll(() => name0.errors)
      .toEqual([{ message: 'Name is required' }])
    await expect
      .poll(() => name1.errors)
      .toEqual([{ message: 'Name is required' }])

    form.replaceFieldValue('items', 1, { name: 'Bob' })

    expect(name1.value).toBe('Bob')
    await expect.poll(() => name1.errors).toEqual([])
    expect(name0.errors).toEqual([{ message: 'Name is required' }])

    form.replaceFieldValue('items', 1, { name: '' })

    expect(name1.value).toBe('')
    await expect
      .poll(() => name1.errors)
      .toEqual([{ message: 'Name is required' }])
    expect(name0.errors).toEqual([{ message: 'Name is required' }])
  })

  it('reports and clears array validation errors when replacing an item', async () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b'] },
    })
    const field = form._getOrCreateFieldApi({
      name: 'items',
      validators: [
        {
          triggers: ['change'],
          run: ({ value }: { value: Array<string> }) =>
            value.includes('blocked')
              ? 'Blocked items are not allowed'
              : undefined,
        },
      ],
    })
    field._register()

    form.replaceFieldValue('items', 0, 'blocked')

    expect(field.value).toEqual(['blocked', 'b'])
    await expect
      .poll(() => field.errors)
      .toEqual([{ message: 'Blocked items are not allowed' }])

    form.replaceFieldValue('items', 0, 'a')

    expect(field.value).toEqual(['a', 'b'])
    await expect.poll(() => field.errors).toEqual([])
  })

  it('replaces values without marking the form touched or dirty when metadata flags are false', () => {
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })

    form.replaceFieldValue('items', 1, 'x', {
      markAsTouched: false,
      markAsDirty: false,
      markAsBlurred: false,
    })

    expect(form.state).toMatchObject({
      values: { items: ['a', 'x'] },
      isTouched: false,
      isDirty: false,
      isPristine: true,
    })
  })
})

describe('InternalFormApi - filterFieldValues', () => {
  it('filters objects and keeps only surviving nested fields usable', () => {
    const form = new InternalFormApi({
      defaultValues: {
        items: [
          { name: 'Alice', age: 30 },
          { name: 'Bob', age: 25 },
          { name: 'Carol', age: 35 },
          { name: 'Dan', age: 20 },
        ],
      },
    })
    const arrayField = form._getOrCreateFieldApi({ name: 'items' })
    const item0 = form._getOrCreateFieldApi({ name: 'items[0]' })
    const item2 = form._getOrCreateFieldApi({ name: 'items[2]' })
    const name0 = form._getOrCreateFieldApi({ name: 'items[0].name' })
    const name1 = form._getOrCreateFieldApi({ name: 'items[1].name' })
    const name2 = form._getOrCreateFieldApi({ name: 'items[2].name' })
    const name3 = form._getOrCreateFieldApi({ name: 'items[3].name' })

    // Before:    0      1      2      3
    // After:     0      2
    // Fields:    name0  name2
    form.filterFieldValues(
      'items',
      (person: { age: number }) => person.age > 28,
    )

    expect(form.state.values).toEqual({
      items: [
        { name: 'Alice', age: 30 },
        { name: 'Carol', age: 35 },
      ],
    })
    expect(name0.name).toBe('items[0].name')
    expect(name0.value).toBe('Alice')
    expect(name2.name).toBe('items[1].name')
    expect(name2.value).toBe('Carol')

    expect(arrayField.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isBlurred: false,
    })
    const untouchedMeta = { isTouched: false, isDirty: false, isBlurred: false }
    expect(item0.meta).toMatchObject(untouchedMeta)
    expect(name0.meta).toMatchObject(untouchedMeta)
    expect(item2.meta).toMatchObject(untouchedMeta)
    expect(name2.meta).toMatchObject(untouchedMeta)

    name0.handleChange('Alicia')
    name2.handleChange('Caroline')
    name1.handleChange('Ignored removed row 1')
    name3.handleChange('Ignored removed row 3')

    expect(form.state.values).toEqual({
      items: [
        { name: 'Alicia', age: 30 },
        { name: 'Caroline', age: 35 },
      ],
    })
  })

  it('passes original item indices to the filter predicate', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c', 'd'] },
    })

    // Before: 0  1  2  3
    // After:  0  2
    form.filterFieldValues('items', (_, index) => index % 2 === 0)

    expect(form.state.values).toEqual({ items: ['a', 'c'] })
  })

  it('passes the original array to the filter predicate', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })

    form.filterFieldValues(
      'items',
      // is last
      (_, index, array) => index === array.length - 1,
    )

    expect(form.state.values).toEqual({ items: ['c'] })
  })

  it('uses the supplied thisArg as the filter predicate context', () => {
    // Yeah, this one is mostly just to be the same implementation as
    // a normal array.filter . Who would actually use this? no idea.
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })
    const thisArg = { firstKeptIndex: 1 }

    form.filterFieldValues(
      'items',
      function (this: { firstKeptIndex: number }, _, index) {
        return index >= this.firstKeptIndex
      },
      { thisArg },
    )

    expect(form.state.values).toEqual({ items: ['b', 'c'] })
  })

  it('removes every item when the predicate rejects all items', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })

    form.filterFieldValues('items', () => false)

    expect(form.state.values).toEqual({ items: [] })
  })

  it('keeps every item and marks the field and form touched and dirty', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })
    const field = form._getOrCreateFieldApi({ name: 'items' })

    form.filterFieldValues('items', () => true)

    expect(form.state).toMatchObject({
      values: { items: ['a', 'b', 'c'] },
      isTouched: true,
      isDirty: true,
      isPristine: false,
    })
    expect(field.meta).toMatchObject({
      isTouched: true,
      isDirty: true,
      isPristine: false,
    })
  })

  it('leaves an empty array empty', () => {
    const form = new InternalFormApi({
      defaultValues: { items: [] as Array<string> },
    })

    form.filterFieldValues('items', () => true)

    expect(form.state.values).toEqual({ items: [] })
  })

  it('warns and preserves values when the field is not an array', ({
    onTestFinished,
  }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    onTestFinished(() => warn.mockRestore())
    const form = new InternalFormApi({ defaultValues: { name: 'Alice' } })

    form.filterFieldValues('name', () => true)

    expect(warn.mock.calls).toContainEqual(
      expect.arrayContaining([expect.stringContaining('filterFieldValues')]),
    )
    expect(form.state).toMatchObject({
      values: { name: 'Alice' },
      isTouched: false,
      isDirty: false,
    })
  })

  it('filters values without marking the form touched or dirty when metadata flags are false', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })

    form.filterFieldValues('items', (value) => value !== 'b', {
      markAsTouched: false,
      markAsDirty: false,
      markAsBlurred: false,
    })

    expect(form.state).toMatchObject({
      values: { items: ['a', 'c'] },
      isTouched: false,
      isDirty: false,
      isPristine: true,
    })
  })
})
