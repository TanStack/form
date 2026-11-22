import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { z } from 'zod'
import { InternalFormApi, InternalFormGroupApi } from '../src/internals'
import { promiseWithResolvers } from './test-utils'

describe('ValidatorInstance', () => {
  it('replaces mount errors when the same validator runs after a change', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: 'Ada' },
      validators: [
        {
          triggers: ['mount', 'change'],
          run: ({ value }) => `Invalid ${value.name}`,
        },
      ],
    })

    expect(form.state.errors).toEqual([{ message: 'Invalid Ada' }])
    expect(form.state.isValidating).toBe(false)

    form.setFieldValue('name', 'Grace', { causeValidation: false })
    const validating = form.validate('change')

    expect(form.state.errors).toEqual([{ message: 'Invalid Grace' }])
    expect(form.state.isValidating).toBe(false)
    await expect(validating).resolves.toEqual([{ message: 'Invalid Grace' }])
  })

  it('orders errors by validator position when selected validators finish out of order', async () => {
    const pending = promiseWithResolvers<string>()
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        { triggers: ['blur'], run: () => 'Blur error' },
        { triggers: ['change'], run: () => pending.promise },
        { triggers: ['change'], run: () => 'Last error' },
      ],
    })
    onTestFinished(() => form.reset())

    const validating = form.validate('change')

    expect(form.state.errors).toEqual([{ message: 'Last error' }])
    expect(form.state.isValidating).toBe(true)

    pending.resolve('First change error')
    await validating

    expect(form.state.errors).toEqual([
      { message: 'First change error' },
      { message: 'Last error' },
    ])
    expect(form.state.isValidating).toBe(false)
  })

  it('keeps submission outputs in their original positions when a validator is skipped', async () => {
    const onSubmit = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { name: 'Ada' },
      validators: [
        {
          skipOnSubmit: true,
          run: ({ createOutput }) => createOutput('Skipped'),
        },
        {
          run: ({ value, createOutput }) => createOutput(value.name),
        },
        {
          run: ({ createOutput }) => createOutput(undefined),
        },
      ],
      onSubmit,
    })

    await form.handleSubmit()

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        validatorOutputs: [undefined, 'Ada', undefined],
      }),
    )
  })

  it('keeps form schema errors when group schema errors are cleared on group reset', async () => {
    const form = new InternalFormApi({
      defaultValues: { profile: { name: '' } },
      validators: [
        {
          triggers: ['change'],
          run: z.object({
            profile: z
              .object({ name: z.string() })
              .refine(({ name }) => name.length > 0, 'Form error'),
          }),
        },
      ],
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'profile',
      validators: [
        {
          triggers: ['change'],
          run: z
            .object({ name: z.string() })
            .refine(({ name }) => name.length > 0, 'Group error'),
        },
      ],
    })
    onTestFinished(() => group.reset())

    await form.validate('change')
    await group.validate('change')

    expect(group.state.errors).toMatchObject([{ message: 'Group error' }])
    expect(group.state.isInvalid).toBe(true)

    group.reset()

    expect(group.state.errors).toEqual([])
    expect(group.state.isInvalid).toBe(true)

    await group.validate('change')

    expect(group.state.errors).toMatchObject([{ message: 'Group error' }])
  })

  it('clears stored errors on reset and keeps validators available for later validation', async () => {
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['change'],
          run: ({ value }) => (value.name ? undefined : 'Required'),
        },
      ],
    })

    await form.validate('change')

    expect(form.state.errors).toEqual([{ message: 'Required' }])

    form.reset()

    expect(form.state.errors).toEqual([])
    expect(form.state.isInvalid).toBe(false)

    await form.validate('change')

    expect(form.state.errors).toEqual([{ message: 'Required' }])
  })

  it('aborts pending validation on reset and ignores its late result after another validation', async () => {
    vi.useFakeTimers()
    let validatorSignal: AbortSignal | undefined
    const form = new InternalFormApi({
      defaultValues: { name: 'Ada' },
      validators: [
        {
          triggers: ['change'],
          run: ({ signal }) => {
            validatorSignal = signal
            return new Promise<string>((resolve) => {
              setTimeout(() => resolve('Discarded error'), 50)
            })
          },
        },
        { triggers: ['blur'], run: () => 'Current error' },
      ],
    })
    onTestFinished(() => form.reset())

    const validating = form.validate('change')

    expect(validatorSignal?.aborted).toBe(false)
    expect(form.state.isValidating).toBe(true)

    form.reset()

    expect(validatorSignal?.aborted).toBe(true)
    expect(form.state.isValidating).toBe(false)
    await expect(validating).resolves.toEqual([])

    await form.validate('blur')

    expect(form.state.errors).toEqual([{ message: 'Current error' }])

    await vi.advanceTimersByTimeAsync(50)

    expect(form.state.errors).toEqual([{ message: 'Current error' }])
    expect(form.state.isValidating).toBe(false)
  })

  it('cancels debounced validation on reset and allows another debounced run', async () => {
    vi.useFakeTimers()
    const validate = vi.fn(() => 'Required')
    const form = new InternalFormApi({
      defaultValues: { name: '' },
      validators: [
        {
          triggers: ['change'],
          triggerDebounceMs: 50,
          run: validate,
        },
      ],
    })
    onTestFinished(() => form.reset())

    const canceledValidation = form.validate('change')
    await vi.advanceTimersByTimeAsync(25)

    form.reset()

    await expect(canceledValidation).resolves.toEqual([])
    await vi.advanceTimersByTimeAsync(25)

    expect(validate).not.toHaveBeenCalled()
    expect(form.state.errors).toEqual([])
    expect(form.state.isValidating).toBe(false)

    const nextValidation = form.validate('change')
    await vi.advanceTimersByTimeAsync(49)

    expect(validate).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    await expect(nextValidation).resolves.toEqual([{ message: 'Required' }])

    expect(form.state.errors).toEqual([{ message: 'Required' }])
    expect(form.state.isValidating).toBe(false)
  })
})
