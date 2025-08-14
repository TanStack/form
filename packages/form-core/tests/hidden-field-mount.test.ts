import { describe, expect, it } from 'vitest'
import { FieldApi, FormApi } from '../src'

describe('Hidden field mount validation', () => {
  it('should display errors on delayed field mount', async () => {
    const form = new FormApi({
      defaultValues: {
        hiddenField: '',
        visibleField: ''
      },
      validators: {
        onMount: ({ value }) => {
          const errors: Record<string, string> = {}
          if (!value.hiddenField) {
            errors.hiddenField = 'Hidden field is required'
          }
          if (!value.visibleField) {
            errors.visibleField = 'Visible field is required'
          }
          return { fields: errors }
        }
      }
    })
    
    form.mount()
    
    const visibleField = new FieldApi({
      form,
      name: 'visibleField'
    })
    visibleField.mount()
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const hiddenField = new FieldApi({
      form,
      name: 'hiddenField'
    })
    hiddenField.mount()
    
    expect(hiddenField.state.meta.errors).toContain('Hidden field is required')
    
    expect(visibleField.state.meta.errors).toContain('Visible field is required')
  })

  it('should sync errors for multiple delayed fields', async () => {
    const form = new FormApi({
      defaultValues: {
        field1: '',
        field2: '',
        field3: ''
      },
      validators: {
        onMount: () => {
          return {
            fields: {
              field1: 'Field 1 error',
              field2: 'Field 2 error',
              field3: 'Field 3 error'
            }
          }
        }
      }
    })
    
    form.mount()
    
    const field1 = new FieldApi({ form, name: 'field1' })
    field1.mount()
    
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const field2 = new FieldApi({ form, name: 'field2' })
    field2.mount()
    
    await new Promise(resolve => setTimeout(resolve, 50))
    
    const field3 = new FieldApi({ form, name: 'field3' })
    field3.mount()
    
    expect(field1.state.meta.errors).toContain('Field 1 error')
    expect(field2.state.meta.errors).toContain('Field 2 error')
    expect(field3.state.meta.errors).toContain('Field 3 error')
  })

  it('should handle field remount scenarios', () => {
    const form = new FormApi({
      defaultValues: {
        remountField: ''
      },
      validators: {
        onMount: ({ value }) => {
          if (!value.remountField) {
            return { fields: { remountField: 'Remount field is required' } }
          }
          return undefined
        }
      }
    })
    
    form.mount()
    
    const field = new FieldApi({ form, name: 'remountField' })
    const cleanup1 = field.mount()
    
    expect(field.state.meta.errors).toContain('Remount field is required')
    
    cleanup1()
    
    const cleanup2 = field.mount()
    expect(field.state.meta.errors).toContain('Remount field is required')
    
    cleanup2()
  })
})
