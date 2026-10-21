import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('runSubmissionProcess', () => {
  it('applies form and field errors added to a submission error map', async () => {
    const onSubmitInvalid = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      onSubmit: ({ createErrorMap }) => {
        const errors = createErrorMap({ form: 'Initial submit error' })
        errors.form = 'Submission failed'
        errors.fields.name = 'Name is required'
        return errors
      },
      onSubmitInvalid,
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    field._register()

    const result = await form.handleSubmit()

    expect(result).toEqual([
      {
        form: [{ message: 'Submission failed' }],
        fields: { name: [{ message: 'Name is required' }] },
      },
    ])
    expect(form.state.errors).toEqual([{ message: 'Submission failed' }])
    expect(field.errors).toEqual([{ message: 'Name is required' }])
    expect(form.state.isSubmitSuccessful).toBe(false)
    expect(onSubmitInvalid).toHaveBeenCalledWith({
      value: { name: '' },
      formApi: form,
    })
  })

  it('clears previous submission errors and succeeds when the returned map is empty', async () => {
    const onSubmitInvalid = vi.fn()
    let shouldReject = true
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      onSubmit: ({ createErrorMap }) => {
        const errors = createErrorMap()
        if (shouldReject) errors.fields.name = 'Name is required'
        return errors
      },
      onSubmitInvalid,
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    field._register()

    await form.handleSubmit()
    expect(field.errors).toEqual([{ message: 'Name is required' }])
    expect(form.state.isSubmitSuccessful).toBe(false)
    expect(onSubmitInvalid).toHaveBeenCalledOnce()
    onSubmitInvalid.mockClear()

    shouldReject = false
    expect(field.errors).toEqual([{ message: 'Name is required' }])

    const result = await form.handleSubmit()

    expect(result).toEqual([])
    expect(field.errors).toEqual([])
    expect(form.state).toMatchObject({
      errors: [],
      isValid: true,
      isSubmitSuccessful: true,
    })
    expect(onSubmitInvalid).not.toHaveBeenCalled()
  })
})
