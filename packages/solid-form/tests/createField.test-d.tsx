import { assertType, it } from 'vitest'
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
        <form.Field name="firstName">
          {(field) => {
            assertType<'test'>(field().state.value)
            return null
          }}
        </form.Field>
        <form.Field name="age">
          {(field) => {
            assertType<84>(field().state.value)
            return null
          }}
        </form.Field>
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
              assertType<'test'>(value)
              return null
            },
          }}
        >
          {() => null}
        </form.Field>
        <form.Field
          name="age"
          validators={{
            onChange: ({ value }) => {
              assertType<84>(value)
              return null
            },
          }}
        >
          {() => null}
        </form.Field>
      </>
    )
  }
})
