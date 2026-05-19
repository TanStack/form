import { describe, expect, it } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('form - field meta', () => {
  describe('getFieldMeta', () => {
    it('should retrieve field meta', () => {
      const form = new InternalFormApi({ defaultValues: { name: 'hi' } })

      expect(form.getFieldMeta('name')).toEqual(undefined)

      form._getOrCreateFieldApi({ name: 'name' })
      form.setFieldValue('name', 'bye')
      expect(form.getFieldMeta('name')).toBeDefined()
    })
  })
})
