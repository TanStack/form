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

  it('should clear stale form-level onDynamic field errors on subsequent group submissions when using revalidateLogic', async () => {
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
      validators: {
        onDynamic: ({ value }) => {
          const fieldErrors: Record<string, string> = {}
          if (!value.step1.name) {
            fieldErrors['step1.name'] = 'Required'
          }
          return Object.keys(fieldErrors).length
            ? { fields: fieldErrors as never }
            : undefined
        },
      },
    })

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

    // First submit fails: form-level onDynamic propagates error to field
    await step1Group.handleSubmit()
    expect(onGroupSubmitInvalid).toHaveBeenCalledTimes(1)
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(step1NameField.state.meta.errorMap.onDynamic).toBe('Required')

    // Fix the value: revalidateLogic should now run onDynamic on `change`
    // because submissionAttempts > 0, clearing the stale field error.
    step1NameField.setValue('valid name')
    expect(step1NameField.state.meta.errorMap.onDynamic).toBeUndefined()

    // Second submit should succeed
    await step1Group.handleSubmit()
    expect(onGroupSubmit).toHaveBeenCalledTimes(1)
    expect(onGroupSubmitInvalid).toHaveBeenCalledTimes(1)
  })
})