import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import { InternalFormGroupApi } from '../../src/FormGroupApi/FormGroupApi.lib'

describe('FormGroupApi', () => {
  it('exposes subtree values and field meta', () => {
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: 'Tony', email: 'tony@example.com' },
        budget: 100,
      },
    })
    const field = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })

    field.handleChange('Tony Hawk')

    expect(group.state.values).toEqual({
      name: 'Tony Hawk',
      email: 'tony@example.com',
    })
    expect(group.state.meta).toMatchObject({ isDirty: true })
  })

  it('submits without calling the root form submit handler or incrementing root attempts', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { guestDetails: { name: 'Tony' } },
      onSubmit,
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      onSubmit: onGroupSubmit,
    })

    await group.handleSubmit()

    expect(onGroupSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(group.state.submissionAttempts).toBe(1)
    expect(form.state.submissionAttempts).toBe(0)
  })

  it('validates descendant fields without validating fields outside the group', async () => {
    const guestValidator = vi.fn(() => 'Guest required')
    const budgetValidator = vi.fn(() => 'Budget required')
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: '' },
        budget: '',
      },
    })
    const guestField = form._getOrCreateFieldApi({
      name: 'guestDetails.name',
      validators: [{ triggers: [], run: guestValidator }],
    })
    const budgetField = form._getOrCreateFieldApi({
      name: 'budget',
      validators: [{ triggers: [], run: budgetValidator }],
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
    })

    await group.handleSubmit()

    expect(guestValidator).toHaveBeenCalledOnce()
    expect(budgetValidator).not.toHaveBeenCalled()
    expect(guestField.errors).toEqual([{ message: 'Guest required' }])
    expect(budgetField.errors).toEqual([])
    expect(group.state.isInvalid).toBe(true)
  })

  it('passes group values to validators and validator predicates', async () => {
    const run = vi.fn(() => null)
    const when = vi.fn(() => true)
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: 'Tony' },
        budget: 100,
      },
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [{ trigger: 'change', when }],
          run,
        },
      ],
    })

    await group.validate('change')

    expect(when).toHaveBeenCalledWith(
      expect.objectContaining({ value: { name: 'Tony' } }),
    )
    expect(run).toHaveBeenCalledWith(
      expect.objectContaining({ value: { name: 'Tony' } }),
    )
  })

  it('captures field-triggered validation inside the group without running root validation', async () => {
    const rootValidator = vi.fn(() => null)
    const groupValidator = vi.fn(() => null)
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: '' },
        budget: '',
      },
      validators: [
        {
          triggers: ['change'],
          run: rootValidator,
        },
      ],
    })
    const guestField = form._getOrCreateFieldApi({
      name: 'guestDetails.name',
    })
    const budgetField = form._getOrCreateFieldApi({
      name: 'budget',
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: ['change'],
          run: groupValidator,
        },
      ],
    })

    guestField.handleChange('Tony')

    await vi.waitFor(() => expect(groupValidator).toHaveBeenCalledOnce())
    expect(rootValidator).not.toHaveBeenCalled()

    budgetField.handleChange('100')

    await vi.waitFor(() => expect(rootValidator).toHaveBeenCalledOnce())

    group._cleanup()
    guestField.handleChange('Tony Hawk')

    await vi.waitFor(() => expect(rootValidator).toHaveBeenCalledTimes(2))
  })

  it('routes Standard Schema errors to descendant fields and clears them on reset', async () => {
    const form = new InternalFormApi({
      defaultValues: {
        guestDetails: { name: '' },
      },
    })
    const nameField = form._getOrCreateFieldApi({ name: 'guestDetails.name' })
    const group = new InternalFormGroupApi({
      form,
      name: 'guestDetails',
      validators: [
        {
          triggers: [],
          run: z.object({
            name: z.string().min(1, 'Name is required'),
          }),
        },
      ],
    })

    await group.handleSubmit()

    expect(nameField.errors).toEqual([
      expect.objectContaining({ message: 'Name is required' }),
    ])
    expect(group.state.isInvalid).toBe(true)

    group.reset()

    expect(nameField.errors).toEqual([])
    expect(group.state.errors).toEqual([])
  })
})
