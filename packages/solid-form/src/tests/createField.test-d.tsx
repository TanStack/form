import { assertType } from 'vitest'
import { createForm } from '../createForm'

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
      <form.Provider>
        <form.Field
          name="firstName"
          children={(field) => {
            assertType<'test'>(field().state.value)
          }}
        />
        <form.Field
          name="age"
          children={(field) => {
            assertType<84>(field().state.value)
          }}
        />
      </form.Provider>
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
      <form.Provider>
        <form.Field
          name="firstName"
          validators={{
            onChange: ({ value }) => {
              assertType<'test'>(value)
              return null
            },
          }}
          children={(field) => null}
        />
        <form.Field
          name="age"
          validators={{
            onChange: ({ value }) => {
              assertType<84>(value)
              return null
            },
          }}
          children={(field) => null}
        />
      </form.Provider>
    )
  }
})
