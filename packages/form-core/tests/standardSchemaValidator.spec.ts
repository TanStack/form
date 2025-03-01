import { describe, expect, it, vi } from 'vitest'
import * as v from 'valibot'
import { z } from 'zod'
import { type } from 'arktype'
import { FieldApi, FormApi } from '../src/index'
import { sleep } from './utils'

describe('standard schema validator', () => {
  describe('form', () => {
    it('should detect a sync standard schema validator even without a validator adapter', async () => {
      const form = new FormApi({
        defaultValues: {
          firstName: '',
          lastName: '',
        },
        validators: {
          onChange: v.object({
            firstName: v.pipe(
              v.string(),
              v.minLength(3, 'First name is too short'),
              v.endsWith('a', 'You must end with an "a"'),
            ),
            lastName: v.string(),
          }),
        },
      })

      const field = new FieldApi({
        form,
        name: 'firstName',
      })

      field.mount()

      field.setValue('')
      expect(form.state.errors).toMatchObject([
        {
          firstName: [
            { message: 'First name is too short' },
            { message: 'You must end with an "a"' },
          ],
        },
      ])
    })

    it('should detect an async standard schema validator even without a validator adapter', async () => {
      vi.useFakeTimers()

      const form = new FormApi({
        defaultValues: {
          firstName: '',
          lastName: '',
        },
        validators: {
          onChangeAsync: v.objectAsync({
            firstName: v.pipeAsync(
              v.string(),
              v.checkAsync(async (val) => {
                await sleep(1)
                return val.length > 3
              }, 'First name is too short'),
            ),
            lastName: v.string(),
          }),
        },
      })

      const field = new FieldApi({
        form,
        name: 'firstName',
      })

      field.mount()

      field.setValue('')
      await vi.runAllTimersAsync()
      expect(form.state.errors).toMatchObject([
        {
          firstName: [{ message: 'First name is too short' }],
        },
      ])
    })

    it('should support standard schema sync validation with zod', async () => {
      const form = new FormApi({
        defaultValues: {
          email: '',
        },
        validators: {
          onChange: z.object({
            email: z.string().email('email must be an email address'),
          }),
        },
      })

      const field = new FieldApi({
        form,
        name: 'email',
      })

      field.mount()

      field.setValue('test')
      expect(form.state.errors).toMatchObject([
        {
          email: [{ message: 'email must be an email address' }],
        },
      ])
    })

    it('should support standard schema async validation with zod', async () => {
      vi.useFakeTimers()

      const form = new FormApi({
        defaultValues: {
          email: '',
        },
        validators: {
          onChangeAsync: z.object({
            email: z.string().email('email must be an email address'),
          }),
        },
      })

      const field = new FieldApi({
        form,
        name: 'email',
      })

      field.mount()

      field.setValue('test')
      await vi.runAllTimersAsync()
      expect(form.state.errors).toMatchObject([
        { email: [{ message: 'email must be an email address' }] },
      ])
    })

    it('should support standard schema async validation with valibot', async () => {
      vi.useFakeTimers()

      const form = new FormApi({
        defaultValues: {
          firstName: '',
          lastName: '',
        },
        validators: {
          onChangeAsync: v.objectAsync({
            firstName: v.pipeAsync(
              v.string(),
              v.checkAsync(async (val) => {
                await sleep(1)
                return val.length > 3
              }, 'First name is too short'),
            ),
            lastName: v.string(),
          }),
        },
      })

      const field = new FieldApi({
        form,
        name: 'firstName',
      })

      field.mount()

      field.setValue('')
      await vi.runAllTimersAsync()
      expect(form.state.errors).toMatchObject([
        { firstName: [{ message: 'First name is too short' }] },
      ])
    })

    it('should support standard schema sync validation with arktype', async () => {
      const form = new FormApi({
        defaultValues: {
          email: '',
        },
        validators: {
          onChange: type({ email: 'string.email' as 'string' }),
        },
      })

      const field = new FieldApi({
        form,
        name: 'email',
      })

      field.mount()

      field.setValue('test')
      expect(form.state.errors).toMatchObject([
        {
          email: [
            {
              message: 'email must be an email address (was "test")',
            },
          ],
        },
      ])
    })

    it("should set field errors with the form validator's onChange", () => {
      const form = new FormApi({
        defaultValues: {
          name: '',
          surname: '',
        },
        validators: {
          onChange: v.object({
            name: v.pipe(
              v.string(),
              v.minLength(3, 'You must have a length of at least 3'),
              v.endsWith('a', 'You must end with an "a"'),
            ),
            surname: v.pipe(
              v.string(),
              v.minLength(3, 'You must have a length of at least 3'),
            ),
          }),
        },
      })

      const nameField = new FieldApi({
        form,
        name: 'name',
      })

      const surnameField = new FieldApi({
        form,
        name: 'surname',
      })

      nameField.mount()
      surnameField.mount()

      expect(nameField.getMeta().errors).toMatchObject([])
      nameField.setValue('q')
      expect(nameField.getMeta().errors).toMatchObject([
        {
          message: 'You must have a length of at least 3',
        },
        { message: 'You must end with an "a"' },
      ])
      expect(surnameField.getMeta().errors).toMatchObject([
        { message: 'You must have a length of at least 3' },
      ])
      nameField.setValue('qwer')
      expect(nameField.getMeta().errors).toMatchObject([
        { message: 'You must end with an "a"' },
      ])
      nameField.setValue('qwera')
      expect(nameField.getMeta().errors).toMatchObject([])
    })
  })

  describe('field', () => {
    it('should detect a standard schema validator even without a validator adapter', async () => {
      const form = new FormApi({
        defaultValues: {
          email: '',
        },
      })

      const field = new FieldApi({
        form,
        name: 'email',
        validators: {
          onChange: type('string.email' as 'string'),
        },
      })

      field.mount()

      field.setValue('test')
      expect(field.getMeta().errors).toMatchObject([
        {
          message: 'must be an email address (was "test")',
        },
      ])
    })

    it('should support standard schema sync validation with valibot', async () => {
      const form = new FormApi({
        defaultValues: {
          firstName: '',
          lastName: '',
        },
      })

      const field = new FieldApi({
        form,
        name: 'firstName',
        validators: {
          onChange: v.pipe(
            v.string(),
            v.minLength(3, 'First name is too short'),
          ),
        },
      })

      field.mount()

      field.setValue('')
      expect(field.getMeta().errors).toMatchObject([
        { message: 'First name is too short' },
      ])
    })

    it('should support standard schema async validation with valibot', async () => {
      vi.useFakeTimers()

      const form = new FormApi({
        defaultValues: {
          firstName: '',
          lastName: '',
        },
      })

      const field = new FieldApi({
        form,
        name: 'firstName',
        validators: {
          onChangeAsync: v.pipeAsync(
            v.string(),
            v.checkAsync(async (val) => {
              await sleep(1)
              return val.length > 3
            }, 'First name is too short'),
          ),
        },
      })

      field.mount()

      field.setValue('')
      await vi.runAllTimersAsync()
      expect(field.getMeta().errors).toMatchObject([
        { message: 'First name is too short' },
      ])
    })

    it('should support standard schema sync validation with arktype', async () => {
      const form = new FormApi({
        defaultValues: {
          email: '',
        },
      })

      const field = new FieldApi({
        form,
        name: 'email',
        validators: {
          onChange: type('string.email' as 'string'),
        },
      })

      field.mount()

      field.setValue('test')
      expect(field.getMeta().errors).toMatchObject([
        {
          message: 'must be an email address (was "test")',
        },
      ])
    })
  })

  it('should support standard schema sync validation with zod', async () => {
    const form = new FormApi({
      defaultValues: {
        email: '',
      },
      validators: {
        onChange: z.object({
          email: z.string().email('email must be an email address'),
        }),
      },
    })

    const field = new FieldApi({
      form,
      name: 'email',
      validators: {
        onChange: z.string().email('email must be an email address'),
      },
    })

    field.mount()

    field.setValue('test')
    expect(field.getMeta().errors).toMatchObject([
      { message: 'email must be an email address' },
    ])
  })

  it.todo(
    'Should allow for `disableErrorFlat` to disable flattening `errors` array',
  )
})
