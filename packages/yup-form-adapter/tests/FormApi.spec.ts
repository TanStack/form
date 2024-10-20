import { describe, expect, it } from 'vitest'

import { FieldApi, FormApi } from '@tanstack/form-core'
import yup from 'yup'
import { yupValidator } from '../src/index'

describe('yup form api', () => {
  it('should run an onChange with yup.string validation', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validatorAdapter: yupValidator(),
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onChange: yup.string().min(3, 'You must have a length of at least 3'),
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
      validatorAdapter: yupValidator(),
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
      validatorAdapter: yupValidator(),
      validators: {
        onChange: yup.object({
          name: yup
            .string()
            .min(3, 'You must have a length of at least 3')
            .matches(/a$/, 'You must end with an "a"'),
          surname: yup.string().min(3, 'You must have a length of at least 3'),
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
      validatorAdapter: yupValidator({
        transformErrors: (errors) => errors[0]?.message,
      }),
      validators: {
        onChange: yup.object({
          name: yup
            .string()
            .min(3, 'You must have a length of at least 3')
            .matches(/a$/, 'You must end with an "a"'),
          foo: yup.object({
            bar: yup.string().min(4, 'You must have a length of at least 4'),
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
      validatorAdapter: yupValidator(),
      validators: {
        onChange: yup.object({
          names: yup.array(
            yup.string().min(3, 'You must have a length of at least 3'),
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
})
