import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import { createFormGroupApi } from '../../src/FormGroupApi/FormGroupApi.lib'

describe('form group - lifecycle', () => {
  it('exposes the attached subtree value and aggregate meta', () => {
    const form = new InternalFormApi({
      defaultValues: { step: { name: '' } },
    })
    const group = createFormGroupApi(form, { name: 'step' })
    const field = form._getOrCreateFieldApi({ name: 'step.name' })

    field.handleChange('Alice', { causeValidation: false })

    expect(group.state.values).toEqual({ name: 'Alice' })
    expect(group.meta.isDirty).toBe(true)
    expect(group.meta.isTouched).toBe(true)
    expect(group.state.isValid).toBe(true)
    expect(group.state.isInvalid).toBe(false)
  })

  it('delegates scoped field methods through the group name', () => {
    const form = new InternalFormApi({
      defaultValues: { step: { name: '', names: ['Alice'] } },
    })
    const group = createFormGroupApi(form, { name: 'step' })

    group.setFieldValue('name', 'Bob', { causeValidation: false })
    group.pushFieldValue('names', 'Carol', { causeValidation: false })
    group.swapFieldValues('names', 0, 1, { causeValidation: false })

    expect(group.getFieldValue('name')).toBe('Bob')
    expect(group.state.values).toEqual({
      name: 'Bob',
      names: ['Carol', 'Alice'],
    })
    expect(form.state.values.step).toEqual({
      name: 'Bob',
      names: ['Carol', 'Alice'],
    })

    group.resetField('name')

    expect(form.state.values.step.name).toBe('')
  })

  it('runs group listeners from the backing group field', async () => {
    const listener = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { step: { name: '' } },
    })
    const group = createFormGroupApi(form, {
      name: 'step',
      listeners: [{ triggers: ['change'], run: listener }],
    })
    const unregister = group._register()

    form.setFieldValue('step.name', 'Alice')

    await vi.waitFor(() => {
      expect(listener).toHaveBeenCalledOnce()
    })
    expect(listener.mock.calls[0]![0]).toEqual(
      expect.objectContaining({
        value: { name: 'Alice' },
        fieldApi: form._tryGetFieldApi('step'),
        formApi: form,
      }),
    )

    unregister()
  })

  it('reuses the group instance for a path and updates its options', async () => {
    const firstSubmit = vi.fn()
    const secondSubmit = vi.fn()
    const form = new InternalFormApi({
      defaultValues: { step: { name: '' } },
    })
    const group = createFormGroupApi(form, {
      name: 'step',
      onGroupSubmit: firstSubmit,
    })
    const updated = createFormGroupApi(form, {
      name: 'step',
      onGroupSubmit: secondSubmit,
    })

    await updated.handleSubmit()

    expect(updated).toBe(group)
    expect(firstSubmit).not.toHaveBeenCalled()
    expect(secondSubmit).toHaveBeenCalledOnce()
  })

  it('prunes an unmounted clean group node and reacquires it on remount', async () => {
    const form = new InternalFormApi({
      defaultValues: { step: { name: '' } },
    })
    const group = createFormGroupApi(form, { name: 'step' })
    const unregister = group._register()

    unregister()
    await vi.waitFor(() => {
      expect(form._tryGetFieldApi('step')).toBeNull()
    })

    const unregisterAgain = group._register()

    expect(form._tryGetFieldApi('step')).not.toBeNull()
    expect(group.name).toBe('step')
    unregisterAgain()
  })

  it('does not allow mounted groups with overlapping subtrees', () => {
    const form = new InternalFormApi({
      defaultValues: { step: { nested: { name: '' } } },
    })
    const parentGroup = createFormGroupApi(form, { name: 'step' })
    const nestedGroup = createFormGroupApi(form, {
      name: 'step.nested',
    })
    const unregister = parentGroup._register()

    expect(() => nestedGroup._register()).toThrow()

    unregister()
  })

  it('uses group submission attempts for descendant error visibility', async () => {
    const form = new InternalFormApi({
      defaultValues: { step: { name: '' } },
      errorVisibility: ({ state }) => state.submissionAttempts > 0,
    })
    const group = createFormGroupApi(form, {
      name: 'step',
      validators: [
        {
          run: () => ({ fields: { name: 'Required' }, form: 'Test' }),
          triggers: [],
        },
      ],
    })
    const unregister = group._register()

    await group.handleSubmit()

    expect(form._tryGetFieldApi('step.name')?.errors).toEqual([
      { message: 'Required' },
    ])
    expect(form.state.submissionAttempts).toBe(0)
    expect(group.state.submissionAttempts).toBe(1)

    unregister()
  })

  it('gives group submission state priority for owned descendant fields', async () => {
    const form = new InternalFormApi({
      defaultValues: { step: { name: '' } },
      errorVisibility: ({ state }) => state.submissionAttempts > 0,
      validators: [
        {
          run: () => ({ fields: { 'step.name': 'Required' } }),
          triggers: ['change'],
        },
      ],
    })
    const group = createFormGroupApi(form, { name: 'step' })
    const unregister = group._register()
    const field = form._getOrCreateFieldApi({ name: 'step.name' })

    await form.validate('change')
    await form.handleSubmit()
    expect(form.state.submissionAttempts).toBe(1)
    expect(field.errors).toEqual([])

    await group.handleSubmit()
    expect(field.errors).toEqual([{ message: 'Required' }])

    unregister()
  })
})
