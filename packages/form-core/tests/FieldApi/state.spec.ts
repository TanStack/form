import { describe, expect, it } from 'vitest'
import { InternalFormApi } from '../../src/FormApi.lib'

describe('field - state', () => {
  describe('handleChange', () => {
    it('updates the field value', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field.handleChange('Alice')
      expect(field.value).toBe('Alice')
    })

    it('accepts an updater function', () => {
      const form = new InternalFormApi({ defaultValues: { count: 1 } })
      const field = form._getOrCreateFieldApi({ name: 'count' })
      field.handleChange((prev: number) => prev + 1)
      expect(field.value).toBe(2)
    })

    it('marks the field as dirty and touched by default', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field.handleChange('Alice')
      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })

    it('respects markAsDirty: false', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field.handleChange('Alice', { markAsDirty: false })
      expect(field.meta.isDirty).toBe(false)
    })

    it('respects markAsTouched: false', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field.handleChange('Alice', { markAsTouched: false })
      expect(field.meta.isTouched).toBe(false)
    })
  })
})
