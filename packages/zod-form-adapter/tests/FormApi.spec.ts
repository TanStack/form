import { describe, expect, it } from 'vitest'

import { FieldApi, FormApi } from '@tanstack/form-core'
import { z } from 'zod'
import { zodValidator } from '../src/index'

describe('zod form api', () => {
  it('should run an onChange with z.string validation', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validatorAdapter: zodValidator(),
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onChange: z.string().min(3, 'You must have a length of at least 3'),
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a')
    expect(field.getMeta().errors).toEqual([
      'You must have a length of at least 3',
    ])
    field.setValue('asdf')
    expect(field.getMeta().errors).toEqual([])
  })

  it('should run an onChange fn with zod validation option enabled', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validatorAdapter: zodValidator(),
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onChange: ({ value }) => (value === 'a' ? 'Test' : undefined),
      },
    })

    field.mount()

    expect(field.getMeta().errors).toEqual([])
    field.setValue('a')
    expect(field.getMeta().errors).toEqual(['Test'])
    field.setValue('asdf')
    expect(field.getMeta().errors).toEqual([])
  })

  it("should set field errors with the form validator's onChange", () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
        surname: '',
      },
      validatorAdapter: zodValidator(),
      validators: {
        onChange: z.object({
          name: z
            .string()
            .min(3, 'You must have a length of at least 3')
            .endsWith('a', 'You must end with an "a"'),
          surname: z.string().min(3, 'You must have a length of at least 3'),
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

    expect(nameField.getMeta().errors).toEqual([])
    nameField.setValue('q')
    expect(nameField.getMeta().errors).toEqual([
      'You must have a length of at least 3, You must end with an "a"',
    ])
    expect(surnameField.getMeta().errors).toEqual([
      'You must have a length of at least 3',
    ])
    nameField.setValue('qwer')
    expect(nameField.getMeta().errors).toEqual(['You must end with an "a"'])
    nameField.setValue('qwera')
    expect(nameField.getMeta().errors).toEqual([])
  })

  it("should set field errors with the form validator's onChange and transform them", () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
        foo: {
          bar: '',
        },
      },
      validatorAdapter: zodValidator({
        transformErrors: (errors) => errors[0]?.message,
      }),
      validators: {
        onChange: z.object({
          name: z
            .string()
            .min(3, 'You must have a length of at least 3')
            .endsWith('a', 'You must end with an "a"'),
          foo: z.object({
            bar: z.string().min(4, 'You must have a length of at least 4'),
          }),
        }),
      },
    })

    const nameField = new FieldApi({
      form,
      name: 'name',
    })

    const fooBarField = new FieldApi({
      form,
      name: 'foo.bar',
    })

    nameField.mount()
    fooBarField.mount()

    expect(nameField.getMeta().errors).toEqual([])
    nameField.setValue('q')
    expect(nameField.getMeta().errors).toEqual([
      'You must have a length of at least 3',
    ])
    expect(fooBarField.getMeta().errors).toEqual([
      'You must have a length of at least 4',
    ])
    nameField.setValue('qwer')
    expect(nameField.getMeta().errors).toEqual(['You must end with an "a"'])
    nameField.setValue('qwera')
    expect(nameField.getMeta().errors).toEqual([])
  })

  it('should set field errors with the form validator for arrays', () => {
    const form = new FormApi({
      defaultValues: {
        names: [''],
      },
      validatorAdapter: zodValidator(),
      validators: {
        onChange: z.object({
          names: z.array(
            z.string().min(3, 'You must have a length of at least 3'),
          ),
        }),
      },
    })

    const name0Field = new FieldApi({
      form,
      name: 'names[0]',
    })

    name0Field.mount()

    expect(name0Field.getMeta().errors).toEqual([])
    name0Field.setValue('q')

    expect(name0Field.getMeta().errors).toEqual([
      'You must have a length of at least 3',
    ])
    name0Field.setValue('qwer')
    expect(name0Field.getMeta().errors).toEqual([])
  })

  it('should clear errors if previously errors were set and now are fixed', () => {
    const form = new FormApi({
      defaultValues: {
        password: '',
        confirmPassword: '',
      },
      validatorAdapter: zodValidator(),
      validators: {
        onChange: z
          .object({
            password: z.string(),
            confirmPassword: z.string(),
          })
          .refine(
            ({ password, confirmPassword }) => password === confirmPassword,
            {
              message: 'Passwords must match',
              path: ['password'],
            },
          ),
      },
    })
    form.mount()

    const field1 = new FieldApi({
      form,
      name: 'password',
      defaultMeta: {
        isTouched: true,
      },
    })
    field1.mount()

    const field2 = new FieldApi({
      form,
      name: 'confirmPassword',
      defaultMeta: {
        isTouched: true,
      },
    })
    field2.mount()

    field1.setValue('password')
    expect(field1.getMeta().errors).toStrictEqual(['Passwords must match'])
    expect(form.state.canSubmit).toBe(false)

    field2.setValue('password')
    expect(field2.getMeta().errors).toStrictEqual([])
    expect(form.state.canSubmit).toBe(true)
  })
})
