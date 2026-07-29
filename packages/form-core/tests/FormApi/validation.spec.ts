import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('form - validation', () => {
  describe('validate', () => {
    it('returns empty array when no validators are defined', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: undefined,
      })
      const result = await form.validate('submit')
      expect(result).toEqual([])
    })

    it('returns empty array when validators array is empty', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [],
      })
      const result = await form.validate('submit')
      expect(result).toEqual([])
    })

    it('filters out falsy validator results', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'error1' as const }),
            triggers: [],
          },
          {
            run: () => null,
            triggers: [],
          },
          {
            run: () => ({ message: 'error2' as const }),
            triggers: [],
          },
          {
            run: () => undefined,
            triggers: [],
          },
          {
            run: () => false,
            triggers: [],
          },
        ],
      })
      const result = await form.validate('submit')
      expect(result).toEqual([{ message: 'error1' }, { message: 'error2' }])
    })

    it('returns ValidationError objects', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Name is required' }),
            triggers: [],
          },
        ],
      })
      const result = await form.validate('submit')
      expect(result).toEqual([{ message: 'Name is required' }])
    })

    it('stores string validator results as message objects', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => 'Name is required',
            triggers: [],
          },
        ],
      })

      await form.validate('submit')
      expect(form.state.errors).toEqual([{ message: 'Name is required' }])
    })

    it('parses Standard Schema issues from field validators', async () => {
      const schema = z.string().min(1, 'Name is required')
      const form = new InternalFormApi({
        defaultValues: { name: '' },
      })
      const field = form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            run: (context: any) => {
              const result = schema.safeParse(context.value)

              if (!result.success) {
                return context.parseIssues(result.error.issues)
              }

              return null
            },
            triggers: [],
          },
        ],
      })

      await field._runFieldValidation('submit')

      expect(field.errors).toEqual([
        expect.objectContaining({ message: 'Name is required' }),
      ])
    })

    it('parses Standard Schema issues from form validators', async () => {
      const schema = z.object({
        user: z.object({
          name: z.string().min(1, 'Name is required'),
        }),
      })
      const form = new InternalFormApi({
        defaultValues: { user: { name: '' } },
        validators: [
          {
            run: ({ value, parseIssues }) => {
              const result = schema.safeParse(value)

              if (!result.success) {
                return parseIssues(result.error.issues)
              }

              return null
            },
            triggers: [],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'user.name' })

      await form.validate('submit')

      expect(form.state.errors).toEqual([
        expect.objectContaining({ message: 'Name is required' }),
      ])
      expect(field.errors).toEqual([
        expect.objectContaining({ message: 'Name is required' }),
      ])
    })

    it('handles validators returning error arrays', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => [{ message: 'Error 1' }, { message: 'Error 2' }],
            triggers: [],
          },
        ],
      })
      const result = await form.validate('submit')
      expect(result).toEqual([[{ message: 'Error 1' }, { message: 'Error 2' }]])
      expect(form.state.errors).toEqual([
        { message: 'Error 1' },
        { message: 'Error 2' },
      ])
    })

    it('filters out falsy values from mixed validator results', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => null,
            triggers: [],
          },
          {
            run: () => ({ message: 'Valid error' }),
            triggers: [],
          },
          {
            run: () => false,
            triggers: [],
          },
          {
            run: () => undefined,
            triggers: [],
          },
        ],
      })
      const result = await form.validate('submit')
      expect(result).toEqual([{ message: 'Valid error' }])
    })

    it('populates errors', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Form error' }),
            triggers: ['change'],
          },
        ],
      })
      await form.validate('change')
      expect(form.state.errors).toEqual([{ message: 'Form error' }])
    })

    it('can run form validation without storing the result', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Form error' }),
            triggers: [],
          },
        ],
      })

      const result = await form._runFormValidation('submit', {
        onResult: false,
      })

      expect(result.results).toHaveLength(1)
      expect(form.state.errors).toEqual([])
    })

    it('sets canSubmit to false when form errors are present', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Form error' }),
            triggers: ['change'],
          },
        ],
      })

      await form.validate('change')

      expect(form.state.canSubmit).toBe(false)
    })

    it('tracks isValidating while a form validator is pending', async () => {
      vi.useFakeTimers()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            triggers: ['change'],
            run: async () => {
              await new Promise((resolve) => setTimeout(resolve, 100))
              return null
            },
          },
        ],
      })

      const validatePromise = form.validate('change')

      expect(form.state.isValidating).toBe(true)

      await vi.runAllTimersAsync()
      await validatePromise

      expect(form.state.isValidating).toBe(false)
      vi.useRealTimers()
    })

    it('tracks isValidating while a field validator is pending', async () => {
      vi.useFakeTimers()
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            triggers: ['change'],
            run: async () => {
              await new Promise((resolve) => setTimeout(resolve, 100))
              return null
            },
          },
        ],
      })

      const validatePromise = field._runFieldValidation('change')

      expect(form.state.isValidating).toBe(true)

      await vi.runAllTimersAsync()
      await validatePromise

      expect(form.state.isValidating).toBe(false)
      vi.useRealTimers()
    })

    it('maintains validator order with async debounced and sync validators', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            triggerDebounceMs: 100,
            run: () => ({ message: 'Async debounced error' }),
            triggers: ['change'],
          },
          {
            run: () => ({ message: 'Sync error' }),
            triggers: ['change'],
          },
        ],
      })

      // Start validation but don't await
      const validatePromise = form.validate('change')

      // The sync validator should populate errors first
      await vi.waitFor(() => {
        expect(form.state.errors).toContainEqual({
          message: 'Sync error',
        })
      })

      // After debounce, the async validator result should also be in errors
      // The errors should be ordered by validator index
      await validatePromise
      expect(form.state.errors).toEqual([
        { message: 'Async debounced error' },
        { message: 'Sync error' },
      ])
    })

    it('collects all errors from multiple sync validators', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Error 1' }),
            triggers: ['change'],
          },
          {
            run: () => ({ message: 'Error 2' }),
            triggers: ['change'],
          },
          {
            run: () => ({ message: 'Error 3' }),
            triggers: ['change'],
          },
          {
            run: () => ({ message: 'Error 4' }),
            triggers: ['change'],
          },
        ],
      })

      await form.validate('change')
      expect(form.state.errors).toEqual([
        { message: 'Error 1' },
        { message: 'Error 2' },
        { message: 'Error 3' },
        { message: 'Error 4' },
      ])
    })

    it('partially populates errors before debounce completes', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Sync error' }),
            triggers: ['blur'],
          },
          {
            triggerDebounceMs: 100,
            run: () => ({ message: 'Debounced error' }),
            triggers: ['blur'],
          },
        ],
      })

      // Start validation but don't await
      const validatePromise = form.validate('blur')

      // The sync validator should populate errors first
      await vi.waitFor(() => {
        expect(form.state.errors).toContainEqual({
          message: 'Sync error',
        })
      })

      // After debounce, both errors should be present
      await validatePromise
      expect(form.state.errors).toEqual([
        { message: 'Sync error' },
        { message: 'Debounced error' },
      ])
    })

    it('partially populates errors before async validator completes', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Sync error' }),
            triggers: ['blur'],
          },
          {
            // eslint-disable-next-line @typescript-eslint/require-await
            run: async () => ({ message: 'Async error' }),
            triggers: ['blur'],
          },
        ],
      })

      // Start validation but don't await
      const validatePromise = form.validate('blur')

      // The sync validator should populate errors first
      await vi.waitFor(() => {
        expect(form.state.errors).toContainEqual({
          message: 'Sync error',
        })
      })

      // After async completes, both errors should be present
      await validatePromise
      expect(form.state.errors).toEqual([
        { message: 'Sync error' },
        { message: 'Async error' },
      ])
    })

    it('skips validators with bailIfInvalid when errors exist', async () => {
      const thirdValidatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Should not run' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Sync error' }),
            triggers: ['blur'],
          },
          {
            // eslint-disable-next-line @typescript-eslint/require-await
            run: async () => ({ message: 'Async error' }),
            triggers: ['blur'],
          },
          {
            bailIfInvalid: true,
            run: thirdValidatorFn,
            triggers: ['blur'],
          },
        ],
      })

      // Start validation
      await form.validate('blur')

      // First two validators should have populated errors
      expect(form.state.errors).toEqual([
        { message: 'Sync error' },
        { message: 'Async error' },
      ])

      // Third validator should NOT have been called because there were errors from previous validators
      expect(thirdValidatorFn).not.toHaveBeenCalled()
    })

    it('continues bailIfInvalid validators when previous validators passed', async () => {
      const firstValidator = vi.fn(() => null)
      const secondValidator = vi.fn(() => ({ message: 'Second error' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: firstValidator,
            triggers: ['change'],
          },
          {
            bailIfInvalid: true,
            run: secondValidator,
            triggers: ['change'],
          },
        ],
      })

      await form.validate('change')

      expect(firstValidator).toHaveBeenCalledOnce()
      expect(secondValidator).toHaveBeenCalledOnce()
      expect(form.state.errors).toEqual([{ message: 'Second error' }])
    })

    it('skips all remaining validators after bailIfInvalid when errors exist', async () => {
      const thirdValidatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Should not run' }))
      const fourthValidatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Should also not run' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Sync error' }),
            triggers: ['blur'],
          },
          {
            bailIfInvalid: true,
            run: thirdValidatorFn,
            triggers: ['blur'],
          },
          {
            run: fourthValidatorFn,
            triggers: ['blur'],
          },
        ],
      })

      // Start validation
      await form.validate('blur')

      // First validator should have populated errors
      expect(form.state.errors).toEqual([{ message: 'Sync error' }])

      // Third validator (with bailIfInvalid) should NOT have been called
      expect(thirdValidatorFn).not.toHaveBeenCalled()
      // Fourth validator (after bailIfInvalid) should also NOT have been called
      expect(fourthValidatorFn).not.toHaveBeenCalled()
    })

    it('skips bailIfInvalid validators after an earlier validator throws', async () => {
      const error = new Error('validator failed')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const bailedValidator = vi.fn(() => ({ message: 'Should not run' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => {
              throw error
            },
            triggers: ['change'],
          },
          {
            bailIfInvalid: true,
            run: bailedValidator,
            triggers: ['change'],
          },
        ],
      })

      try {
        await form.validate('change')

        expect(bailedValidator).not.toHaveBeenCalled()
        expect(consoleSpy).toHaveBeenCalledWith(
          'Validator threw an error:',
          error,
        )
      } finally {
        consoleSpy.mockRestore()
      }
    })
  })

  describe('runOnMount', () => {
    it('does not run validators during construction by default', () => {
      const validatorFn = vi.fn().mockImplementation(() => 'Mount error')

      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [{ run: validatorFn, triggers: [] }],
      })

      expect(validatorFn).not.toHaveBeenCalled()
      expect(form.state.errors).toEqual([])
    })

    it('does not run validators during construction when runOnMount is false', () => {
      const validatorFn = vi.fn().mockImplementation(() => 'Mount error')

      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [{ run: validatorFn, runOnMount: false, triggers: [] }],
      })

      expect(validatorFn).not.toHaveBeenCalled()
      expect(form.state.errors).toEqual([])
    })

    it('runs validators during construction when runOnMount is true', () => {
      const validatorFn = vi.fn().mockImplementation(() => 'Mount error')

      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [{ run: validatorFn, runOnMount: true, triggers: [] }],
      })

      expect(validatorFn).toHaveBeenCalledOnce()
      expect(form.state.errors).toEqual([{ message: 'Mount error' }])
    })

    it('sets validity state from synchronous mount validation immediately', () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Mount error' }),
            runOnMount: true,
            triggers: [],
          },
        ],
      })

      expect(form.state.errors).toEqual([{ message: 'Mount error' }])
      expect(form.state.isValid).toBe(false)
      expect(form.state.canSubmit).toBe(false)
    })

    it('sets field errors from a synchronous mount error map immediately', () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({
              fields: {
                name: 'Name is required',
              },
            }),
            runOnMount: true,
            triggers: [],
          },
        ],
      })
      const field = form._tryGetFieldApi('name')

      expect(field?.errors).toEqual([{ message: 'Name is required' }])
      expect(form.state.canSubmit).toBe(false)
    })

    it('runs standard schema validators during mount', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: z.object({
              name: z.string().min(1, 'Name is required'),
            }),
            runOnMount: true,
            triggers: [],
          },
        ],
      })

      await vi.waitFor(() => {
        expect(form.state.errors).toEqual([
          expect.objectContaining({ message: 'Name is required' }),
        ])
      })
    })

    it('tracks isValidating while an asynchronous mount validator is pending', async () => {
      vi.useFakeTimers()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            runOnMount: true,
            triggers: [],
            run: async () => {
              await new Promise((resolve) => setTimeout(resolve, 100))
              return 'Async mount error'
            },
          },
        ],
      })

      expect(form.state.isValidating).toBe(true)
      expect(form.state.errors).toEqual([])

      await vi.runAllTimersAsync()

      expect(form.state.isValidating).toBe(false)
      expect(form.state.errors).toEqual([{ message: 'Async mount error' }])
      vi.useRealTimers()
    })

    it('continues mount validation after an async mount validator resolves', async () => {
      let resolve!: (value: null) => void
      const asyncResult = new Promise<null>((res) => {
        resolve = res
      })
      const skippedValidator = vi.fn(() => 'Should not run')
      const secondValidator = vi.fn(() => Promise.resolve('Second mount error'))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            runOnMount: true,
            triggers: [],
            run: () => asyncResult,
          },
          {
            runOnMount: false,
            triggers: [],
            run: skippedValidator,
          },
          {
            runOnMount: true,
            triggers: [],
            run: secondValidator,
          },
        ],
      })

      expect(form.state.isValidating).toBe(true)
      expect(secondValidator).not.toHaveBeenCalled()

      resolve(null)

      await vi.waitFor(() => {
        expect(form.state.isValidating).toBe(false)
        expect(skippedValidator).not.toHaveBeenCalled()
        expect(secondValidator).toHaveBeenCalledOnce()
        expect(form.state.errors).toEqual([{ message: 'Second mount error' }])
      })
    })

    it('respects bailIfInvalid after an async mount validator reports an error', async () => {
      let resolve!: (value: string) => void
      const asyncResult = new Promise<string>((res) => {
        resolve = res
      })
      const bailedValidator = vi.fn(() => 'Should not run')
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            runOnMount: true,
            triggers: [],
            run: () => asyncResult,
          },
          {
            bailIfInvalid: true,
            runOnMount: true,
            triggers: [],
            run: bailedValidator,
          },
        ],
      })

      resolve('Async mount error')

      await vi.waitFor(() => {
        expect(form.state.isValidating).toBe(false)
        expect(form.state.errors).toEqual([{ message: 'Async mount error' }])
      })
      expect(bailedValidator).not.toHaveBeenCalled()
    })

    it('keeps mount validation successful when validators return no errors', () => {
      const validator = vi.fn(() => null)
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            runOnMount: true,
            triggers: [],
            run: validator,
          },
        ],
      })

      expect(validator).toHaveBeenCalledOnce()
      expect(form.state.errors).toEqual([])
      expect(form.state.isValidating).toBe(false)
    })

    it('logs thrown mount validator errors without storing them', () => {
      const error = new Error('Mount validator failed')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      try {
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              runOnMount: true,
              triggers: [],
              run: () => {
                throw error
              },
            },
          ],
        })

        expect(consoleSpy).toHaveBeenCalledWith(error)
        expect(form.state.errors).toEqual([])
      } finally {
        consoleSpy.mockRestore()
      }
    })

    it('skips validators that are not opted into mount before later mount validators', () => {
      const skippedValidator = vi.fn(() => 'Should not run')
      const mountValidator = vi.fn(() => 'Mount error')

      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: skippedValidator,
            runOnMount: false,
            triggers: [],
          },
          {
            run: mountValidator,
            runOnMount: true,
            triggers: [],
          },
        ],
      })

      expect(skippedValidator).not.toHaveBeenCalled()
      expect(mountValidator).toHaveBeenCalledOnce()
      expect(form.state.errors).toEqual([{ message: 'Mount error' }])
    })

    it('ignores triggerDebounceMs for mount validation', () => {
      vi.useFakeTimers()
      const triggerDebounceMs = vi.fn().mockReturnValue(100)
      const validatorFn = vi.fn().mockImplementation(() => 'Mount error')

      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: validatorFn,
            runOnMount: true,
            triggerDebounceMs,
            triggers: ['change'],
          },
        ],
      })

      expect(validatorFn).toHaveBeenCalledOnce()
      expect(triggerDebounceMs).not.toHaveBeenCalled()
      expect(form.state.errors).toEqual([{ message: 'Mount error' }])
      vi.useRealTimers()
    })

    it('does not rerun mount validators when form.mount is called', () => {
      const validatorFn = vi.fn().mockImplementation(() => 'Mount error')
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [{ run: validatorFn, runOnMount: true, triggers: [] }],
      })

      form.mount()

      expect(validatorFn).toHaveBeenCalledOnce()
    })

    it('respects bailIfInvalid among mount validators', () => {
      const secondValidatorFn = vi
        .fn()
        .mockImplementation(() => 'Should not run')
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => 'Mount error',
            runOnMount: true,
            triggers: [],
          },
          {
            bailIfInvalid: true,
            run: secondValidatorFn,
            runOnMount: true,
            triggers: [],
          },
        ],
      })

      expect(form.state.errors).toEqual([{ message: 'Mount error' }])
      expect(secondValidatorFn).not.toHaveBeenCalled()
    })

    it('clears mount errors when a later change would not rerun the validator', () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({
              form: 'Mount form error',
              fields: {
                name: 'Mount field error',
              },
            }),
            runOnMount: true,
            triggers: [],
          },
        ],
      })
      const field = form._tryGetFieldApi('name')

      expect(form.state.errors).toEqual([{ message: 'Mount form error' }])
      expect(field?.errors).toEqual([{ message: 'Mount field error' }])

      form.setFieldValue('name', 'Alice')

      expect(form.state.errors).toEqual([])
      expect(field?.errors).toEqual([])
    })
  })

  describe('causing validations', () => {
    it('runs change validators on value updates', async () => {
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Change error' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: validatorFn,
            triggers: ['change'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      form.setFieldValue('name', 'Alice', { fieldApiOverride: field })
      await vi.waitFor(() => {
        expect(validatorFn).toHaveBeenCalled()
      })
    })

    it('runs only change validators when updating values', async () => {
      const onChangeValidatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Change error' }))
      const onBlurValidatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Blur error' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: onChangeValidatorFn,
            triggers: ['change'],
          },
          {
            run: onBlurValidatorFn,
            triggers: ['blur'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      form.setFieldValue('name', 'Alice', { fieldApiOverride: field })
      await vi.waitFor(() => {
        expect(onChangeValidatorFn).toHaveBeenCalled()
        expect(onBlurValidatorFn).not.toHaveBeenCalled()
      })
    })

    it('skips validators when change trigger is disabled', async () => {
      vi.useFakeTimers()
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Change error' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: validatorFn,
            triggers: [{ trigger: 'change', when: false }],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field.handleChange('Alice')
      await vi.runAllTimersAsync()

      expect(validatorFn).not.toHaveBeenCalled()
    })

    it('skips validation when explicitly disabled per update', async () => {
      vi.useFakeTimers()
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Change error' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: validatorFn,
            triggers: ['change'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field.handleChange('Alice', { causeValidation: false })
      await vi.runAllTimersAsync()

      expect(validatorFn).not.toHaveBeenCalled()
    })

    it('debounces change validators across rapid updates', async () => {
      vi.useFakeTimers()
      const validatorFn = vi
        .fn()
        .mockImplementation(() => ({ message: 'Debounced error' }))
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: validatorFn,
            triggers: ['change'],
            triggerDebounceMs: 100,
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      form.setFieldValue('name', 'A', { fieldApiOverride: field })
      form.setFieldValue('name', 'Al', { fieldApiOverride: field })
      form.setFieldValue('name', 'Ali', { fieldApiOverride: field })
      expect(validatorFn).not.toHaveBeenCalled()
      await vi.advanceTimersByTimeAsync(100)
      expect(validatorFn).toHaveBeenCalledOnce()
    })

    it('discards stale async validation results', async () => {
      vi.useFakeTimers()
      const validatorFn = vi
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ message: 'Stale error' }), 50),
            ),
        )
        .mockImplementationOnce(() =>
          Promise.resolve({ message: 'Current error' }),
        )
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: validatorFn,
            triggers: ['change'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      form.setFieldValue('name', 'A', { fieldApiOverride: field })
      form.setFieldValue('name', 'Alice', { fieldApiOverride: field })
      await vi.runAllTimersAsync()

      expect(validatorFn).toHaveBeenCalledTimes(2)
      expect(form.state.errors).toEqual([{ message: 'Current error' }])
    })
  })

  describe('field error boundaries', () => {
    it('routes descendant schema issues to an opted-in field without creating descendants', async () => {
      const form = new InternalFormApi({
        defaultValues: { range: { from: '', to: '' } },
        validators: [
          {
            run: z.object({
              range: z.object({
                from: z.string().min(1, 'Start date is required'),
                to: z.string().min(1, 'End date is required'),
              }),
            }),
            triggers: ['change'],
          },
        ],
      })
      const rangeField = form._getOrCreateFieldApi({
        name: 'range',
        errorBoundary: true,
      })

      await form.validate('change')

      expect(rangeField.errors).toEqual([
        expect.objectContaining({ message: 'Start date is required' }),
        expect.objectContaining({ message: 'End date is required' }),
      ])
      expect(form.state.errors).toHaveLength(2)
      expect(form._tryGetFieldApi('range.from')).toBeNull()
      expect(form._tryGetFieldApi('range.to')).toBeNull()
    })

    it('routes schema issues to the nearest configured boundary', async () => {
      const form = new InternalFormApi({
        defaultValues: { section: { range: { to: '' } } },
        validators: [
          {
            run: z.object({
              section: z.object({
                range: z.object({
                  to: z.string().min(1, 'End date is required'),
                }),
              }),
            }),
            triggers: ['change'],
          },
        ],
      })
      const sectionField = form._getOrCreateFieldApi({
        name: 'section',
        errorBoundary: true,
      })
      const rangeField = form._getOrCreateFieldApi({
        name: 'section.range',
        errorBoundary: true,
      })

      await form.validate('change')

      expect(sectionField.errors).toEqual([])
      expect(rangeField.errors).toEqual([
        expect.objectContaining({ message: 'End date is required' }),
      ])
      expect(form._tryGetFieldApi('section.range.to')).toBeNull()
    })

    it('leaves exact schema paths unchanged without a boundary', async () => {
      const form = new InternalFormApi({
        defaultValues: { range: { to: '' } },
        validators: [
          {
            run: z.object({
              range: z.object({
                to: z.string().min(1, 'End date is required'),
              }),
            }),
            triggers: ['change'],
          },
        ],
      })
      const rangeField = form._getOrCreateFieldApi({ name: 'range' })

      await form.validate('change')

      expect(rangeField.errors).toEqual([])
      expect(form._tryGetFieldApi('range.to')?.errors).toEqual([
        expect.objectContaining({ message: 'End date is required' }),
      ])
    })

    it('clears errors from a boundary when a schema result becomes valid', async () => {
      const form = new InternalFormApi({
        defaultValues: { range: { to: '' } },
        validators: [
          {
            run: z.object({
              range: z.object({
                to: z.string().min(1, 'End date is required'),
              }),
            }),
            triggers: ['change'],
          },
        ],
      })
      const rangeField = form._getOrCreateFieldApi({
        name: 'range',
        errorBoundary: true,
      })

      await form.validate('change')
      expect(rangeField.errors).toHaveLength(1)

      rangeField.handleChange({ to: '2026-05-24' }, { causeValidation: false })
      await form.validate('change')

      expect(rangeField.errors).toEqual([])
    })

    it('routes and combines explicit field error targets through a boundary', async () => {
      const form = new InternalFormApi({
        defaultValues: { range: { from: '', to: '' } },
        validators: [
          {
            run: () => ({
              fields: {
                'range.from': { message: 'Explicit start date error' },
                'range.to': { message: 'Explicit end date error' },
              },
            }),
            triggers: ['change'],
          },
        ],
      })
      const rangeField = form._getOrCreateFieldApi({
        name: 'range',
        errorBoundary: true,
      })

      await form.validate('change')

      expect(rangeField.errors).toEqual([
        { message: 'Explicit start date error' },
        { message: 'Explicit end date error' },
      ])
      expect(form._tryGetFieldApi('range.from')).toBeNull()
      expect(form._tryGetFieldApi('range.to')).toBeNull()
    })

    it('clears explicit boundary errors when an error map becomes empty', async () => {
      let hasError = true
      const form = new InternalFormApi({
        defaultValues: { range: { to: '' } },
        validators: [
          {
            run: () => ({
              fields: hasError
                ? { 'range.to': { message: 'Explicit end date error' } }
                : {},
            }),
            triggers: ['change'],
          },
        ],
      })
      const rangeField = form._getOrCreateFieldApi({
        name: 'range',
        errorBoundary: true,
      })

      await form.validate('change')
      expect(rangeField.errors).toEqual([
        { message: 'Explicit end date error' },
      ])

      hasError = false
      const errors = await form.validate('change')

      expect(errors).toEqual([])
      expect(rangeField.errors).toEqual([])
      expect(form.state.canSubmit).toBe(true)
    })

    it('follows an error boundary field moved within an array', async () => {
      const form = new InternalFormApi({
        defaultValues: {
          users: [{ range: { to: '' } }, { range: { to: '' } }],
        },
        validators: [
          {
            run: z
              .object({
                users: z.array(
                  z.object({ range: z.object({ to: z.string() }) }),
                ),
              })
              .superRefine((_value, context) => {
                context.addIssue({
                  code: 'custom',
                  message: 'Moved range error',
                  path: ['users', 1, 'range', 'to'],
                })
              }),
            triggers: ['change'],
          },
        ],
      })
      const rangeField = form._getOrCreateFieldApi({
        name: 'users[0].range',
        errorBoundary: true,
      })

      form.swapFieldValues('users', 0, 1, { causeValidation: false })
      expect(rangeField.name).toBe('users[1].range')

      await form.validate('change')

      expect(rangeField.errors).toEqual([
        expect.objectContaining({ message: 'Moved range error' }),
      ])
      expect(form._tryGetFieldApi('users[1].range.to')).toBeNull()
    })
  })

  describe('setting field-level errors from form validators', () => {
    it('populates field errors from validator with fields property', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', age: 0 },
        validators: [
          {
            run: () => ({
              fields: {
                name: { message: 'Name is required' },
              },
            }),
            triggers: ['change'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      void field.atom
      await form.validate('change')
      expect(field.errors).toEqual([{ message: 'Name is required' }])
    })

    it('keeps form state unchanged for validator error maps without field errors', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({
              fields: {},
            }),
            triggers: ['change'],
          },
        ],
      })

      const errors = await form.validate('change')

      expect(errors).toEqual([])
      expect(form.state.errors).toEqual([])
      expect(form.state.canSubmit).toBe(true)
    })

    it('sets canSubmit to false when field errors are present', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({
              fields: {
                name: { message: 'Name is required' },
              },
            }),
            triggers: ['change'],
          },
        ],
      })

      await form.validate('change')

      expect(form.state.canSubmit).toBe(false)
    })

    it('sets canSubmit to false when field validator errors are present', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
      })
      const field = form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            run: () => ({ message: 'Name is required' }),
            triggers: ['change'],
          },
        ],
      })

      await field._runFieldValidation('change')

      expect(form.state.canSubmit).toBe(false)
    })

    it('stores string field errors from form validators as message objects', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({
              fields: {
                name: 'Name is required',
              },
            }),
            triggers: ['change'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      void field.atom
      await form.validate('change')
      expect(field.errors).toEqual([{ message: 'Name is required' }])
    })

    it('handles multiple field errors from a single validator', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', age: 0 },
        validators: [
          {
            run: () => ({
              fields: {
                name: { message: 'Name is required' },
                age: { message: 'Age is required' },
              },
            }),
            triggers: ['change'],
          },
        ],
      })
      const nameField = form._getOrCreateFieldApi({ name: 'name' })
      const ageField = form._getOrCreateFieldApi({ name: 'age' })
      void nameField.atom
      void ageField.atom
      await form.validate('change')
      expect(nameField.errors).toEqual([{ message: 'Name is required' }])
      expect(ageField.errors).toEqual([{ message: 'Age is required' }])
    })

    it('filters public field errors with form-level errorVisibility', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', age: 0 },
        errorVisibility: ({ fieldState }) => fieldState.meta.isTouched,
        validators: [
          {
            run: () => ({
              fields: {
                name: { message: 'Name is required' },
                age: { message: 'Age is required' },
              },
            }),
            triggers: ['change'],
          },
        ],
      })
      const nameField = form._getOrCreateFieldApi({ name: 'name' })
      const ageField = form._getOrCreateFieldApi({ name: 'age' })

      nameField.handleChange('Alice', { causeValidation: false })
      await form.validate('change')

      expect(nameField.errors).toEqual([{ message: 'Name is required' }])
      expect(nameField.meta.isValid).toBe(false)
      expect(nameField.meta.original.errors).toEqual([
        { message: 'Name is required' },
      ])
      expect(nameField.meta.original.isValid).toBe(false)

      expect(ageField.errors).toEqual([])
      expect(ageField.meta.isValid).toBe(true)
      expect(ageField.meta.original.errors).toEqual([
        { message: 'Age is required' },
      ])
      expect(ageField.meta.original.isValid).toBe(false)
    })

    it('lets fields override the form-level errorVisibility', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', age: 0 },
        errorVisibility: ({ fieldState }) => fieldState.meta.isTouched,
        validators: [
          {
            run: () => ({
              fields: {
                age: { message: 'Age is required' },
              },
            }),
            triggers: ['change'],
          },
        ],
      })
      const ageField = form._getOrCreateFieldApi({
        name: 'age',
        errorVisibility: () => true,
      })

      await form.validate('change')

      expect(ageField.errors).toEqual([{ message: 'Age is required' }])
      expect(ageField.meta.isValid).toBe(false)
      expect(ageField.meta.original.errors).toEqual([
        { message: 'Age is required' },
      ])
    })

    it('reveals submit-attempted errors only after a submit attempt', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        errorVisibility: ({ state }) => state.submissionAttempts > 0,
        validators: [
          {
            run: () => ({
              fields: {
                name: { message: 'Name is required' },
              },
            }),
            triggers: ['change'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })

      field.handleBlur()
      await form.validate('change')
      expect(field.errors).toEqual([])

      await form.handleSubmit()
      expect(field.errors).toEqual([{ message: 'Name is required' }])
    })

    it('reveals blurred-or-submit-attempted errors after blur or submit', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', email: '' },
        errorVisibility: ({ state, fieldState }) =>
          fieldState.meta.isBlurred || state.submissionAttempts > 0,
        validators: [
          {
            run: () => ({
              fields: {
                name: { message: 'Name is required' },
                email: { message: 'Email is required' },
              },
            }),
            triggers: ['change'],
          },
        ],
      })
      const nameField = form._getOrCreateFieldApi({ name: 'name' })
      const emailField = form._getOrCreateFieldApi({ name: 'email' })

      nameField.handleBlur()
      await form.validate('change')

      expect(nameField.errors).toEqual([{ message: 'Name is required' }])
      expect(emailField.errors).toEqual([])

      await form.handleSubmit()

      expect(emailField.errors).toEqual([{ message: 'Email is required' }])
    })

    it('passes current scoped state and pre-visibility field state to errorVisibility', async () => {
      const errorVisibility = vi.fn(
        ({ state, fieldState }) =>
          state.values.name === 'Alice' &&
          fieldState.value === 'Alice' &&
          fieldState.meta.isTouched &&
          fieldState.meta.isDirty,
      )
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        errorVisibility,
        validators: [
          {
            run: () => ({ fields: { name: 'Required' } }),
            triggers: ['change'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })

      field.handleChange('Alice', { causeValidation: false })
      await form.validate('change')

      expect(field.errors).toEqual([{ message: 'Required' }])
      expect(errorVisibility).toHaveBeenCalled()
      const [{ fieldState }] = errorVisibility.mock.lastCall!
      expect(fieldState).toMatchObject({
        value: 'Alice',
        meta: {
          isTouched: true,
          isSelfTouched: true,
          isDirty: true,
          isSelfDirty: true,
          isPristine: false,
        },
      })
      expect('errors' in fieldState.meta).toBe(false)
      expect('isValid' in fieldState.meta).toBe(false)
    })

    it('passes derived form error and validity state to errorVisibility', async () => {
      const errorVisibility = vi.fn(
        ({ state }) =>
          state.errors[0]?.message === 'Form error' &&
          !state.isValid &&
          state.isInvalid &&
          !state.canSubmit,
      )
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        errorVisibility,
        validators: [
          {
            run: () => ({
              form: 'Form error',
              fields: { name: 'Name error' },
            }),
            triggers: ['change'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })

      await form.validate('change')

      expect(field.errors).toEqual([{ message: 'Name error' }])
      expect(errorVisibility).toHaveBeenCalled()
      expect(errorVisibility.mock.lastCall?.[0].state).toMatchObject({
        errors: [{ message: 'Form error' }],
        isValid: false,
        isInvalid: true,
        canSubmit: false,
      })
    })

    it('handles array error format in field-level errors', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({
              fields: {
                name: [{ message: 'Error 1' }, { message: 'Error 2' }],
                lastName: { message: 'Error 3' },
              },
            }),
            triggers: ['change'],
          },
        ],
      })
      const nameField = form._getOrCreateFieldApi({ name: 'name' })
      const lastNameField = form._getOrCreateFieldApi({ name: 'lastName' })
      void nameField.atom
      void lastNameField.atom

      await form.validate('change')
      expect(nameField.errors).toEqual([
        { message: 'Error 1' },
        { message: 'Error 2' },
      ])
      expect(lastNameField.errors).toEqual([{ message: 'Error 3' }])
    })

    it('combines field-level and form-level errors in field.errors', async () => {
      vi.useFakeTimers()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({
              fields: {
                name: { message: 'Form-level error' },
              },
            }),
            triggers: ['change'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          { run: () => ({ message: 'Field-level error' }), triggers: [] },
        ],
      })
      void field.atom
      field.handleChange('New value')
      await vi.runAllTimersAsync()
      expect(field.errors).toEqual([{ message: 'Form-level error' }])
    })

    it('stores string field validator results as message objects', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
      })
      const field = form._getOrCreateFieldApi({
        name: 'name',
        validators: [{ run: () => 'Field-level error', triggers: [] }],
      })
      void field.atom
      await field._runFieldValidation('submit')
      expect(field.errors).toEqual([{ message: 'Field-level error' }])
    })

    it('clears field errors when validator no longer reports them', async () => {
      let shouldError = true
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => {
              if (shouldError) {
                return {
                  fields: {
                    name: { message: 'Error' },
                  },
                }
              }
              return null
            },
            triggers: ['change'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      void field.atom

      await form.validate('change')
      expect(field.errors).toEqual([{ message: 'Error' }])

      shouldError = false
      await form.validate('change')
      expect(field.errors).toEqual([])
    })

    it('handles multiple validators with field errors', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({
              fields: {
                name: { message: 'Error from validator 1' },
              },
            }),
            triggers: ['change'],
          },
          {
            run: () => ({
              fields: {
                name: { message: 'Error from validator 2' },
              },
            }),
            triggers: ['change'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      void field.atom
      await form.validate('change')
      expect(field.errors).toEqual([
        { message: 'Error from validator 1' },
        { message: 'Error from validator 2' },
      ])
    })

    it('handles formError and field errors together', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({
              form: { message: 'Form-wide error' },
              fields: {
                name: { message: 'Field-specific error' },
              },
            }),
            triggers: ['change'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      void field.atom
      await form.validate('change')
      expect(form.state.errors).toEqual([{ message: 'Form-wide error' }])
      expect(field.errors).toEqual([{ message: 'Field-specific error' }])
    })

    it('sets errors for fields even if they are not created yet', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () =>
              ({
                fields: {
                  nonexistent: { message: 'Error on nonexistent field' },
                },
              }) as any,
            triggers: ['change'],
          },
        ],
      })
      // Field doesn't exist yet
      let field = form._tryGetFieldApi(['nonexistent'])
      expect(field).toBeNull()

      await form.validate('change')

      // Field should now exist with error
      field = form._tryGetFieldApi(['nonexistent'])
      expect(field).not.toBeNull()
      void field!.atom
      expect(field!.errors).toEqual([{ message: 'Error on nonexistent field' }])
    })

    it('allows removal of field errors even if the field is unmounted', async () => {
      let shouldError = true
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => {
              if (shouldError) {
                return {
                  fields: {
                    nonexistent: { message: 'Error on nonexistent field' },
                  },
                  // This is needed because 'nonexistent' is type checked and would invalidate the function
                } as any
              }
              return null
            },
            triggers: ['change'],
          },
        ],
      })
      let field = form._tryGetFieldApi('nonexistent')
      expect(field).toBeNull()

      await form.validate('change')

      field = form._tryGetFieldApi('nonexistent')
      expect(field).not.toBeNull()
      void field!.atom

      expect(field!.errors).toEqual([{ message: 'Error on nonexistent field' }])

      shouldError = false
      await form.validate('change')
      field = form._tryGetFieldApi('nonexistent')
      expect(field).toBeNull()
    })

    it('keeps mounted fields after removing form validator field errors', async () => {
      let shouldError = true
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => {
              if (shouldError) {
                return {
                  fields: {
                    name: { message: 'Error' },
                  },
                }
              }
              return null
            },
            triggers: ['change'],
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      const unregister = field._register()

      await form.validate('change')
      expect(field.errors).toEqual([{ message: 'Error' }])

      shouldError = false
      await form.validate('change')

      expect(form._tryGetFieldApi('name')).toBe(field)
      expect(field.errors).toEqual([])

      unregister()
    })
  })
})
