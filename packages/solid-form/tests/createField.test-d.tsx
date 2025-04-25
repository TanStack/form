import { expectTypeOf, it } from 'vitest'
import { createForm } from '../src/createForm'

it('should type state.value properly', () => {
  function Comp() {
    const form = createForm(
      () =>
        ({
          defaultValues: {
            firstName: 'test',
            age: 84,
          },
        }) as const,
    )

    return (
      <>
        <form.Field
          name="firstName"
          children={(field) => {
            expectTypeOf(field().state.value).toEqualTypeOf<'test'>()
            return null
          }}
        />
        <form.Field
          name="age"
          children={(field) => {
            expectTypeOf(field().state.value).toEqualTypeOf<84>()
            return null
          }}
        />
      </>
    )
  }
})

it('should type onChange properly', () => {
  function Comp() {
    const form = createForm(
      () =>
        ({
          defaultValues: {
            firstName: 'test',
            age: 84,
          },
        }) as const,
    )

    return (
      <>
        <form.Field
          name="firstName"
          validators={{
            onChange: ({ value }) => {
              expectTypeOf(value).toEqualTypeOf<'test'>()
              return null
            },
          }}
          children={() => null}
        />
        <form.Field
          name="age"
          validators={{
            onChange: ({ value }) => {
              expectTypeOf(value).toEqualTypeOf<84>()
              return null
            },
          }}
          children={() => null}
        />
      </>
    )
  }
})
