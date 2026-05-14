import { describe, expect, it } from 'vitest'
import { InternalFormApi } from '../../src/FormApi.lib'
import { defaultFieldMeta } from '../../src/internals'

describe('form - field meta', () => {
  describe('getFieldMeta', () => {
    it('should retrieve field meta', () => {
      const form = new InternalFormApi({ defaultValues: { name: 'hi' } })

      expect(form.getFieldMeta('name')).toEqual(undefined)

      form.setFieldValue('name', 'bye')
      expect(form.getFieldMeta('name')).toEqual(defaultFieldMeta)
    })
  })
})
