import { describe, expect, it } from 'vitest'
import { FieldApi, FormApi } from '../src'

describe('FieldInfo Management for PR #1691', () => {
  describe('Form validation with delayed field mounting', () => {
    it('should auto-create fieldInfo entries for fields with validation errors', async () => {
      const form = new FormApi({
        defaultValues: {
          existingField: '',
          delayedField: '',
        },
        validators: {
          onMount: ({ value }) => {
            const errors: Record<string, string> = {}
            if (!value.existingField) {
              errors.existingField = 'Existing field is required'
            }
            if (!value.delayedField) {
              errors.delayedField = 'Delayed field is required'
            }
            return { fields: errors }
          },
        },
      })

      form.mount()

      const existingField = new FieldApi({
        form,
        name: 'existingField',
      })
      existingField.mount()

      await new Promise((resolve) => setTimeout(resolve, 100))

      expect(form.fieldInfo.delayedField).toBeDefined()
      expect(form.fieldInfo.delayedField.instance).toBeNull()

      const delayedField = new FieldApi({
        form,
        name: 'delayedField',
      })
      delayedField.mount()

      expect(delayedField.state.meta.errors).toContain('Delayed field is required')
    })

    it('should handle multiple delayed fields with different error types', async () => {
      const form = new FormApi({
        defaultValues: {
          field1: '',
          field2: '',
          field3: '',
        },
        validators: {
          onMount: () => {
            return {
              fields: {
                field1: 'Field 1 error',
                field2: 'Field 2 error',
                field3: 'Field 3 error',
              },
            }
          },
        },
      })

      form.mount()

      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(form.fieldInfo.field1).toBeDefined()
      expect(form.fieldInfo.field2).toBeDefined()
      expect(form.fieldInfo.field3).toBeDefined()

      const field1 = new FieldApi({ form, name: 'field1' })
      field1.mount()

      await new Promise((resolve) => setTimeout(resolve, 25))

      const field2 = new FieldApi({ form, name: 'field2' })
      field2.mount()

      await new Promise((resolve) => setTimeout(resolve, 25))

      const field3 = new FieldApi({ form, name: 'field3' })
      field3.mount()

      expect(field1.state.meta.errors).toContain('Field 1 error')
      expect(field2.state.meta.errors).toContain('Field 2 error')
      expect(field3.state.meta.errors).toContain('Field 3 error')
    })
  })

  describe('deleteField functionality', () => {
    it('should remove field from fieldInfo and _allFieldErrors', () => {
      const form = new FormApi({
        defaultValues: {
          fieldToDelete: 'test',
          keepField: 'keep',
        },
        validators: {
          onMount: () => {
            return {
              fields: {
                fieldToDelete: 'Field error',
                keepField: 'Keep field error',
              },
            }
          },
        },
      })

      form.mount()

      const field = new FieldApi({
        form,
        name: 'fieldToDelete',
      })
      field.mount()

      expect(form.fieldInfo.fieldToDelete).toBeDefined()
      expect(form.state._allFieldErrors?.fieldToDelete).toBeDefined()

      form.deleteField('fieldToDelete')

      expect(form.fieldInfo.fieldToDelete).toBeUndefined()
      expect(form.state._allFieldErrors?.fieldToDelete).toBeUndefined()

      expect(form.fieldInfo.keepField).toBeDefined()
      expect(form.state._allFieldErrors?.keepField).toBeDefined()
    })

    it('should remove nested fields when parent is deleted', () => {
      const form = new FormApi({
        defaultValues: {
          parent: {
            child1: 'value1',
            child2: 'value2',
          },
          otherField: 'other',
        },
      })

      form.mount()

      const parentField = new FieldApi({ form, name: 'parent' })
      const child1Field = new FieldApi({ form, name: 'parent.child1' })
      const child2Field = new FieldApi({ form, name: 'parent.child2' })
      const otherField = new FieldApi({ form, name: 'otherField' })

      parentField.mount()
      child1Field.mount()
      child2Field.mount()
      otherField.mount()

      expect(form.fieldInfo.parent).toBeDefined()
      expect(form.fieldInfo['parent.child1']).toBeDefined()
      expect(form.fieldInfo['parent.child2']).toBeDefined()
      expect(form.fieldInfo.otherField).toBeDefined()

      form.deleteField('parent')

      expect(form.fieldInfo.parent).toBeUndefined()
      expect(form.fieldInfo['parent.child1']).toBeUndefined()
      expect(form.fieldInfo['parent.child2']).toBeUndefined()

      expect(form.fieldInfo.otherField).toBeDefined()
    })
  })

  describe('removeValue functionality', () => {
    it('should remove field value and clean up fieldInfo entry', () => {
      const form = new FormApi({
        defaultValues: {
          fieldToRemove: 'initial value',
          keepField: 'keep value',
        },
      })

      form.mount()

      const field = new FieldApi({
        form,
        name: 'fieldToRemove',
      })
      const keepField = new FieldApi({
        form,
        name: 'keepField',
      })
      field.mount()
      keepField.mount()

      expect(form.state.values.fieldToRemove).toBe('initial value')
      expect(form.fieldInfo.fieldToRemove).toBeDefined()

      form.deleteField('fieldToRemove')

      expect(form.state.values.fieldToRemove).toBeUndefined()

      const fieldInfoKeys = Object.keys(form.fieldInfo)
      expect(fieldInfoKeys.includes('fieldToRemove')).toBe(false)

      expect(form.state.values.keepField).toBe('keep value')
      expect(form.fieldInfo.keepField).toBeDefined()
    })

    it('should remove field from _allFieldErrors when deleteField is called', () => {
      const form = new FormApi({
        defaultValues: {
          fieldWithError: '',
          otherField: '',
        },
        validators: {
          onMount: () => {
            return {
              fields: {
                fieldWithError: 'Field error',
                otherField: 'Other error',
              },
            }
          },
        },
      })

      form.mount()

      const field = new FieldApi({
        form,
        name: 'fieldWithError',
      })
      field.mount()

      expect(form.state._allFieldErrors?.fieldWithError).toBeDefined()
      expect(form.state._allFieldErrors?.otherField).toBeDefined()

      form.deleteField('fieldWithError')

      expect(form.state._allFieldErrors?.fieldWithError).toBeUndefined()

      expect(form.state._allFieldErrors?.otherField).toBeDefined()
    })
  })

  describe('Dynamic field management', () => {
    it('should handle dynamic addition and removal of fields', () => {
      const form = new FormApi({
        defaultValues: {
          dynamicFields: [] as string[],
        },
      })

      form.mount()

      form.setFieldValue('dynamicFields', ['field1', 'field2', 'field3'])

      const field1 = new FieldApi({ form, name: 'dynamicFields[0]' })
      const field2 = new FieldApi({ form, name: 'dynamicFields[1]' })
      const field3 = new FieldApi({ form, name: 'dynamicFields[2]' })

      field1.mount()
      field2.mount()
      field3.mount()

      expect(form.fieldInfo['dynamicFields[0]']).toBeDefined()
      expect(form.fieldInfo['dynamicFields[1]']).toBeDefined()
      expect(form.fieldInfo['dynamicFields[2]']).toBeDefined()

      form.deleteField('dynamicFields[1]')
      form.deleteField('dynamicFields[2]')

      const fieldInfoKeys = Object.keys(form.fieldInfo)
      expect(fieldInfoKeys.includes('dynamicFields[1]')).toBe(false)
      expect(fieldInfoKeys.includes('dynamicFields[2]')).toBe(false)

      expect(form.fieldInfo['dynamicFields[0]']).toBeDefined()
    })

    it('should maintain validation state consistency during field lifecycle', async () => {
      const form = new FormApi({
        defaultValues: {
          showField: false,
          conditionalField: '',
        },
        validators: {
          onChange: ({ value }) => {
            if (value.showField && !value.conditionalField) {
              return {
                fields: {
                  conditionalField: 'Conditional field is required when shown',
                },
              }
            }
            return undefined
          },
        },
      })

      form.mount()

      const showFieldApi = new FieldApi({ form, name: 'showField' })
      showFieldApi.mount()

      showFieldApi.setValue(true)

      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(form.fieldInfo.conditionalField).toBeDefined()
      expect(form.state._allFieldErrors?.conditionalField).toBeDefined()

      const conditionalField = new FieldApi({ form, name: 'conditionalField' })
      conditionalField.mount()

      expect(conditionalField.state.meta.errors).toContain(
        'Conditional field is required when shown',
      )

      showFieldApi.setValue(false)

      await new Promise((resolve) => setTimeout(resolve, 50))

      form.deleteField('conditionalField')

      expect(form.fieldInfo.conditionalField).toBeUndefined()
      expect(form.state._allFieldErrors?.conditionalField).toBeUndefined()
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle deleteField on non-existent fields gracefully', () => {
      const form = new FormApi({
        defaultValues: {
          existingField: 'value',
        },
      })

      form.mount()

      expect(() => {
        form.deleteField('nonExistentField' as keyof typeof form.state.values)
      }).not.toThrow()

      expect(form.state.values.existingField).toBe('value')
    })

    it('should handle concurrent field operations correctly', async () => {
      const form = new FormApi({
        defaultValues: {
          field1: 'value1',
          field2: 'value2',
          field3: 'value3',
        },
      })

      form.mount()

      const field1 = new FieldApi({ form, name: 'field1' })
      const field2 = new FieldApi({ form, name: 'field2' })
      const field3 = new FieldApi({ form, name: 'field3' })

      field1.mount()
      field2.mount()
      field3.mount()

      const operations = [
        () => form.deleteField('field1'),
        () => form.deleteField('field2'),
        () => form.setFieldValue('field3', 'new value'),
      ]

      await Promise.all(operations.map((op) => Promise.resolve(op())))

      expect(form.fieldInfo.field1).toBeUndefined()
      expect(form.fieldInfo.field2).toBeUndefined()
      expect(form.fieldInfo.field3).toBeDefined()
      expect(form.state.values.field3).toBe('new value')
    })
  })
})
