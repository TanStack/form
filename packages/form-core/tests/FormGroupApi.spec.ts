import { describe, expect, it, vi } from 'vitest'
import { FieldApi, FormApi, FormGroupApi } from '../src/index'
import { revalidateLogic } from '../src/ValidationLogic'

describe('form group api', () => {
  it('should allow a submission without submitting the form', async () => {
    const onSubmit = vi.fn()

    const form = new FormApi({
      defaultValues: {
        step1: { name: 'test' },
        step2: { name: 'test2' },
      },
      onSubmit,
    })

    const onGroupSubmit = vi.fn()

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      onGroupSubmit,
    })

    const step1NameField = new FieldApi({
      name: 'step1.name',
      form,
    })

    form.mount()
    step1Group.mount()
    step1NameField.mount()

    await step1Group.handleSubmit()

    expect(onGroupSubmit).toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should handle invalid submissions with form validator', async () => {
    const onSubmit = vi.fn()

    const form = new FormApi({
      defaultValues: {
        step1: { name: 'test' },
        step2: { name: 'test2' },
      },
      onSubmit,
      validators: {
        onSubmit: () => {
          return {
            fields: {
              step1: {
                name: {
                  required: true,
                },
              },
            },
          }
        },
      },
    })

    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      onGroupSubmit,
      onGroupSubmitInvalid,
    })

    const step1NameField = new FieldApi({
      name: 'step1.name',
      form,
    })

    form.mount()
    step1Group.mount()
    step1NameField.mount()

    await step1Group.handleSubmit()

    expect(onGroupSubmitInvalid).toHaveBeenCalled()
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should handle invalid submissions with form validator and throw away other unrelated fields errors', async () => {
    const onSubmit = vi.fn()

    const form = new FormApi({
      defaultValues: {
        step1: { name: 'test' },
        step2: { name: 'test2' },
      },
      onSubmit,
      validators: {
        onSubmit: () => {
          return {
            fields: {
              step1: {
                name: {
                  required: true,
                },
              },
              step2: {
                name: {
                  required: true,
                },
              },
            },
          }
        },
      },
    })

    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      onGroupSubmit,
      onGroupSubmitInvalid,
    })

    const step1NameField = new FieldApi({
      name: 'step1.name',
      form,
    })

    form.mount()
    step1Group.mount()
    step1NameField.mount()

    await step1Group.handleSubmit()

    expect(onGroupSubmitInvalid).toHaveBeenCalled()
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('Should handle validations on form groups themselves', async () => {
    const onSubmit = vi.fn()

    const form = new FormApi({
      defaultValues: {
        step1: { name: '' },
        step2: { name: 'test2' },
      },
      onSubmit,
    })

    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      onGroupSubmit,
      onGroupSubmitInvalid,
      validators: {
        onSubmit: ({ value }) => {
          if (!value.name) {
            return 'Name is required'
          }
          return undefined
        },
      },
    })

    const step1NameField = new FieldApi({
      name: 'step1.name',
      form,
    })

    form.mount()
    step1Group.mount()
    step1NameField.mount()

    await step1Group.handleSubmit()

    expect(onGroupSubmitInvalid).toHaveBeenCalled()
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(step1Group.state.meta.errorMap.onSubmit).toBe('Name is required')
  })
  it('Should handle submit meta args', async () => {
    const onSubmit = vi.fn()

    const form = new FormApi({
      defaultValues: {
        step1: { name: 'test' },
        step2: { name: 'test2' },
      },
      onSubmit,
    })

    const onGroupSubmit = vi.fn()

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      onGroupSubmit,
      onSubmitMeta: {} as { source: string },
    })

    const step1NameField = new FieldApi({
      name: 'step1.name',
      form,
    })

    form.mount()
    step1Group.mount()
    step1NameField.mount()

    await step1Group.handleSubmit({ source: 'button' })

    expect(onGroupSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        value: { name: 'test' },
        meta: { source: 'button' },
      }),
    )
    expect(onSubmit).not.toHaveBeenCalled()
  })
  it.todo('Should handle onXListenTo from fields')
  it.todo('Should handle onXListenTo from other groups')

  it('should re-run validation on subsequent submissions after fixing the value', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    const form = new FormApi({
      defaultValues: {
        step1: { name: '' },
        step2: { name: 'test2' },
      },
      onSubmit,
    })

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      onGroupSubmit,
      onGroupSubmitInvalid,
      validators: {
        onSubmit: ({ value }) => {
          if (!value.name) {
            return 'Name is required'
          }
          return undefined
        },
      },
    })

    const step1NameField = new FieldApi({
      name: 'step1.name',
      form,
    })

    form.mount()
    step1Group.mount()
    step1NameField.mount()

    // First submit fails
    await step1Group.handleSubmit()
    expect(onGroupSubmitInvalid).toHaveBeenCalledTimes(1)
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(step1Group.state.meta.errorMap.onSubmit).toBe('Name is required')

    // Fix the value
    step1NameField.setValue('valid name')

    // Second submit should re-validate and succeed
    await step1Group.handleSubmit()
    expect(onGroupSubmit).toHaveBeenCalledTimes(1)
    expect(onGroupSubmitInvalid).toHaveBeenCalledTimes(1)
    expect(step1Group.state.meta.errorMap.onSubmit).toBeUndefined()
  })

  it('should clear stale group-level onDynamic errors on subsequent group submissions when using revalidateLogic', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    const form = new FormApi({
      defaultValues: {
        step1: { name: '' },
        step2: { name: 'test2' },
      },
      onSubmit,
      validationLogic: revalidateLogic(),
    })

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      onGroupSubmit,
      onGroupSubmitInvalid,
      validators: {
        onDynamic: ({ value }) => {
          if (!value.name) {
            return 'Name is required'
          }
          return undefined
        },
      },
    })

    const step1NameField = new FieldApi({
      name: 'step1.name',
      form,
    })

    form.mount()
    step1Group.mount()
    step1NameField.mount()

    // First submit fails: group-level onDynamic surfaces an error on the group
    await step1Group.handleSubmit()
    expect(onGroupSubmitInvalid).toHaveBeenCalledTimes(1)
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(step1Group.state.meta.errorMap.onDynamic).toBe('Name is required')

    // Fix the value: when revalidateLogic runs the group's own validators it
    // gates on the group's `submissionAttempts` (now > 0), so onDynamic
    // re-runs on `change` and the stale group error clears.
    step1NameField.setValue('valid name')
    expect(step1Group.state.meta.errorMap.onDynamic).toBeUndefined()

    // Second submit should succeed
    await step1Group.handleSubmit()
    expect(onGroupSubmit).toHaveBeenCalledTimes(1)
    expect(onGroupSubmitInvalid).toHaveBeenCalledTimes(1)
  })

  it('group submissions should not bump or affect the parent form-level onDynamic gating', async () => {
    const formDynamic = vi.fn(() => undefined)

    const form = new FormApi({
      defaultValues: { step1: { name: '' } },
      onSubmit: vi.fn(),
      validationLogic: revalidateLogic(),
      validators: {
        onDynamic: formDynamic,
      },
    })

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      onGroupSubmit: vi.fn(),
    })

    const step1NameField = new FieldApi({
      name: 'step1.name',
      form,
    })

    form.mount()
    step1Group.mount()
    step1NameField.mount()

    const initialFormAttempts = form.state.submissionAttempts
    await step1Group.handleSubmit()

    // Group submission must not bump the form's submissionAttempts
    expect(form.state.submissionAttempts).toBe(initialFormAttempts)

    formDynamic.mockClear()

    // Form-level onDynamic is still gated on the form's own submissionAttempts
    // (which is 0), so a `change` event must NOT trigger it.
    step1NameField.setValue('valid name')
    expect(formDynamic).not.toHaveBeenCalled()
  })
})