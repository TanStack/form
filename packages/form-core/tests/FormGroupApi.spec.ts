import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
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

  it('should show onMount errors on form groups', () => {
    const form = new FormApi({
      defaultValues: {
        step1: { name: '' },
        step2: { name: 'test2' },
      },
    })

    const onMount = vi.fn(({ value }) => {
      if (!value.name) {
        return 'Name is required'
      }
      return undefined
    })

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      validators: {
        onMount,
      },
    })

    form.mount()
    step1Group.mount()

    expect(onMount).toHaveBeenCalledTimes(1)
    expect(step1Group.state.meta.errorMap.onMount).toBe('Name is required')
    expect(step1Group.state.meta.errors).toStrictEqual(['Name is required'])
    expect(step1Group.state.meta.isGroupValid).toBe(false)
    expect(step1Group.state.meta.isValid).toBe(false)
    expect(step1Group.state.meta.canSubmit).toBe(false)
  })

  it('should run listener onMount', () => {
    const form = new FormApi({
      defaultValues: {
        step1: { name: 'test' },
        step2: { name: 'test2' },
      },
    })

    const onMount = vi.fn()
    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      listeners: {
        onMount,
      },
    })

    form.mount()
    step1Group.mount()

    expect(onMount).toHaveBeenCalledWith({
      value: { name: 'test' },
      groupApi: step1Group,
    })
  })

  it('should run listener onUnmount', () => {
    const form = new FormApi({
      defaultValues: {
        step1: { name: 'test' },
        step2: { name: 'test2' },
      },
    })

    const onUnmount = vi.fn()
    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      listeners: {
        onUnmount,
      },
    })

    form.mount()
    const unmount = step1Group.mount()
    expect(onUnmount).not.toHaveBeenCalled()

    unmount()

    expect(onUnmount).toHaveBeenCalledWith({
      value: { name: 'test' },
      groupApi: step1Group,
    })
  })

  it('should run form onChangeGroup listener when a child field changes', () => {
    const onChangeGroup = vi.fn()
    const form = new FormApi({
      defaultValues: {
        step1: { name: '' },
        step2: { name: 'test2' },
      },
      listeners: {
        onChangeGroup,
      },
    })

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
    })

    const step1NameField = new FieldApi({
      name: 'step1.name',
      form,
    })

    form.mount()
    step1Group.mount()
    step1NameField.mount()

    step1NameField.handleChange('test')

    expect(onChangeGroup).toHaveBeenCalledWith({
      formApi: form,
      groupApi: step1Group,
    })
  })

  it('should run group onChange listener when a child field changes', () => {
    const form = new FormApi({
      defaultValues: {
        step1: { name: '' },
        step2: { name: 'test2' },
      },
    })

    const onChange = vi.fn()
    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      listeners: {
        onChange,
      },
    })

    const step1NameField = new FieldApi({
      name: 'step1.name',
      form,
    })

    form.mount()
    step1Group.mount()
    step1NameField.mount()

    step1NameField.handleChange('test')

    expect(onChange).toHaveBeenCalledWith({
      value: { name: 'test' },
      groupApi: step1Group,
    })
  })

  it('should debounce form onChange and onChangeGroup listeners independently when a child field changes', async () => {
    vi.useFakeTimers()

    try {
      const onChange = vi.fn()
      const onChangeGroup = vi.fn()
      const form = new FormApi({
        defaultValues: {
          step1: { name: '' },
          step2: { name: 'test2' },
        },
        listeners: {
          onChange,
          onChangeDebounceMs: 100,
          onChangeGroup,
          onChangeGroupDebounceMs: 500,
        },
      })

      const step1Group = new FormGroupApi({
        name: 'step1',
        form,
      })

      const step1NameField = new FieldApi({
        name: 'step1.name',
        form,
      })

      form.mount()
      step1Group.mount()
      step1NameField.mount()

      step1NameField.handleChange('first')
      step1NameField.handleChange('second')

      expect(onChange).not.toHaveBeenCalled()
      expect(onChangeGroup).not.toHaveBeenCalled()

      await vi.advanceTimersByTimeAsync(100)

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith({
        formApi: form,
        fieldApi: step1NameField,
      })
      expect(onChangeGroup).not.toHaveBeenCalled()

      await vi.advanceTimersByTimeAsync(400)

      expect(onChangeGroup).toHaveBeenCalledTimes(1)
      expect(onChangeGroup).toHaveBeenCalledWith({
        formApi: form,
        groupApi: step1Group,
      })
    } finally {
      vi.useRealTimers()
    }
  })

  it('should only run form onChangeGroup when setting a group value', async () => {
    vi.useFakeTimers()

    try {
      const onChange = vi.fn()
      const onChangeGroup = vi.fn()
      const form = new FormApi({
        defaultValues: {
          step1: { name: '' },
          step2: { name: 'test2' },
        },
        listeners: {
          onChange,
          onChangeDebounceMs: 100,
          onChangeGroup,
          onChangeGroupDebounceMs: 100,
        },
      })

      const step1Group = new FormGroupApi({
        name: 'step1',
        form,
      })

      form.mount()
      step1Group.mount()

      step1Group.setValue({ name: 'test' })

      await vi.advanceTimersByTimeAsync(100)

      expect(onChange).not.toHaveBeenCalled()
      expect(onChangeGroup).toHaveBeenCalledTimes(1)
      expect(onChangeGroup).toHaveBeenCalledWith({
        formApi: form,
        groupApi: step1Group,
      })
    } finally {
      vi.useRealTimers()
    }
  })

  it('should stop in-flight async group validation on unmount', async () => {
    vi.useFakeTimers()

    try {
      const form = new FormApi({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      })

      let resolve!: () => void
      const promise = new Promise<void>((r) => {
        resolve = r
      })
      let signal: AbortSignal | undefined

      const step1Group = new FormGroupApi({
        name: 'step1',
        form,
        validators: {
          onChangeAsyncDebounceMs: 0,
          onChangeAsync: async ({ signal: validatorSignal }) => {
            signal = validatorSignal
            await promise
            return 'Name is invalid'
          },
        },
      })

      form.mount()
      const unmount = step1Group.mount()

      const validation = step1Group.validate('change', {
        skipFormValidation: true,
        skipRelatedFieldValidation: true,
      })
      await vi.runAllTimersAsync()

      expect(signal?.aborted).toBe(false)

      unmount()

      expect(signal?.aborted).toBe(true)

      resolve()
      await validation

      expect(step1Group.state.meta.errorMap.onChange).toBeUndefined()
    } finally {
      vi.useRealTimers()
    }
  })

  it('Should propagate onMount field errors from group validators to child fields', () => {
    const form = new FormApi({
      defaultValues: {
        step1: { name: '' },
        step2: { name: 'test2' },
      },
    })

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      validators: {
        onMount: () => {
          return {
            group: 'Group is invalid',
            fields: {
              name: 'Name is required',
            },
          }
        },
      },
    })

    const step1NameField = new FieldApi({
      name: 'step1.name',
      form,
    })

    form.mount()
    step1NameField.mount()
    step1Group.mount()

    expect(step1Group.state.meta.errorMap.onMount).toBe('Group is invalid')
    expect(step1NameField.state.meta.errorMap.onMount).toBe('Name is required')
    expect(step1NameField.state.meta.errorSourceMap.onMount).toBe('form')
    expect(step1Group.state.meta.isFieldsValid).toBe(false)
    expect(step1Group.state.meta.isGroupValid).toBe(false)
    expect(step1Group.state.meta.isValid).toBe(false)
  })

  it('Should propagate manual function field errors from group validators to child fields', async () => {
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
        onSubmit: () => {
          return {
            fields: {
              name: 'Name is required',
            },
          }
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
    expect(step1NameField.state.meta.errorMap.onSubmit).toBe('Name is required')
  })

  it('Should set the group error from a manual { group, fields } validator return', async () => {
    const form = new FormApi({
      defaultValues: {
        step1: { name: '' },
        step2: { name: 'test2' },
      },
    })

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      validators: {
        onSubmit: () => {
          return {
            group: 'Group is invalid',
            fields: {
              name: 'Name is required',
            },
          }
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

    expect(step1Group.state.meta.errorMap.onSubmit).toBe('Group is invalid')
    expect(step1NameField.state.meta.errorMap.onSubmit).toBe('Name is required')
  })

  it('Should not treat a manual { form, fields } return from a group validator as a group-level error', async () => {
    const form = new FormApi({
      defaultValues: {
        step1: { name: '' },
        step2: { name: 'test2' },
      },
    })

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      validators: {
        onSubmit: () => {
          return {
            // `form` is not a supported group key. It should be ignored
            // (rather than surfaced as the group's own error). The
            // `fields` payload should still be distributed normally.
            form: 'Should be ignored',
            fields: {
              name: 'Name is required',
            },
          }
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

    expect(step1Group.state.meta.errorMap.onSubmit).toBeUndefined()
    expect(step1Group.state.meta.errors).toEqual([])
    expect(step1NameField.state.meta.errorMap.onSubmit).toBe('Name is required')
  })

  it('Should propagate standard schema field errors from group validators to child fields', async () => {
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
        onSubmit: z.object({
          name: z.string().min(1, 'Name is required'),
        }),
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
    expect(step1NameField.state.meta.errorMap.onSubmit).toBeDefined()
  })

  it('Should not duplicate field errors when overlapping schemas are attached to both the form and the group', async () => {
    const step1Schema = z.object({
      name: z.string().min(3),
    })
    const formSchema = z.object({
      step1: step1Schema,
      step2: z.object({ name: z.string() }),
    })

    const form = new FormApi({
      defaultValues: {
        step1: { name: '' },
        step2: { name: 'test2' },
      },
      validators: {
        onChange: formSchema,
      },
    })

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      validators: {
        onChange: step1Schema,
      },
    })

    const step1NameField = new FieldApi({
      name: 'step1.name',
      form,
    })

    form.mount()
    step1Group.mount()
    step1NameField.mount()

    step1NameField.handleChange('')

    // Both validators flag the same field with the same issue. Even though
    // each one writes to the field's errorMap independently, only one
    // entry should end up in the field's `errors` array.
    expect(step1NameField.state.meta.errors.length).toBe(1)
    expect(step1NameField.state.meta.errorMap.onChange).toBeDefined()
  })

  it('Should propagate onDynamic field errors from group validators to child fields when revalidateLogic is on the form', async () => {
    const onSubmit = vi.fn()

    const form = new FormApi({
      defaultValues: {
        step1: { name: '' },
        step2: { name: 'test2' },
      },
      onSubmit,
      validationLogic: revalidateLogic(),
    })

    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      onGroupSubmit,
      onGroupSubmitInvalid,
      validators: {
        onDynamic: () => {
          return {
            fields: {
              name: 'Name is required',
            },
          }
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
    expect(step1NameField.state.meta.errorMap.onDynamic).toBe(
      'Name is required',
    )
  })

  it('Should propagate onDynamic field errors from group validators to child fields when revalidateLogic is on the group', async () => {
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

      validationLogic: revalidateLogic(),
      validators: {
        onDynamic: () => {
          return {
            fields: {
              name: 'Name is required',
            },
          }
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
    expect(step1NameField.state.meta.errorMap.onDynamic).toBe(
      'Name is required',
    )
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

  it('group submissions should not bump the parent form-level submissionAttempts', async () => {
    const formDynamic = vi.fn(() => undefined)

    const form = new FormApi({
      defaultValues: { step1: { name: '' }, step2: { name: '' } },
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
    const step2NameField = new FieldApi({
      name: 'step2.name',
      form,
    })

    form.mount()
    step1Group.mount()
    step1NameField.mount()
    step2NameField.mount()

    const initialFormAttempts = form.state.submissionAttempts
    await step1Group.handleSubmit()

    // Group submission must not bump the form's submissionAttempts
    expect(form.state.submissionAttempts).toBe(initialFormAttempts)

    formDynamic.mockClear()

    // A change to a field OUTSIDE any submitted group should still leave
    // the form's onDynamic gated off (since form.submissionAttempts === 0
    // and step2 has not been submitted).
    step2NameField.setValue('valid name')
    expect(formDynamic).not.toHaveBeenCalled()
  })

  it('field changes inside a submitted group re-run the form-level onDynamic with the group as gating context', async () => {
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

    await step1Group.handleSubmit()
    formDynamic.mockClear()

    // After the group has been submitted, a change to a field inside it
    // re-runs the form-level onDynamic gated on the group's
    // submissionAttempts so stale form-level errors stay in sync.
    step1NameField.setValue('valid name')
    expect(formDynamic).toHaveBeenCalled()
  })

  it('repro: field error from form-level onDynamic should clear after group submit + fix', async () => {
    const form = new FormApi({
      defaultValues: {
        step1: { name: '' },
        step2: { name: '' },
      },
      onSubmit: vi.fn(),
      validationLogic: revalidateLogic(),
      validators: {
        onDynamic: z.object({
          step1: z.object({
            name: z.string().min(2, 'Name must be at least 2 characters'),
          }),
          step2: z.object({
            name: z.string().min(3, 'Name must be at least 3 characters'),
          }),
        }),
      },
    })

    const step1Group = new FormGroupApi({
      name: 'step1',
      form,
      onGroupSubmit: vi.fn(),
      onGroupSubmitInvalid: vi.fn(),
      validators: {
        onDynamic: z.object({
          name: z.string().min(2, 'Name must be at least 2 characters'),
        }),
      },
    })

    const step1NameField = new FieldApi({
      name: 'step1.name',
      form,
    })

    form.mount()
    step1Group.mount()
    step1NameField.mount()

    // First submit fails: group surfaces an error and the form-level
    // z.object also propagates a per-field onDynamic error onto the field.
    await step1Group.handleSubmit()
    expect(step1Group.state.meta.errorMap.onDynamic).toBeDefined()
    expect(step1NameField.state.meta.errors.length).toBeGreaterThan(0)

    // Fix the value: both the group AND the field should clear.
    step1NameField.setValue('valid name')
    expect(step1Group.state.meta.errorMap.onDynamic).toBeUndefined()
    expect(step1NameField.state.meta.errors).toEqual([])
  })

  describe('isFieldsValid / isGroupValid / isValid', () => {
    it('should be true on a pristine, valid group', () => {
      const form = new FormApi({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      })

      const step1Group = new FormGroupApi({
        name: 'step1',
        form,
      })

      const step1NameField = new FieldApi({
        name: 'step1.name',
        form,
      })

      form.mount()
      step1Group.mount()
      step1NameField.mount()

      expect(step1Group.state.meta.isFieldsValid).toBe(true)
      expect(step1Group.state.meta.isGroupValid).toBe(true)
      expect(step1Group.state.meta.isValid).toBe(true)
    })

    it('isFieldsValid should be false when a child field has an error, while isGroupValid stays true', async () => {
      const form = new FormApi({
        defaultValues: {
          step1: { name: '' },
          step2: { name: 'test2' },
        },
      })

      const step1Group = new FormGroupApi({
        name: 'step1',
        form,
      })

      const step1NameField = new FieldApi({
        name: 'step1.name',
        form,
        validators: {
          onChange: ({ value }) => (!value ? 'Name is required' : undefined),
        },
      })

      form.mount()
      step1Group.mount()
      step1NameField.mount()

      step1NameField.handleChange('')

      expect(step1NameField.state.meta.errors.length).toBeGreaterThan(0)
      expect(step1Group.state.meta.isFieldsValid).toBe(false)
      expect(step1Group.state.meta.isGroupValid).toBe(true)
      expect(step1Group.state.meta.isValid).toBe(false)
    })

    it('isGroupValid should be false when a group-level validator errors, while isFieldsValid stays true', async () => {
      const form = new FormApi({
        defaultValues: {
          step1: { name: '' },
          step2: { name: 'test2' },
        },
      })

      const step1Group = new FormGroupApi({
        name: 'step1',
        form,
        validators: {
          onSubmit: ({ value }) =>
            !value.name ? 'Name is required' : undefined,
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

      expect(step1Group.state.meta.errorMap.onSubmit).toBe('Name is required')
      expect(step1Group.state.meta.isFieldsValid).toBe(true)
      expect(step1Group.state.meta.isGroupValid).toBe(false)
      expect(step1Group.state.meta.isValid).toBe(false)
    })

    it('isValid should recover to true after fixing both a field-level and group-level error', async () => {
      const form = new FormApi({
        defaultValues: {
          step1: { name: '' },
          step2: { name: 'test2' },
        },
      })

      const step1Group = new FormGroupApi({
        name: 'step1',
        form,
        validators: {
          onSubmit: ({ value }) =>
            !value.name ? 'Name is required' : undefined,
        },
      })

      const step1NameField = new FieldApi({
        name: 'step1.name',
        form,
        validators: {
          onChange: ({ value }) => (!value ? 'Name is required' : undefined),
        },
      })

      form.mount()
      step1Group.mount()
      step1NameField.mount()

      step1NameField.handleChange('')
      await step1Group.handleSubmit()

      // Field error short-circuits the group's own onSubmit, so only the
      // field-level branch is invalid here.
      expect(step1Group.state.meta.isFieldsValid).toBe(false)
      expect(step1Group.state.meta.isValid).toBe(false)

      step1NameField.handleChange('valid name')
      await step1Group.handleSubmit()

      expect(step1Group.state.meta.isFieldsValid).toBe(true)
      expect(step1Group.state.meta.isGroupValid).toBe(true)
      expect(step1Group.state.meta.isValid).toBe(true)
    })
  })
})
