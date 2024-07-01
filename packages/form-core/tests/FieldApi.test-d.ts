import { assertType, it } from 'vitest'
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

  const form = new FormApi<FormValues>()

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

  const form = new FormApi<FormValues>({
    defaultValues: {
      name: 'test',
    },
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

  const form = new FormApi<CompletelyPartialFormValues>({
    defaultValues: {},
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
      onChangeAsync: ({ value }) => {
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
      onChangeAsync: ({ value }) => {
        assertType<string>(value)

        return undefined
      },
    },
  })

  assertType<string>(field.state.value)
})
