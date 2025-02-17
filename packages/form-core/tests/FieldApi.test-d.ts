import { assertType, describe, it } from 'vitest'
import { FieldApi, FormApi } from '../src/index'

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
  assertType<'name'>(field.options.name)
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
  assertType<'name'>(field.options.name)
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
    name: `nested.people[${1}].name`,
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

describe('standard schema validator', () => {
  it('', () => {
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

    assertType<'Testing'>(field.getMeta().errorMap.onChange)
  })
})
