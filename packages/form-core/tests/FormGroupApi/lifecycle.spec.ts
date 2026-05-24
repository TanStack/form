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

    expect(group.value).toEqual({ name: 'Alice' })
    expect(group.meta.isDirty).toBe(true)
    expect(group.meta.isTouched).toBe(true)
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
      errorVisibility: 'submit-attempted',
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
})
