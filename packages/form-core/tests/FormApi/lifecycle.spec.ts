import { describe, expect, it } from 'vitest'
import { InternalFormApi } from '../../src/FormApi.lib'

describe('form - lifecycle', () => {
  describe('initial state', () => {
    it('state.values matches defaultValues', () => {
      const form = new InternalFormApi({
        defaultValues: { name: 'Alice', age: 30 },
      })
      expect(form.state.values).toEqual({ name: 'Alice', age: 30 })
    })

    it('state.isTouched starts as false', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      expect(form.state.isTouched).toBe(false)
    })

    it('supports updating defaultValues after initialization', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      expect(form.state.values).toEqual({ name: '' })
      expect(form.state.isTouched).toBe(false)
      form._update({ defaultValues: { name: 'async' } })

      expect(form.state.isTouched).toBe(false)
      expect(form.state.values).toEqual({ name: 'async' })
    })

    // TODO extend with default state
  })

  describe('reset', () => {
    it('resets form state', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field._register()

      field.handleChange('bye')
      form.reset()
      expect(form.state.values).toEqual({ name: '' })
    })

    it('resets form state and updated default values', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field._register()

      field.handleChange('bye')
      form.reset({ name: 'reset default' })
      expect(form.state.values).toEqual({ name: 'reset default' })
      expect(form.options.defaultValues).toEqual({ name: 'reset default' })
    })

    it('resets form state and does not update default values', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field._register()

      field.handleChange('bye')
      form.reset({ name: 'reset state' }, { preserveDefaultValues: true })
      expect(form.state.values).toEqual({ name: 'reset state' })
      expect(form.options.defaultValues).toEqual({ name: '' })
    })
  })

  // field methods

  describe('resetField', () => {
    it('should reset field', () => {
      const form = new InternalFormApi({ defaultValues: { name: 'hi' } })
      form.setFieldValue('name', 'bye')
      form.resetField('name')

      expect(form.getFieldValue('name')).toEqual('hi')
      expect(form.getFieldMeta('name')).toEqual(undefined)
    })
  })

  describe('deleteField ', () => {
    it('unmounts the field store', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field._register()
      expect(field._isMounted).toBe(true)
      form.deleteField('name', { fieldApiOverride: field })
      expect(field._isMounted).toBe(false)
    })

    it('also unmounts child field stores', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi({ name: 'a' })
      const child = form._getOrCreateFieldApi({ name: 'a.b' })
      void parent.store
      void child.store
      form.deleteField('a', { fieldApiOverride: parent })
      expect(parent._isMounted).toBe(false)
      expect(child._isMounted).toBe(false)
    })
  })
})
