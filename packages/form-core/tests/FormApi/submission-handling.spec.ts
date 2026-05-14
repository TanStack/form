import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { InternalFormApi } from '../../src/FormApi.lib'

describe('form - submission handling', () => {
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

    it('returns form validator errors and skips onSubmit', async () => {
      const onSubmit = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            run: () => ({ message: 'Submit error' }),
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
          { run: schema },
          {
            run: () => null,
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
          },
        ],
      })
      form._getOrCreateFieldApi({
        name: 'name',
        validators: [
          {
            run: () => ({ message: 'Field error' }),
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
