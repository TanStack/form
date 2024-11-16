import { describe, expect, it, vi } from 'vitest'
import * as v from 'valibot'
import { type } from 'arktype'
import { FieldApi, FormApi, standardSchemaValidator } from '../src/index'
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
      expect(form.state.errors).toStrictEqual([
        'First name is too short, You must end with an "a"',
      ])
    })

    it('should support standard schema sync validation with valibot and reads adapter params', async () => {
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
        validatorAdapter: standardSchemaValidator({
          transformErrors: (issues) => issues.map((issue) => issue.message)[0],
        }),
      })

      const field = new FieldApi({
        form,
        name: 'firstName',
      })

      field.mount()

      field.setValue('')
      expect(form.state.errors).toStrictEqual(['First name is too short'])
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
      expect(form.state.errors).toStrictEqual(['First name is too short'])
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
        validatorAdapter: standardSchemaValidator(),
      })

      const field = new FieldApi({
        form,
        name: 'firstName',
      })

      field.mount()

      field.setValue('')
      await vi.runAllTimersAsync()
      expect(form.state.errors).toStrictEqual(['First name is too short'])
    })

    it('should support standard schema sync validation with arktype', async () => {
      const form = new FormApi({
        defaultValues: {
          email: '',
        },
        validators: {
          onChange: type({ email: 'string.email' as 'string' }),
        },
        validatorAdapter: standardSchemaValidator(),
      })

      const field = new FieldApi({
        form,
        name: 'email',
      })

      field.mount()

      field.setValue('test')
      expect(form.state.errors).toStrictEqual([
        'email must be an email address (was "test")',
      ])
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
      expect(field.getMeta().errors).toStrictEqual([
        'must be an email address (was "test")',
      ])
    })

    // FIXME: Valibot currently broken
    it.skip('should support standard schema sync validation with valibot', async () => {
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
        validatorAdapter: standardSchemaValidator(),
      })

      field.mount()

      field.setValue('')
      expect(field.getMeta().errors).toStrictEqual(['First name is too short'])
    })

    // FIXME: Valibot currently broken
    it.skip('should support standard schema async validation with valibot', async () => {
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
        validatorAdapter: standardSchemaValidator(),
      })

      field.mount()

      field.setValue('')
      await vi.runAllTimersAsync()
      expect(field.getMeta().errors).toStrictEqual(['First name is too short'])
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
        validatorAdapter: standardSchemaValidator(),
      })

      field.mount()

      field.setValue('test')
      expect(field.getMeta().errors).toStrictEqual([
        'must be an email address (was "test")',
      ])
    })
  })
})
