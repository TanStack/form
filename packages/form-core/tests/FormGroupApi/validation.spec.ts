import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import { createFormGroupApi } from '../../src/FormGroupApi/FormGroupApi.lib'

describe('form group - validation', () => {
  it('routes field errors to descendants without exposing them as group errors', async () => {
    const form = new InternalFormApi({
      defaultValues: { step: { name: '' } },
    })
    const group = createFormGroupApi(form, {
      name: 'step',
      validators: [
        {
          run: ({ value }) =>
            value.name
              ? null
              : { fields: { name: { message: 'Name is required' } } },
          triggers: [],
        },
      ],
    })

    await group.handleSubmit()

    const nameField = form._tryGetFieldApi('step.name')!
    expect(nameField.errors).toEqual([{ message: 'Name is required' }])
    expect(group.errors).toEqual([])
    expect(group.meta.isInvalid).toBe(true)

    form.setFieldValue('step.name', 'Alice', { causeValidation: false })
    await group.handleSubmit()

    expect(nameField.errors).toEqual([])
    expect(group.errors).toEqual([])
    expect(group.meta.isValid).toBe(true)
  })

  it('validates a Standard Schema against group value and routes its paths', async () => {
    const form = new InternalFormApi({
      defaultValues: { step: { name: '' } },
    })
    const group = createFormGroupApi(form, {
      name: 'step',
      validators: [
        {
          run: z.object({
            name: z.string().min(1, 'Name is required'),
          }),
          triggers: [],
        },
      ],
    })

    await group.handleSubmit()

    expect(form._tryGetFieldApi('step.name')?.errors).toEqual([
      expect.objectContaining({ message: 'Name is required' }),
    ])
    expect(group.errors).toEqual([
      expect.objectContaining({ message: 'Name is required' }),
    ])
    expect(group.meta.isInvalid).toBe(true)
  })

  it('exposes group form errors separately from routed descendant errors', async () => {
    const form = new InternalFormApi({
      defaultValues: { step: { name: '' } },
    })
    const group = createFormGroupApi(form, {
      name: 'step',
      validators: [
        {
          run: () => ({
            form: 'Please address it',
            fields: { name: 'Name is required' },
          }),
          triggers: [],
        },
      ],
    })

    await group.handleSubmit()

    expect(group.errors).toEqual([{ message: 'Please address it' }])
    expect(form._tryGetFieldApi('step.name')?.errors).toEqual([
      { message: 'Name is required' },
    ])
  })

  it('runs registered group validation on change and suppresses form validation', async () => {
    const formValidator = vi.fn(() => 'Form error')
    const groupValidator = vi.fn(({ value }: { value: { name: string } }) =>
      value.name ? null : { fields: { name: 'Group error' } },
    )
    const form = new InternalFormApi({
      defaultValues: { step: { name: 'Alice' } },
      validators: [{ run: formValidator, triggers: ['change'] }],
    })
    const group = createFormGroupApi(form, {
      name: 'step',
      validators: [{ run: groupValidator, triggers: ['change'] }],
    })
    const field = form._getOrCreateFieldApi({ name: 'step.name' })
    const unregister = group._register()

    field.handleChange('')

    await vi.waitFor(() => {
      expect(field.errors).toEqual([{ message: 'Group error' }])
    })
    expect(groupValidator).toHaveBeenCalledOnce()
    expect(formValidator).not.toHaveBeenCalled()
    expect(form.state.formErrors).toEqual([])

    unregister()
  })

  it('suppresses form validation for a registered group without validators', async () => {
    const formValidator = vi.fn(() => 'Form error')
    const form = new InternalFormApi({
      defaultValues: { step: { name: '' } },
      validators: [{ run: formValidator, triggers: ['change'] }],
    })
    const group = createFormGroupApi(form, { name: 'step' })
    const field = form._getOrCreateFieldApi({ name: 'step.name' })
    const unregister = group._register()

    field.handleChange('Alice')
    await Promise.resolve()

    expect(formValidator).not.toHaveBeenCalled()
    expect(form.state.formErrors).toEqual([])

    unregister()
  })
})
