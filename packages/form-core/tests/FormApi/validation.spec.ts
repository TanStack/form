import { describe, expect, it, vi } from 'vitest'
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
      expect(form.state.formErrors).toEqual([{ message: 'Name is required' }])
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
      expect(form.state.formErrors).toEqual([
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

    it('populates formErrors', async () => {
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
      expect(form.state.formErrors).toEqual([{ message: 'Form error' }])
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

      vi.waitFor(() => {
        expect(form.state.isValidating).toBe(true)
      })

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

      // The sync validator should populate formErrors first
      await vi.waitFor(() => {
        expect(form.state.formErrors).toContainEqual({
          message: 'Sync error',
        })
      })

      // After debounce, the async validator result should also be in formErrors
      // The errors should be ordered by validator index
      await validatePromise
      expect(form.state.formErrors).toEqual([
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
      expect(form.state.formErrors).toEqual([
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

      // The sync validator should populate formErrors first
      await vi.waitFor(() => {
        expect(form.state.formErrors).toContainEqual({
          message: 'Sync error',
        })
      })

      // After debounce, both errors should be present
      await validatePromise
      expect(form.state.formErrors).toEqual([
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

      // The sync validator should populate formErrors first
      await vi.waitFor(() => {
        expect(form.state.formErrors).toContainEqual({
          message: 'Sync error',
        })
      })

      // After async completes, both errors should be present
      await validatePromise
      expect(form.state.formErrors).toEqual([
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
      expect(form.state.formErrors).toEqual([
        { message: 'Sync error' },
        { message: 'Async error' },
      ])

      // Third validator should NOT have been called because there were errors from previous validators
      expect(thirdValidatorFn).not.toHaveBeenCalled()
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
      expect(form.state.formErrors).toEqual([{ message: 'Sync error' }])

      // Third validator (with bailIfInvalid) should NOT have been called
      expect(thirdValidatorFn).not.toHaveBeenCalled()
      // Fourth validator (after bailIfInvalid) should also NOT have been called
      expect(fourthValidatorFn).not.toHaveBeenCalled()
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
      expect(form.state.formErrors).toEqual([{ message: 'Current error' }])
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
      void field.store
      await form.validate('change')
      expect(field.errors).toEqual([{ message: 'Name is required' }])
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
      void field.store
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
      void nameField.store
      void ageField.store
      await form.validate('change')
      expect(nameField.errors).toEqual([{ message: 'Name is required' }])
      expect(ageField.errors).toEqual([{ message: 'Age is required' }])
    })

    it('filters public field errors with form-level errorVisibility', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', age: 0 },
        errorVisibility: 'touched',
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
        errorVisibility: 'touched',
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
        errorVisibility: 'always',
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
        errorVisibility: 'submit-attempted',
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
        errorVisibility: 'blurred-or-submit-attempted',
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
      void nameField.store
      void lastNameField.store

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
      void field.store
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
      void field.store
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
      void field.store

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
      void field.store
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
      void field.store
      await form.validate('change')
      expect(form.state.formErrors).toEqual([{ message: 'Form-wide error' }])
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
      void field!.store
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
      void field!.store

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
