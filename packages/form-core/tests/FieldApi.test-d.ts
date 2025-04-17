import { assertType, describe, it } from 'vitest'
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

  assertType<'test'>(field.state.value)
  assertType<'name'>(field.options.name)
  assertType<'test'>(field.getValue())
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

  assertType<string | undefined>(field.state.value)
  assertType<'name'>(field.options.name)
  assertType<string | undefined>(field.getValue())
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

  assertType<string>(field.state.value)
  assertType<'name' | 'age'>(field.options.name)
  assertType<string>(field.getValue())
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

  assertType<'test' | undefined>(field.state.value)
  assertType<'name' | 'age'>(field.options.name)
  assertType<'test' | undefined>(field.getValue())
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
        assertType<'test'>(value)

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
        assertType<'test'>(value)

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
        assertType<string>(value)

        return undefined
      },
    },
  })

  assertType<string>(field.state.value)
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

  assertType<'123' | undefined>(form.state.errorMap.onChange)
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

  assertType<'123' | undefined>(form.state.errorMap.onChange)
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

  assertType<'123' | undefined>(field.state.meta.errorMap.onChange)
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

  assertType<Array<'123' | undefined>>(field.state.meta.errors)
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

  assertType<Array<'123' | undefined>>(form.state.errors)
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

  assertType<'Testing' | undefined>(field.getMeta().errorMap.onChange)
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

  assertType<Array<'Testing' | undefined>>(field.getMeta().errors)
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

  assertType<'Testing' | undefined>(field.getMeta().errorMap.onChange)
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

  assertType<Array<'Testing' | undefined>>(field.getMeta().errors)
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

  assertType<Array<'Testing' | undefined>>(field.getMeta().errors)
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
  assertType<StandardSchemaV1Issue[] | undefined>(
    field.parseValueWithSchema(schema),
  )
  assertType<Promise<StandardSchemaV1Issue[] | undefined>>(
    field.parseValueWithSchemaAsync(schema),
  )
})
