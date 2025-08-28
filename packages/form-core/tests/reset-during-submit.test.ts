import { describe, expect, it, vi } from 'vitest'
import { FormApi } from '../src/FormApi'

describe('Form reset during submit', () => {
  it('should correctly reset to new default values when called during onSubmit', async () => {
    const mockOnSubmit = vi.fn()

    const form = new FormApi({
      defaultValues: {
        checked: true,
      },
      onSubmit: async ({ formApi }) => {
        // Call reset with new default values during onSubmit
        formApi.reset({ checked: false })
        mockOnSubmit()
      },
    })

    form.mount()

    // Simulate user interaction: uncheck the checkbox
    form.setFieldValue('checked', false)

    // Verify the form is dirty before submit
    expect(form.state.values.checked).toBe(false)
    expect(form.state.isDirty).toBe(true)

    // Submit the form
    await form.handleSubmit()

    // After reset with new default values, the form should show the new default (false)
    // and should not be dirty anymore
    expect(form.state.values.checked).toBe(false)
    expect(form.state.isDirty).toBe(false)
    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it('should correctly handle isDirty when reset is called with different default values', async () => {
    const form = new FormApi({
      defaultValues: {
        name: 'original',
      },
    })

    form.mount()

    // Change the field value
    form.setFieldValue('name', 'changed')
    expect(form.state.isDirty).toBe(true)

    // Reset with new default values during a simulated submit
    form.reset({ name: 'new-default' })

    // After reset, form should not be dirty and should have the new default
    expect(form.state.values.name).toBe('new-default')
    expect(form.state.isDirty).toBe(false)

    // Now if we change to the old default, it should be dirty
    form.setFieldValue('name', 'original')
    expect(form.state.isDirty).toBe(true)
  })

  it('should work correctly when reset is called multiple times', async () => {
    const form = new FormApi({
      defaultValues: {
        value: 1,
      },
      onSubmit: async ({ formApi }) => {
        // First reset
        formApi.reset({ value: 2 })
        // Second reset
        formApi.reset({ value: 3 })
      },
    })

    form.mount()

    // Change value to make it dirty
    form.setFieldValue('value', 10)
    expect(form.state.isDirty).toBe(true)

    // Submit
    await form.handleSubmit()

    // Should have the final reset value and not be dirty
    expect(form.state.values.value).toBe(3)
    expect(form.state.isDirty).toBe(false)
  })
})
