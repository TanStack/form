import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import { createFormGroupApi } from '../../src/FormGroupApi/FormGroupApi.lib'

describe('form group - submission handling', () => {
  it('submits the scoped value without running form validators', async () => {
    const formValidator = vi.fn(() => 'Form error')
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()
    const form = new InternalFormApi({
      defaultValues: {
        step1: { name: 'Alice' },
        step2: { name: '' },
      },
      validators: [{ run: formValidator, triggers: [] }],
      onSubmit,
    })
    const group = createFormGroupApi(form, {
      name: 'step1',
      onGroupSubmit,
    })

    const result = await group.handleSubmit()

    expect(result).toEqual([])
    expect(onGroupSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        value: { name: 'Alice' },
        groupApi: group,
        formApi: form,
      }),
    )
    expect(formValidator).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(form.state.submissionAttempts).toBe(0)
    expect(group.state.submissionAttempts).toBe(1)
    expect(group.state.isSubmitSuccessful).toBe(true)
  })

  it('runs only field validators in the group subtree', async () => {
    const insideValidator = vi.fn(() => 'Inside error')
    const outsideValidator = vi.fn(() => 'Outside error')
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()
    const form = new InternalFormApi({
      defaultValues: {
        step1: { name: '' },
        step2: { name: '' },
      },
    })
    const inside = form._getOrCreateFieldApi({
      name: 'step1.name',
      validators: [{ run: insideValidator, triggers: [] }],
    })
    const outside = form._getOrCreateFieldApi({
      name: 'step2.name',
      validators: [{ run: outsideValidator, triggers: [] }],
    })
    const group = createFormGroupApi(form, {
      name: 'step1',
      onGroupSubmit,
      onGroupSubmitInvalid,
    })

    const result = await group.handleSubmit()

    expect(result).toEqual(['Inside error'])
    expect(insideValidator).toHaveBeenCalledOnce()
    expect(outsideValidator).not.toHaveBeenCalled()
    expect(inside.errors).toEqual([{ message: 'Inside error' }])
    expect(outside.errors).toEqual([])
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(onGroupSubmitInvalid).toHaveBeenCalledOnce()
    expect(group.state.isSubmitSuccessful).toBe(false)
  })

  it('tracks submission state while onGroupSubmit is pending', async () => {
    let finishSubmit!: () => void
    const form = new InternalFormApi({
      defaultValues: { step: { name: 'Alice' } },
    })
    const group = createFormGroupApi(form, {
      name: 'step',
      onGroupSubmit: () =>
        new Promise<void>((resolve) => {
          finishSubmit = resolve
        }),
    })

    const submitPromise = group.handleSubmit()
    await vi.waitFor(() => expect(finishSubmit).toBeTypeOf('function'))

    expect(group.state.isSubmitting).toBe(true)
    expect(group.state.canSubmit).toBe(false)

    finishSubmit()
    await submitPromise

    expect(group.state.isSubmitting).toBe(false)
    expect(group.state.canSubmit).toBe(true)
    expect(group.state.isSubmitSuccessful).toBe(true)
  })

  it('ignores pending group validation results after form reset', async () => {
    let finishValidator!: () => void
    const onGroupSubmit = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { step: { name: '' } },
    })
    const group = createFormGroupApi(form, {
      name: 'step',
      validators: [
        {
          run: () =>
            new Promise<null>((resolve) => {
              finishValidator = () => resolve(null)
            }),
          triggers: [],
        },
      ],
      onGroupSubmit,
    })

    const submitPromise = group.handleSubmit()
    await vi.waitFor(() => expect(finishValidator).toBeTypeOf('function'))

    form.reset({ step: { name: 'Reset' } }, { preserveDefaultValues: true })
    finishValidator()
    const result = await submitPromise

    expect(result).toEqual([])
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(group.state.submissionAttempts).toBe(0)
    expect(group.state.isSubmitting).toBe(false)
    expect(group.errors).toEqual([])
  })
})
