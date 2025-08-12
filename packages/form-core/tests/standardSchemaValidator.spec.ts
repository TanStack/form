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

  describe('array path handling', () => {
    it('should handle numeric array indices correctly', async () => {
      const form = new FormApi({
        defaultValues: {
          people: [{ name: '' }],
        },
        validators: {
          onChange: z.object({
            people: z.array(
              z.object({
                name: z.string().min(1, 'Name is required'),
              }),
            ),
          }),
        },
      })

      const field = new FieldApi({
        form,
        name: 'people[0].name',
      })

      field.mount()

      field.setValue('')
      expect(form.state.errors).toMatchObject([
        {
          'people[0].name': [{ message: 'Name is required' }],
        },
      ])
    })

    it('should handle string array indices from standard schema validators', async () => {
      // Use Zod's superRefine to simulate string paths that some standard schema validators return
      const schemaWithStringPaths = z.object({ 
        people: z.array(z.object({ 
          name: z.string() 
        }))
      }).superRefine((_, ctx) => {
        ctx.addIssue({
          code: 'custom',
          message: 'Name is required',
          path: ['people', '0', 'name'], // String index to test path handling
        })
      })

      const form = new FormApi({
        defaultValues: {
          people: [{ name: '' }],
        },
        validators: {
          onChange: schemaWithStringPaths,
        },
      })

      const field = new FieldApi({
        form,
        name: 'people[0].name',
      })

      field.mount()

      field.setValue('')
      expect(form.state.errors).toMatchObject([
        {
          'people[0].name': [{ message: 'Name is required' }],
        },
      ])
    })

    it('should handle nested arrays with mixed numeric and string indices', async () => {
      const form = new FormApi({
        defaultValues: {
          users: [
            {
              addresses: [
                { street: 'Main St' },
                { street: '' }, // This will fail validation
              ],
            },
          ],
        },
        validators: {
          onChange: z.object({
            users: z.array(
              z.object({
                addresses: z.array(
                  z.object({
                    street: z.string().min(1, 'Street is required'),
                  }),
                ),
              }),
            ),
          }),
        },
      })

      const field = new FieldApi({
        form,
        name: 'users[0].addresses[1].street',
      })

      field.mount()
      field.setValue('')
      
      expect(form.state.errors).toMatchObject([
        {
          'users[0].addresses[1].street': [{ message: 'Street is required' }],
        },
      ])
    })

    it('should handle regular object paths without array indices', async () => {
      const form = new FormApi({
        defaultValues: {
          user: {
            profile: {
              name: '',
            },
          },
        },
        validators: {
          onChange: z.object({
            user: z.object({
              profile: z.object({
                name: z.string().min(1, 'Name is required'),
              }),
            }),
          }),
        },
      })

      const field = new FieldApi({
        form,
        name: 'user.profile.name',
      })

      field.mount()

      field.setValue('')
      expect(form.state.errors).toMatchObject([
        {
          'user.profile.name': [{ message: 'Name is required' }],
        },
      ])
    })

    it('should allow numeric object properties for standard schema issue paths', () => {
      const form = new FormApi({
        defaultValues: {
          foo: {
            0: { bar: '' },
          },
        },
        validators: {
          onChange: z.object({
            foo: z.object({
              0: z.object({ bar: z.string().email('Must be an email') }),
            }),
          }),
        },
      })
      form.mount()

      const field = new FieldApi({
        form,
        name: 'foo.0.bar',
      })
      field.mount()

      field.setValue('test')

      expect(form.state.errors).toMatchObject([
        { 'foo.0.bar': [{ message: 'Must be an email' }] },
      ])
      expect(field.state.meta.errors).toMatchObject([
        { message: 'Must be an email' },
      ])
    })
  })
})
