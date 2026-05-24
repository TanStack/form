import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('form - submission handling', () => {
  describe('handleSubmit', () => {
    it('validates with submit trigger', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Submit error' }),
            triggers: [],
          },
        ],
      })
      await form.handleSubmit()
      expect(form.state.formErrors).toEqual([{ message: 'Submit error' }])
    })

    it('returns form validator errors and skips onSubmit', async () => {
      const onSubmit = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Submit error' }),
            triggers: [],
          },
        ],
        onSubmit,
      })

      const result = await form.handleSubmit()

      expect(result).toEqual([{ message: 'Submit error' }])
      expect(form.state.formErrors).toEqual([{ message: 'Submit error' }])
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('returns field validator errors once and skips onSubmit', async () => {
      const onSubmit = vi.fn()
      const fieldValidatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Name is required' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit,
      })
      const field = form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            run: fieldValidatorFn,
            triggers: [],
          },
        ],
      })

      const result = await form.handleSubmit()

      expect(result).toEqual([{ message: 'Name is required' }])
      expect(field.state.meta.errors).toEqual([{ message: 'Name is required' }])
      expect(fieldValidatorFn).toHaveBeenCalledOnce()
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('returns validation errors created during onSubmit', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit: ({ createValidationError }) => {
          return createValidationError('Submission failed')
        },
      })

      const result = await form.handleSubmit()

      expect(result).toEqual([
        expect.objectContaining({ message: 'Submission failed' }),
      ])
      expect(form.state.formErrors).toEqual([
        expect.objectContaining({ message: 'Submission failed' }),
      ])
    })

    it('sets isSubmitSuccessful based on submission outcome', async () => {
      const successfulForm = new InternalFormApi({
        defaultValues: { name: '' },
      })
      await successfulForm.handleSubmit()

      expect(successfulForm.state.isSubmitSuccessful).toBe(true)

      const failingForm = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Submit error' }),
            triggers: [],
          },
        ],
      })
      await failingForm.handleSubmit()

      expect(failingForm.state.isSubmitSuccessful).toBe(false)
    })

    it('sets canSubmit to false while submitting', async () => {
      let finishSubmit!: () => void
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit: () =>
          new Promise<void>((resolve) => {
            finishSubmit = resolve
          }),
      })

      const submitPromise = form.handleSubmit()
      await vi.waitFor(() => {
        expect(finishSubmit).toBeTypeOf('function')
      })

      expect(form.state.canSubmit).toBe(false)

      finishSubmit()
      await submitPromise

      expect(form.state.canSubmit).toBe(true)
    })

    it('ignores field validator results after reset during submit', async () => {
      let finishValidator!: () => void
      const onSubmit = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit,
      })
      form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            run: () =>
              new Promise<null>((resolve) => {
                finishValidator = () => resolve(null)
              }),
            triggers: [],
          },
        ],
      })

      const submitPromise = form.handleSubmit()
      await vi.waitFor(() => {
        expect(finishValidator).toBeTypeOf('function')
      })

      form.reset({ name: 'reset value' }, { preserveDefaultValues: true })
      finishValidator()
      const result = await submitPromise

      expect(result).toEqual([])
      expect(onSubmit).not.toHaveBeenCalled()
      expect(form.state.values).toEqual({ name: 'reset value' })
      expect(form.state.formErrors).toEqual([])
      expect(form.state.isSubmitting).toBe(false)
      expect(form.state.submissionAttempts).toBe(0)
    })

    it('ignores form validator results after reset during submit', async () => {
      let finishValidator!: () => void
      const onSubmit = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () =>
              new Promise<null>((resolve) => {
                finishValidator = () => resolve(null)
              }),
            triggers: [],
          },
        ],
        onSubmit,
      })

      const submitPromise = form.handleSubmit()
      await vi.waitFor(() => {
        expect(finishValidator).toBeTypeOf('function')
      })

      form.reset({ name: 'reset value' }, { preserveDefaultValues: true })
      finishValidator()
      const result = await submitPromise

      expect(result).toEqual([])
      expect(onSubmit).not.toHaveBeenCalled()
      expect(form.state.values).toEqual({ name: 'reset value' })
      expect(form.state.formErrors).toEqual([])
      expect(form.state.isSubmitting).toBe(false)
      expect(form.state.submissionAttempts).toBe(0)
    })

    it('skips onSubmit when a field validator throws during submit', async () => {
      const error = new Error('Field validator failed')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const onSubmit = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit,
      })
      form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            run: () => {
              throw error
            },
            triggers: [],
          },
        ],
      })

      try {
        const result = await form.handleSubmit()

        expect(result).toEqual([])
        expect(onSubmit).not.toHaveBeenCalled()
        expect(form.state.isSubmitting).toBe(false)
        expect(form.state.isSubmitSuccessful).toBe(false)
        expect(consoleSpy).toHaveBeenCalledWith(
          'Validator threw an error:',
          error,
        )
      } finally {
        consoleSpy.mockRestore()
      }
    })

    it('ignores rejected onSubmit errors after reset', async () => {
      let rejectSubmit!: (error: Error) => void
      const error = new Error('Late submit failure')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit: () =>
          new Promise<void>((_, reject) => {
            rejectSubmit = reject
          }),
      })

      try {
        const submitPromise = form.handleSubmit()
        await vi.waitFor(() => {
          expect(rejectSubmit).toBeTypeOf('function')
        })

        form.reset({ name: 'reset value' }, { preserveDefaultValues: true })
        rejectSubmit(error)
        const result = await submitPromise

        expect(result).toEqual([])
        expect(consoleSpy).not.toHaveBeenCalled()
        expect(form.state.values).toEqual({ name: 'reset value' })
        expect(form.state.isSubmitting).toBe(false)
        expect(form.state.submissionAttempts).toBe(0)
      } finally {
        consoleSpy.mockRestore()
      }
    })

    it('logs rejected onSubmit errors and finishes the failed submission', async () => {
      const error = new Error('Submit failed')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit: () => Promise.reject(error),
      })

      try {
        const result = await form.handleSubmit()

        expect(result).toEqual([])
        expect(consoleSpy).toHaveBeenCalledWith(error)
        expect(form.state.isSubmitting).toBe(false)
        expect(form.state.isSubmitSuccessful).toBe(false)
      } finally {
        consoleSpy.mockRestore()
      }
    })

    it('preserves schema output when later non-schema validators run', async () => {
      const onSubmit = vi.fn()
      const schema = z
        .object({
          name: z.string(),
        })
        .transform(({ name }) => ({ nameLength: name.length }))
      const form = new InternalFormApi({
        defaultValues: { name: 'test' },
        validators: [
          {
            run: schema,
            triggers: [],
          },
          {
            run: () => null,
            triggers: [],
          },
        ],
        onSubmit,
      })

      await form.handleSubmit()

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          value: { name: 'test' },
          schemaOutputs: [{ nameLength: 4 }, undefined],
        }),
      )
    })

    it('skips bailIfInvalid form validators when field validators fail first', async () => {
      const formValidatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Should not run' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            bailIfInvalid: true,
            run: formValidatorFn,
            triggers: [],
          },
        ],
      })
      form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            run: () => ({ message: 'Field error' }),
            triggers: [],
          },
        ],
      })

      const result = await form.handleSubmit()

      expect(result).toEqual([{ message: 'Field error' }])
      expect(formValidatorFn).not.toHaveBeenCalled()
    })

    it('skips validators with bailIfInvalid on submit when errors exist', async () => {
      const thirdValidatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Should not run' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'First error' }),
            triggers: [],
          },
          {
            bailIfInvalid: true,
            run: thirdValidatorFn,
            triggers: [],
          },
        ],
      })
      await form.handleSubmit()
      expect(form.state.formErrors).toEqual([{ message: 'First error' }])
      expect(thirdValidatorFn).not.toHaveBeenCalled()
    })

    it('skips all remaining validators after bailIfInvalid on submit when errors exist', async () => {
      const secondValidatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Should not run' }))
      const thirdValidatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Should also not run' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'First error' }),
            triggers: [],
          },
          {
            bailIfInvalid: true,
            run: secondValidatorFn,
            triggers: [],
          },
          {
            run: thirdValidatorFn,
            triggers: [],
          },
        ],
      })
      await form.handleSubmit()
      expect(form.state.formErrors).toEqual([{ message: 'First error' }])
      expect(secondValidatorFn).not.toHaveBeenCalled()
      expect(thirdValidatorFn).not.toHaveBeenCalled()
    })

    it('skips validators with runOnSubmit: false', async () => {
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Should not run' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            runOnSubmit: false,
            run: validatorFn,
            triggers: ['change'],
          },
        ],
      })
      await form.handleSubmit()
      expect(form.state.formErrors).toEqual([])
      expect(validatorFn).not.toHaveBeenCalled()
    })

    it('runs validators with runOnSubmit: true on submit', async () => {
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Submit error' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            runOnSubmit: true,
            run: validatorFn,
            triggers: [],
          },
        ],
      })
      await form.handleSubmit()
      expect(form.state.formErrors).toEqual([{ message: 'Submit error' }])
      expect(validatorFn).toHaveBeenCalled()
    })

    it('runs validators with runOnSubmit: false on their triggers', async () => {
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Change error' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            runOnSubmit: false,
            run: validatorFn,
            triggers: ['change'],
          },
        ],
      })
      await form.validate('change')
      // runOnSubmit: false only affects submit, not the configured triggers
      expect(form.state.formErrors).toEqual([{ message: 'Change error' }])
      expect(validatorFn).toHaveBeenCalled()
    })

    it('skips validators with runOnSubmit: false and no triggers on submit', async () => {
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Should not run' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            runOnSubmit: false,
            run: validatorFn,
            triggers: [],
          },
        ],
      })
      await form.handleSubmit()
      expect(form.state.formErrors).toEqual([])
      expect(validatorFn).not.toHaveBeenCalled()
    })

    it('supports runOnSubmit as a function', async () => {
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Conditional submit error' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            runOnSubmit: ({ formApi }) => formApi.state.values.name === '',
            run: validatorFn,
            triggers: [],
          },
        ],
      })
      await form.handleSubmit()
      expect(form.state.formErrors).toEqual([
        { message: 'Conditional submit error' },
      ])
      expect(validatorFn).toHaveBeenCalled()
    })

    it('returns the same promise when handleSubmit is called multiple times during submission', async () => {
      let resolveValidator!: () => void
      const validatorPromise = new Promise<void>((resolve) => {
        resolveValidator = resolve
      })

      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: async () => {
              await validatorPromise
              return null
            },
            triggers: [],
          },
        ],
      })

      const firstSubmitPromise = form.handleSubmit()

      await vi.waitFor(() => {
        expect(form.state.isSubmitting).toBe(true)
      })

      // Second handleSubmit call while first is still pending
      const secondSubmitPromise = form.handleSubmit()

      expect(firstSubmitPromise).toBe(secondSubmitPromise)

      resolveValidator()

      await firstSubmitPromise
      await secondSubmitPromise

      expect(form.state.isSubmitting).toBe(false)
    })

    it('clears previous field errors when onSubmit returns new field-specific errors', async () => {
      let doErrorA = true

      const form = new InternalFormApi({
        defaultValues: { fieldA: '', fieldB: '' },
        onSubmit: ({ createValidationError }) => {
          if (doErrorA) {
            return createValidationError({
              fields: {
                fieldA: { message: 'Field A error' },
              },
            })
          }
          return createValidationError({
            fields: {
              fieldB: { message: 'Field B error' },
            },
          })
        },
      })

      const fieldA = form._getOrCreateFieldApi({
        name: 'fieldA',
      })
      const fieldB = form._getOrCreateFieldApi({
        name: 'fieldB',
      })

      // First submission - error at fieldA
      await form.handleSubmit()
      expect(fieldA.state.meta.errors).toEqual([{ message: 'Field A error' }])
      expect(fieldB.state.meta.errors).toEqual([])

      doErrorA = false

      // Second submission - error at fieldB, fieldA error should be cleared
      await form.handleSubmit()
      expect(fieldA.state.meta.errors).toEqual([])
      expect(fieldB.state.meta.errors).toEqual([{ message: 'Field B error' }])
    })

    it('routes submit field errors through boundaries', async () => {
      const form = new InternalFormApi({
        defaultValues: { range: { to: '' } },
        onSubmit: ({ createValidationError }) =>
          createValidationError({
            fields: {
              'range.to': { message: 'Submit end date error' },
            },
          }),
      })
      const rangeField = form._getOrCreateFieldApi({
        name: 'range',
        errorBoundary: true,
      })

      await form.handleSubmit()

      expect(rangeField.errors).toEqual([{ message: 'Submit end date error' }])
      expect(form._tryGetFieldApi('range.to')).toBeNull()
    })

    it('clears field errors when onSubmit no longer returns errors', async () => {
      let doError = true

      const form = new InternalFormApi({
        defaultValues: { fieldA: '' },
        onSubmit: ({ createValidationError }) => {
          if (doError) {
            return createValidationError({
              fields: {
                fieldA: { message: 'Field A error' },
              },
            })
          }
          return null
        },
      })

      const fieldA = form._getOrCreateFieldApi({
        name: 'fieldA',
      })

      // First submission - error at fieldA
      await form.handleSubmit()
      expect(fieldA.state.meta.errors).toEqual([{ message: 'Field A error' }])

      doError = false

      // Second submission - error at fieldB, fieldA error should be cleared
      await form.handleSubmit()
      expect(fieldA.state.meta.errors).toEqual([])
    })
  })
})
