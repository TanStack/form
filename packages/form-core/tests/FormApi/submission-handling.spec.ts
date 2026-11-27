import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import { promiseWithResolvers } from '../test-utils'

describe('form - submission handling', () => {
  describe('handleSubmit', () => {
    it('returns form validator errors and skips onSubmit', async () => {
      const onSubmit = vi.fn()
      const onSubmitInvalid = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Submit error' }),
            triggers: [],
          },
        ],
        onSubmit,
        onSubmitInvalid,
      })

      const result = await form.handleSubmit()

      expect(result).toEqual([{ message: 'Submit error' }])
      expect(form.state.errors).toEqual([{ message: 'Submit error' }])
      expect(onSubmit).not.toHaveBeenCalled()
      expect(onSubmitInvalid).toHaveBeenCalledWith(
        expect.objectContaining({
          value: { name: '' },
          formApi: form,
          reason: 'validation',
          source: 'validators',
        }),
      )
    })

    it('submits successfully when a validator returns an empty error map', async () => {
      const onSubmit = vi.fn()
      const onSubmitInvalid = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ fields: {} }),
            triggers: [],
          },
        ],
        onSubmit,
        onSubmitInvalid,
      })

      const result = await form.handleSubmit()

      expect(result).toEqual([])
      expect(onSubmit).toHaveBeenCalledOnce()
      expect(onSubmitInvalid).not.toHaveBeenCalled()
      expect(form.state.isSubmitSuccessful).toBe(true)
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

    it('allows submit to continue when field validators pass', async () => {
      const onSubmit = vi.fn()
      const fieldValidatorFn = vi.fn(() => null)
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit,
      })
      form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            run: fieldValidatorFn,
            triggers: [],
          },
        ],
      })

      const result = await form.handleSubmit()

      expect(result).toEqual([])
      expect(fieldValidatorFn).toHaveBeenCalledOnce()
      expect(onSubmit).toHaveBeenCalledOnce()
    })

    it('returns validation errors created during onSubmit', async () => {
      const onSubmitInvalid = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit: ({ createValidationError }) => {
          return createValidationError('Submission failed')
        },
        onSubmitInvalid,
      })

      const result = await form.handleSubmit()

      expect(result).toEqual([
        expect.objectContaining({ message: 'Submission failed' }),
      ])
      expect(form.state.errors).toEqual([
        expect.objectContaining({ message: 'Submission failed' }),
      ])
      expect(onSubmitInvalid).toHaveBeenCalledWith(
        expect.objectContaining({
          value: { name: '' },
          formApi: form,
          reason: 'validation',
          source: 'onSubmit',
        }),
      )
    })

    it('awaits onSubmitInvalid before finishing an invalid submission', async () => {
      let finishInvalidSubmit!: () => void
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => 'Submit error',
            triggers: [],
          },
        ],
        onSubmitInvalid: () =>
          new Promise<void>((resolve) => {
            finishInvalidSubmit = resolve
          }),
      })

      const submitPromise = form.handleSubmit()
      await vi.waitFor(() => {
        expect(finishInvalidSubmit).toBeTypeOf('function')
      })

      expect(form.state.isSubmitting).toBe(true)
      expect(form.state.isSubmitSuccessful).toBe(false)

      finishInvalidSubmit()
      await expect(submitPromise).resolves.toEqual([
        { message: 'Submit error' },
      ])
      expect(form.state.isSubmitting).toBe(false)
    })

    it('cleans up when onSubmitInvalid rejects', async () => {
      const error = new Error('Invalid submit handler failed')
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => 'Submit error',
            triggers: [],
          },
        ],
        onSubmitInvalid: () => Promise.reject(error),
      })

      await expect(form.handleSubmit()).rejects.toBe(error)

      expect(form.state.isSubmitting).toBe(false)
      expect(form.state.isSubmitSuccessful).toBe(false)
    })

    it('returns parsed Standard Schema issues created during onSubmit', async () => {
      const schema = z.object({
        name: z.string().min(1, 'Name is required'),
      })
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit: ({ value, parseIssues }) => {
          const result = schema.safeParse(value)

          if (!result.success) {
            return parseIssues(result.error.issues)
          }

          return null
        },
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })

      const result = await form.handleSubmit()

      expect(result).toEqual([
        expect.objectContaining({
          form: [],
          fields: {
            name: [expect.objectContaining({ message: 'Name is required' })],
          },
        }),
      ])
      expect(form.state.errors).toEqual([])
      expect(field.errors).toEqual([
        expect.objectContaining({ message: 'Name is required' }),
      ])

      form.setFieldValue('name', 'Tony', { causeValidation: false })
      await form.handleSubmit()

      expect(form.state.errors).toEqual([])
      expect(field.errors).toEqual([])
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

      form.reset({ name: 'reset value' }, { updateDefaultValues: false })
      finishValidator()
      const result = await submitPromise

      expect(result).toEqual([])
      expect(onSubmit).not.toHaveBeenCalled()
      expect(form.state.values).toEqual({ name: 'reset value' })
      expect(form.state.errors).toEqual([])
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

      form.reset({ name: 'reset value' }, { updateDefaultValues: false })
      finishValidator()
      const result = await submitPromise

      expect(result).toEqual([])
      expect(onSubmit).not.toHaveBeenCalled()
      expect(form.state.values).toEqual({ name: 'reset value' })
      expect(form.state.errors).toEqual([])
      expect(form.state.isSubmitting).toBe(false)
      expect(form.state.submissionAttempts).toBe(0)
    })

    it('rejects a field exception and clears submission state', async () => {
      const error = new Error('Field validator failed')
      const onSubmit = vi.fn()
      const onSubmitInvalid = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit,
        onSubmitInvalid,
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

      await expect(form.handleSubmit()).rejects.toMatchObject({
        errors: [error],
      })
      expect(onSubmit).not.toHaveBeenCalled()
      expect(onSubmitInvalid).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'exception',
          source: 'validators',
          error: expect.objectContaining({ errors: [error] }),
        }),
      )
      expect(form.state.isSubmitting).toBe(false)
      expect(form.state.isSubmitSuccessful).toBe(false)
      expect(form.state.isValidating).toBe(false)
    })

    it('observes deferred field failures while sibling validation settles', async () => {
      const error = new Error('Deferred field failure')
      const failed = promiseWithResolvers<never>()
      const sibling = promiseWithResolvers<null>()
      const onSubmit = vi.fn()
      const onSubmitInvalid = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { first: '', second: '' },
        onSubmit,
        onSubmitInvalid,
      })
      form._getOrCreateFieldApi({
        name: 'first',
        validators: [{ triggers: [], run: () => failed.promise }],
      })
      form._getOrCreateFieldApi({
        name: 'second',
        validators: [{ triggers: [], run: () => sibling.promise }],
      })
      const submit = form.handleSubmit()
      const rejection = expect(submit).rejects.toMatchObject({
        errors: [error],
      })
      failed.reject(error)
      await expect
        .poll(() => form.getFieldMeta('first')?.isValidating)
        .toBe(false)
      expect(form.state.isSubmitting).toBe(true)
      expect(form.state.isValidating).toBe(true)
      sibling.resolve(null)
      await rejection
      expect(form.state.isSubmitting).toBe(false)
      expect(form.state.isSubmitSuccessful).toBe(false)
      expect(form.state.isValidating).toBe(false)
      expect(onSubmit).not.toHaveBeenCalled()
      expect(onSubmitInvalid).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'exception',
          source: 'validators',
          error: expect.objectContaining({ errors: [error] }),
        }),
      )
    })

    it('observes rejected onSubmit errors after reset without changing reset state', async () => {
      const pending = promiseWithResolvers()
      const error = new Error('Late submit failure')
      const onSubmit = vi.fn(() => pending.promise)
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit,
      })

      const submitPromise = form.handleSubmit()
      await vi.waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })

      form.reset({ name: 'reset value' }, { updateDefaultValues: false })
      pending.reject(error)
      await expect(submitPromise).rejects.toBe(error)

      expect(form.state.values).toEqual({ name: 'reset value' })
      expect(form.state.isSubmitting).toBe(false)
      expect(form.state.submissionAttempts).toBe(0)
    })

    it('reports an onSubmit exception and rejects after submission cleanup', async () => {
      const error = new Error('Submit failed')
      const onSubmitInvalid = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        onSubmit: () => Promise.reject(error),
        onSubmitInvalid,
      })

      await expect(form.handleSubmit()).rejects.toBe(error)

      expect(onSubmitInvalid).toHaveBeenCalledWith(
        expect.objectContaining({
          value: { name: '' },
          formApi: form,
          reason: 'exception',
          source: 'onSubmit',
          error,
        }),
      )
      expect(form.state.isSubmitting).toBe(false)
      expect(form.state.isSubmitSuccessful).toBe(false)
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
          validatorOutputs: [{ nameLength: 4 }, undefined],
        }),
      )
    })

    it('clears prior schema output when a dynamic submit predicate skips the validator', async () => {
      let shouldSkipOnSubmit = false
      const onSubmit = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { name: 'test' },
        validators: [
          {
            run: z.object({ name: z.string() }),
            skipOnSubmit: () => shouldSkipOnSubmit,
            triggers: [],
          },
        ],
        onSubmit,
      })

      await form.handleSubmit()
      expect(onSubmit).toHaveBeenLastCalledWith(
        expect.objectContaining({ validatorOutputs: [{ name: 'test' }] }),
      )

      shouldSkipOnSubmit = true
      await form.handleSubmit()

      expect(onSubmit).toHaveBeenLastCalledWith(
        expect.objectContaining({ validatorOutputs: [undefined] }),
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
      expect(form.state.errors).toEqual([{ message: 'First error' }])
      expect(thirdValidatorFn).not.toHaveBeenCalled()
    })

    it('continues unflagged submit validators after an actual bail skip', async () => {
      const secondValidatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Should not run' }))
      const thirdValidatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Unflagged error' }))
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
      expect(form.state.errors).toEqual([
        { message: 'First error' },
        { message: 'Unflagged error' },
      ])
      expect(secondValidatorFn).not.toHaveBeenCalled()
      expect(thirdValidatorFn).toHaveBeenCalledOnce()
    })

    it('skips validators with skipOnSubmit: true', async () => {
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Should not run' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            skipOnSubmit: true,
            run: validatorFn,
            triggers: ['change'],
          },
        ],
      })
      await form.handleSubmit()
      expect(form.state.errors).toEqual([])
      expect(validatorFn).not.toHaveBeenCalled()
    })

    it('runs validators with skipOnSubmit: false on submit', async () => {
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Submit error' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            skipOnSubmit: false,
            run: validatorFn,
            triggers: [],
          },
        ],
      })
      await form.handleSubmit()
      expect(form.state.errors).toEqual([{ message: 'Submit error' }])
      expect(validatorFn).toHaveBeenCalled()
    })

    it('runs validators with skipOnSubmit: true on their triggers', async () => {
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Change error' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            skipOnSubmit: true,
            run: validatorFn,
            triggers: ['change'],
          },
        ],
      })
      await form.validate('change')
      // skipOnSubmit only affects submit, not the configured triggers
      expect(form.state.errors).toEqual([{ message: 'Change error' }])
      expect(validatorFn).toHaveBeenCalled()
    })

    it('skips validators with skipOnSubmit: true and no triggers on submit', async () => {
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Should not run' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            skipOnSubmit: true,
            run: validatorFn,
            triggers: [],
          },
        ],
      })
      await form.handleSubmit()
      expect(form.state.errors).toEqual([])
      expect(validatorFn).not.toHaveBeenCalled()
    })

    it('evaluates skipOnSubmit against the current form values', async () => {
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Conditional submit error' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            skipOnSubmit: ({ formApi }) => formApi.state.values.name !== '',
            run: validatorFn,
            triggers: [],
          },
        ],
      })
      await form.handleSubmit()
      expect(form.state.errors).toEqual([
        { message: 'Conditional submit error' },
      ])
      expect(validatorFn).toHaveBeenCalledOnce()

      form.setFieldValue('name', 'Tony')
      await form.handleSubmit()

      expect(form.state.errors).toEqual([])
      expect(validatorFn).toHaveBeenCalledOnce()
    })

    it('starts a distinct attempt for every handleSubmit call', async () => {
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

      expect(firstSubmitPromise).not.toBe(secondSubmitPromise)

      resolveValidator()

      await firstSubmitPromise
      await secondSubmitPromise

      expect(form.state.isSubmitting).toBe(false)
    })

    it('clears previous field errors when onSubmit returns new field-specific errors', async () => {
      let doErrorA = true

      const form = new InternalFormApi({
        defaultValues: { fieldA: '', fieldB: '' },
        onSubmit: ({ createErrorMap }) => {
          if (doErrorA) {
            return createErrorMap({
              fields: {
                fieldA: { message: 'Field A error' },
              },
            })
          }
          return createErrorMap({
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
        onSubmit: ({ createErrorMap }) =>
          createErrorMap({
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
        onSubmit: ({ createErrorMap }) => {
          if (doError) {
            return createErrorMap({
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
