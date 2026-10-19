import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('InternalFieldApi - _clearEventErrors', () => {
  it('clears submit-only validator errors only for the field that changes', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
    })
    const nameField = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ run: () => 'Name is required', triggers: [] }],
    })
    const emailField = form._getOrCreateFieldApi({
      name: 'email',
      validators: [{ run: () => 'Email is required', triggers: [] }],
    })
    nameField._register()
    emailField._register()

    await form.handleSubmit()
    expect(nameField.errors).toEqual([{ message: 'Name is required' }])
    expect(emailField.errors).toEqual([{ message: 'Email is required' }])

    nameField.handleChange('Alice')
    await expect.poll(() => form.state.isValidating).toBe(false)

    expect(nameField.errors).toEqual([])
    expect(emailField.errors).toEqual([{ message: 'Email is required' }])
    expect(form.state.isValid).toBe(false)
  })

  it('clears submit errors when the field validator only listens for blur', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', email: '' },
    })
    const nameField = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ run: () => 'Name is required', triggers: ['blur'] }],
    })
    const emailField = form._getOrCreateFieldApi({
      name: 'email',
      validators: [{ run: () => 'Email is required', triggers: ['blur'] }],
    })
    nameField._register()
    emailField._register()

    await form.handleSubmit()
    expect(nameField.errors).toEqual([{ message: 'Name is required' }])
    expect(emailField.errors).toEqual([{ message: 'Email is required' }])

    nameField.handleChange('Alice')
    await expect.poll(() => form.state.isValidating).toBe(false)

    expect(nameField.errors).toEqual([])
    expect(emailField.errors).toEqual([{ message: 'Email is required' }])
    expect(form.state.isValid).toBe(false)
  })

  it('preserves errors produced by blur validation when the field changes', async () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ run: () => 'Name is required', triggers: ['blur'] }],
    })
    field._register()

    field.handleBlur()
    await expect.poll(() => form.state.isValidating).toBe(false)
    expect(field.errors).toEqual([{ message: 'Name is required' }])

    field.handleChange('Alice')
    await expect.poll(() => form.state.isValidating).toBe(false)

    expect(field.errors).toEqual([{ message: 'Name is required' }])
  })

  it('replaces submit errors with the result of field change validation', async () => {
    const validator = vi
      .fn()
      .mockReturnValueOnce('Submit field validator failed')
      .mockReturnValue('Change field validator failed')
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [{ run: validator, triggers: ['change'] }],
    })
    field._register()

    await form.handleSubmit()
    expect(field.errors).toEqual([{ message: 'Submit field validator failed' }])
    expect(validator).toHaveBeenLastCalledWith(
      expect.objectContaining({ event: 'submit' }),
    )

    field.handleChange('Alice')
    await expect.poll(() => form.state.isValidating).toBe(false)

    expect(field.errors).toEqual([{ message: 'Change field validator failed' }])
    expect(validator).toHaveBeenLastCalledWith(
      expect.objectContaining({ event: 'change' }),
    )
  })

  it('clears submit errors when field change validation is disabled by its predicate', async () => {
    const validator = vi.fn(() => 'Submit field validator failed')
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      validators: [
        {
          run: validator,
          triggers: [{ trigger: 'change', when: false }],
        },
      ],
    })
    field._register()

    await form.handleSubmit()
    expect(field.errors).toEqual([{ message: 'Submit field validator failed' }])
    validator.mockClear()

    field.handleChange('Alice')
    await expect.poll(() => form.state.isValidating).toBe(false)

    expect(field.errors).toEqual([])
    expect(validator).not.toHaveBeenCalled()
  })
})
