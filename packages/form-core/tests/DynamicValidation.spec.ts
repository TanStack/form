import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { FieldApi, FormApi } from '../src/index'
import {
  rhfValidationLogic,
  defaultValidationLogic,
} from '../src/ValidationLogic'

describe('custom validation', () => {
  it('should handle default validation logic', async () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validationLogic: defaultValidationLogic,
      validators: {
        onChange: z.object({
          name: z.string().min(3, 'Name must be at least 3 characters long'),
        }),
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.mount()

    expect(field.getValue()).toBe('')
    // onChange validation doesn't run on mount, so errorMap should be empty
    expect(field.state.meta.errorMap.onChange).toBe(undefined)

    // Trigger onChange validation by setting a value
    field.setValue('Jo')
    expect(field.state.meta.errorMap.onChange).toMatchObject([
      { message: 'Name must be at least 3 characters long' },
    ])
    await form.handleSubmit()

    expect(field.state.meta.errorMap.onChange).toMatchObject([
      { message: 'Name must be at least 3 characters long' },
    ])

    field.setValue('Joe123')

    expect(field.state.meta.errorMap.onChange).toBe(undefined)
  })

  it('rhf validation should work as-expected', async () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validationLogic: rhfValidationLogic,
      validators: {
        onDynamic: z.object({
          name: z.string().min(3, 'Name must be at least 3 characters long'),
        }),
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.mount()

    expect(field.getValue()).toBe('')
    expect(field.state.meta.errorMap.onDynamic).toBe(undefined)

    field.setValue('Jo')

    // RHF logic: should not validate on change before first submission
    expect(field.state.meta.errorMap.onDynamic).toBe(undefined)

    await form.handleSubmit()

    // After submit, should show validation error
    expect(field.state.meta.errorMap.onDynamic).toMatchObject([
      { message: 'Name must be at least 3 characters long' },
    ])

    field.setValue('Joe123')

    // After submit, should validate on change and clear error
    expect(field.state.meta.errorMap.onDynamic).toBe(undefined)
  })
})
