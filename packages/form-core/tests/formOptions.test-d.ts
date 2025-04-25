import { describe, expectTypeOf, it } from 'vitest'
import { FormApi, formOptions } from '../src/index'

describe('formOptions', () => {
  it('types should be properly inferred', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formOpts = formOptions({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      } as Person,
    })

    const form = new FormApi({
      ...formOpts,
    })

    expectTypeOf(form.state.values).toEqualTypeOf<Person>()
  })

  it('types should be properly inferred when passing args alongside formOptions', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formOpts = formOptions({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      } as Person,
    })

    const form = new FormApi({
      ...formOpts,
      onSubmitMeta: {
        test: 'test',
      },
    })

    expectTypeOf(form.handleSubmit).toEqualTypeOf<{
      (): Promise<void>
      (submitMeta: { test: string }): Promise<void>
    }>()
  })

  it('types should be properly inferred when formOptions are being overridden', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    type PersonWithAge = Person & {
      age: number
    }

    const formOpts = formOptions({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      } as Person,
    })

    const form = new FormApi({
      ...formOpts,
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
        age: 10,
      },
    })

    expectTypeOf(form.state.values).toExtend<PersonWithAge>()
  })
})
