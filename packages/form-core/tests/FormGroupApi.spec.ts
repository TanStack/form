import { describe, expect, it, vi } from 'vitest'
import { FieldApi, FormApi, FormGroupApi } from '../src/index'

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

  it.todo('Should handle validations on form groups themselves')
  it.todo('Should handle submit meta args')
})
