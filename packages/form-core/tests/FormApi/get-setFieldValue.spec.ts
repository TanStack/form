import { describe, expect, it } from 'vitest'
import { InternalFormApi } from '../../src/FormApi.lib'

describe('getFieldValue', () => {
  it('returns a top-level value', () => {
    const form = new InternalFormApi({ defaultValues: { name: 'Alice' } })
    expect(form.getFieldValue('name')).toBe('Alice')
  })

  it('returns a nested value using dot notation', () => {
    const form = new InternalFormApi({
      defaultValues: { address: { city: 'London' } },
    })
    expect(form.getFieldValue('address.city')).toBe('London')
  })

  it('returns an array element using bracket notation', () => {
    const form = new InternalFormApi({
      defaultValues: { items: ['a', 'b', 'c'] },
    })
    expect(form.getFieldValue('items[1]')).toBe('b')
  })

  it('returns undefined for a path that does not exist', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    expect(form.getFieldValue('nonexistent')).toBeUndefined()
  })
})

describe('setFieldValue', () => {
  it('updates a top-level value', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    form.setFieldValue('name', 'Alice')
    expect(form.getFieldValue('name')).toBe('Alice')
  })

  it('updates a nested value without mutating unrelated keys', () => {
    const form = new InternalFormApi({
      defaultValues: { address: { city: 'London', country: 'UK' } },
    })
    form.setFieldValue('address.city', 'Manchester')
    expect(form.getFieldValue('address.city')).toBe('Manchester')
    expect(form.getFieldValue('address.country')).toBe('UK')
  })

  it('accepts an updater function', () => {
    const form = new InternalFormApi({ defaultValues: { count: 1 } })
    form.setFieldValue('count', (prev: number) => prev + 1)
    expect(form.getFieldValue('count')).toBe(2)
  })

  it('marks form isTouched and isDirty after a change', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    form.setFieldValue('name', 'Alice', { fieldApiOverride: field })
    expect(form.state.isTouched).toBe(true)
    expect(form.state.isDirty).toBe(true)
    expect(form.state.isPristine).toBe(false)
  })

  it('does not mark form isTouched when markAsTouched is false', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    form.setFieldValue('name', 'Alice', {
      fieldApiOverride: field,
      markAsTouched: false,
    })
    expect(form.state.isTouched).toBe(false)
  })

  it('does not mark form isDirty when markAsDirty is false', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    form.setFieldValue('name', 'Alice', {
      fieldApiOverride: field,
      markAsDirty: false,
    })
    expect(form.state.isDirty).toBe(false)
    expect(form.state.isPristine).toBe(true)
  })

  it('does not mark the field dirty when markAsDirty is false', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    form.setFieldValue('name', 'Alice', {
      fieldApiOverride: field,
      markAsDirty: false,
    })
    expect(field.meta.isDirty).toBe(false)
  })
})
