import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi.lib'

describe('Submission handling', () => {
  describe('handleSubmit', () => {
    it('validates with submit trigger', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Submit error' }),
          },
        ],
      })
      await form.handleSubmit()
      expect(form.state.formErrors).toEqual([{ message: 'Submit error' }])
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
          },
          {
            bailIfInvalid: true,
            run: thirdValidatorFn,
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
          },
          {
            bailIfInvalid: true,
            run: secondValidatorFn,
          },
          {
            run: thirdValidatorFn,
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
          },
        ],
      })
      await form.handleSubmit()
      expect(form.state.formErrors).toEqual([
        { message: 'Conditional submit error' },
      ])
      expect(validatorFn).toHaveBeenCalled()
    })
  })
})
