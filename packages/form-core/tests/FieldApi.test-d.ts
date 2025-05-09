import { expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { FieldApi, FormApi } from '../src/index'
import type { StandardSchemaV1Issue } from '../src/index'

it('should type value properly', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
  })

  expectTypeOf(field.state.value).toEqualTypeOf<'test'>()
  expectTypeOf(field.options.name).toEqualTypeOf<'name'>()
  expectTypeOf(field.getValue()).toEqualTypeOf<'test'>()
})

it('should type value when nothing is passed into constructor', () => {
  type FormValues = {
    name?: string
    age?: number
  }

  const form = new FormApi({ defaultValues: {} as FormValues })

  const field = new FieldApi({
    form,
    name: 'name' as const,
  })

  expectTypeOf(field.state.value).toEqualTypeOf<string | undefined>()
  expectTypeOf(field.options.name).toEqualTypeOf<'name'>()
  expectTypeOf(field.getValue()).toEqualTypeOf<string | undefined>()
})

it('should type required fields in constructor', () => {
  type FormValues = {
    name: string
    age?: number
  }

  const form = new FormApi({
    defaultValues: {
      name: 'test',
    } as FormValues,
  })

  const field = new FieldApi({
    form,
    name: 'name' as const,
  })

  expectTypeOf(field.state.value).toEqualTypeOf<string>()
  expectTypeOf(field.options.name).toEqualTypeOf<'name'>()
  expectTypeOf(field.getValue()).toEqualTypeOf<string>()
})

it('should type value properly for completely partial forms', () => {
  type CompletelyPartialFormValues = {
    name?: 'test'
    age?: number
  }

  const form = new FormApi({
    defaultValues: {} as CompletelyPartialFormValues,
  })

  const field = new FieldApi({
    form,
    name: 'name' as const,
  })

  expectTypeOf(field.state.value).toEqualTypeOf<'test' | undefined>()
  expectTypeOf(field.options.name).toEqualTypeOf<'name'>()
  expectTypeOf(field.getValue()).toEqualTypeOf<'test' | undefined>()
})

it('should type onChange properly', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChange: ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<'test'>()

        return undefined
      },
    },
  })
})

it('should type onChangeAsync properly', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChangeAsync: async ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<'test'>()

        return undefined
      },
    },
  })
})

it('should type an array sub-field properly', () => {
  type Person = {
    name: string
    age: number
  }

  const form = new FormApi({
    defaultValues: {
      nested: {
        people: [] as Person[],
      },
    },
  } as const)

  const field = new FieldApi({
    form,
    name: `nested.people[1].name`,
    validators: {
      onChangeAsync: async ({ value }) => {
        expectTypeOf(value).toEqualTypeOf<string>()

        return undefined
      },
    },
  })

  expectTypeOf(field.state.value).toEqualTypeOf<string>()
})

it('should have the correct types returned from form validators', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validators: {
      onChange: () => {
        return '123' as const
      },
    },
  } as const)

  expectTypeOf(form.state.errorMap.onChange).toEqualTypeOf<'123' | undefined>()
})

it('should have the correct types returned from form validators even when both onChange and onChangeAsync are present', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validators: {
      onChange: () => {
        return '123' as const
      },
      onChangeAsync: async () => {
        return '123' as const
      },
    },
  } as const)

  expectTypeOf(form.state.errorMap.onChange).toEqualTypeOf<'123' | undefined>()
})

it('should have the correct types returned from field validators', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChange: () => {
        return '123' as const
      },
    },
  })

  expectTypeOf(field.state.meta.errorMap.onChange).toEqualTypeOf<
    '123' | undefined
  >()
})

it('should have the correct types returned from field validators in array', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  const field = new FieldApi({
    form,
    name: 'name',
    validators: {
      onChange: () => {
        return '123' as const
      },
    },
  })

  expectTypeOf(field.state.meta.errors).toEqualTypeOf<
    Array<'123' | undefined>
  >()
})

it('should have the correct types returned from form validators in array', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    validators: {
      onChange: () => {
        return '123' as const
      },
    },
  } as const)

  expectTypeOf(form.state.errors).toEqualTypeOf<Array<'123' | undefined>>()
})

it('should handle "fields" return types added to the field\'s errorMap itself', () => {
  const form = new FormApi({
    defaultValues: {
      firstName: '',
    },
    validators: {
      onChange: () => {
        return {
          fields: {
            firstName: 'Testing' as const,
          },
        }
      },
    },
  })

  const field = new FieldApi({
    form,
    name: 'firstName',
  })

  expectTypeOf(field.getMeta().errorMap.onChange).toEqualTypeOf<
    'Testing' | undefined
  >()
})

it('should handle "fields" return types added to the field\'s error array itself', () => {
  const form = new FormApi({
    defaultValues: {
      firstName: '',
    },
    validators: {
      onChange: () => {
        return {
          fields: {
            firstName: 'Testing' as const,
          },
        }
      },
    },
  })

  const field = new FieldApi({
    form,
    name: 'firstName',
  })

  expectTypeOf(field.getMeta().errors).toEqualTypeOf<
    Array<'Testing' | undefined>
  >()
})

it('should handle "fields" async return types added to the field\'s errorMap itself', () => {
  const form = new FormApi({
    defaultValues: {
      firstName: '',
    },
    validators: {
      onChangeAsync: async () => {
        return {
          fields: {
            firstName: 'Testing' as const,
          },
        }
      },
    },
  })

  const field = new FieldApi({
    form,
    name: 'firstName',
  })

  expectTypeOf(field.getMeta().errorMap.onChange).toEqualTypeOf<
    'Testing' | undefined
  >()
})

it('should handle "fields" async return types added to the field\'s error array itself', () => {
  const form = new FormApi({
    defaultValues: {
      firstName: '',
    },
    validators: {
      onChangeAsync: async () => {
        return {
          fields: {
            firstName: 'Testing' as const,
          },
        }
      },
    },
  })

  const field = new FieldApi({
    form,
    name: 'firstName',
  })

  expectTypeOf(field.getMeta().errors).toEqualTypeOf<
    Array<'Testing' | undefined>
  >()
})

it('should handle "sub-fields" async return types added to the field\'s error array itself', () => {
  const form = new FormApi({
    defaultValues: {
      person: {
        firstName: '',
      },
    },
    validators: {
      onChangeAsync: async () => {
        return {
          fields: {
            'person.firstName': 'Testing' as const,
          },
        }
      },
    },
  })

  const field = new FieldApi({
    form,
    name: 'person.firstName',
  })

  expectTypeOf(field.getMeta().errors).toEqualTypeOf<
    Array<'Testing' | undefined>
  >()
})

it('should only have field-level error types returned from parseValueWithSchema and parseValueWithSchemaAsync', () => {
  const form = new FormApi({
    defaultValues: { name: '' },
  })
  form.mount()

  const field = new FieldApi({
    form,
    name: 'name',
  })
  field.mount()

  const schema = z.string()
  // assert that it doesn't think it's a form-level error
  expectTypeOf(field.parseValueWithSchema(schema)).toEqualTypeOf<
    StandardSchemaV1Issue[] | undefined
  >()
  expectTypeOf(field.parseValueWithSchemaAsync(schema)).toEqualTypeOf<
    Promise<StandardSchemaV1Issue[] | undefined>
  >()
})

it("should allow setting manual errors according to the validator's return type", () => {
  const form = new FormApi({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    validators: {
      onChange: () => {
        return {
          fields: {
            firstName: '123' as const,
          },
        }
      },
    },
  })

  const field = new FieldApi({
    form,
    name: 'firstName',
    validators: {
      onChange: () => 10 as const,
      onBlur: () => ['onBlur'] as const,
    },
  })

  field.setErrorMap({
    onChange: '123',
  })

  expectTypeOf(field.setErrorMap).parameter(0).toEqualTypeOf<{
    onMount: undefined
    onChange: '123' | 10 | undefined
    onBlur: readonly ['onBlur'] | undefined
    onSubmit: undefined
    onServer: unknown
  }>
})

it('should allow setting manual errors with standard schema validators on the field level', () => {
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
      onChange: z.string(),
    },
  })

  expectTypeOf(field.setErrorMap).parameter(0).toEqualTypeOf<{
    onMount: undefined
    onChange: { message: string }[] | undefined
    onBlur: undefined
    onSubmit: undefined
    onServer: unknown
  }>
})
