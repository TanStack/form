import { describe, expect, it, vi } from 'vitest'
import { FormApi } from '../src/FormApi'

describe('Form reset during submit - meta properties', () => {
  it('should preserve isSubmitting state when reset is called during onSubmit', async () => {
    let isSubmittingDuringReset: boolean | undefined
    let isSubmittingAfterReset: boolean | undefined

    const form = new FormApi({
      defaultValues: {
        checked: true,
      },
      onSubmit: async ({ formApi }) => {
        // Check isSubmitting before reset
        isSubmittingDuringReset = formApi.state.isSubmitting

        // Call reset with new default values
        formApi.reset({ checked: false })

        // Check isSubmitting after reset - it should still be true
        isSubmittingAfterReset = formApi.state.isSubmitting
      },
    })

    form.mount()

    // Simulate user interaction
    form.setFieldValue('checked', false)

    // Submit the form
    await form.handleSubmit()

    // During onSubmit, isSubmitting should remain true even after reset
    expect(isSubmittingDuringReset).toBe(true)
    expect(isSubmittingAfterReset).toBe(true) // This will likely fail with current implementation

    // After submit completes, isSubmitting should be false
    expect(form.state.isSubmitting).toBe(false)
    expect(form.state.isSubmitted).toBe(true)
    expect(form.state.isSubmitSuccessful).toBe(true)
  })

  it('should preserve submissionAttempts when reset is called during onSubmit', async () => {
    let submissionAttemptsDuringReset: number | undefined
    let submissionAttemptsAfterReset: number | undefined

    const form = new FormApi({
      defaultValues: {
        value: 'initial',
      },
      onSubmit: async ({ formApi }) => {
        submissionAttemptsDuringReset = formApi.state.submissionAttempts
        formApi.reset({ value: 'reset' })
        submissionAttemptsAfterReset = formApi.state.submissionAttempts
      },
    })

    form.mount()

    // First submission attempt
    form.setFieldValue('value', 'changed')
    await form.handleSubmit()

    expect(submissionAttemptsDuringReset).toBe(1)
    expect(submissionAttemptsAfterReset).toBe(1) // Should preserve the attempt count
    expect(form.state.submissionAttempts).toBe(1)
  })

  it('should not reset isSubmitted when reset is called during onSubmit', async () => {
    let isSubmittedDuringReset: boolean | undefined

    const form = new FormApi({
      defaultValues: {
        value: 'initial',
      },
      onSubmit: async ({ formApi }) => {
        formApi.reset({ value: 'reset' })
        // isSubmitted should not be affected by reset during submit
        isSubmittedDuringReset = formApi.state.isSubmitted
      },
    })

    form.mount()
    form.setFieldValue('value', 'changed')
    await form.handleSubmit()

    // After handleSubmit completes, isSubmitted should be true
    expect(form.state.isSubmitted).toBe(true)
  })

  it('should handle multiple resets during onSubmit without affecting submission state', async () => {
    const submitStates: Array<{
      isSubmitting: boolean
      submissionAttempts: number
    }> = []

    const form = new FormApi({
      defaultValues: {
        value: 1,
      },
      onSubmit: async ({ formApi }) => {
        // Capture state before first reset
        submitStates.push({
          isSubmitting: formApi.state.isSubmitting,
          submissionAttempts: formApi.state.submissionAttempts,
        })

        formApi.reset({ value: 2 })

        // Capture state after first reset
        submitStates.push({
          isSubmitting: formApi.state.isSubmitting,
          submissionAttempts: formApi.state.submissionAttempts,
        })

        formApi.reset({ value: 3 })

        // Capture state after second reset
        submitStates.push({
          isSubmitting: formApi.state.isSubmitting,
          submissionAttempts: formApi.state.submissionAttempts,
        })
      },
    })

    form.mount()
    form.setFieldValue('value', 10)
    await form.handleSubmit()

    // All states during submission should show isSubmitting: true and submissionAttempts: 1
    expect(submitStates).toEqual([
      { isSubmitting: true, submissionAttempts: 1 },
      { isSubmitting: true, submissionAttempts: 1 },
      { isSubmitting: true, submissionAttempts: 1 },
    ])

    // Final state should be completed
    expect(form.state.isSubmitting).toBe(false)
    expect(form.state.isSubmitted).toBe(true)
    expect(form.state.submissionAttempts).toBe(1)
  })

  it('should reset submission state when reset is called outside of submission', async () => {
    const form = new FormApi({
      defaultValues: {
        value: 'initial',
      },
      onSubmit: async () => {
        // Do nothing during submit
      },
    })

    form.mount()
    form.setFieldValue('value', 'changed')

    // Submit the form first to get submission state
    await form.handleSubmit()

    // Verify submission completed
    expect(form.state.isSubmitted).toBe(true)
    expect(form.state.isSubmitSuccessful).toBe(true)
    expect(form.state.submissionAttempts).toBe(1)

    // Now reset outside of submission - should reset all submission state
    form.reset({ value: 'reset-value' })

    // All submission state should be reset to defaults
    expect(form.state.values.value).toBe('reset-value')
    expect(form.state.isSubmitted).toBe(false)
    expect(form.state.isSubmitSuccessful).toBe(false)
    expect(form.state.submissionAttempts).toBe(0)
    expect(form.state.isSubmitting).toBe(false)
    expect(form.state.isDirty).toBe(false)
  })
})
