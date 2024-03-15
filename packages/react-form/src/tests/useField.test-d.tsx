import * as React from 'react'
import { assertType, it } from 'vitest'
import { useForm } from '../useForm'

it('should type state.value properly', () => {
  function Comp() {
    const form = useForm({
      defaultValues: {
        firstName: 'test',
        age: 84,
      },
    } as const)

    return (
      <>
        <form.Field
          name="firstName"
          children={(field) => {
            assertType<'test'>(field.state.value)
          }}
        />
        <form.Field
          name="age"
          children={(field) => {
            assertType<84>(field.state.value)
          }}
        />
      </>
    )
  }
})

it('should type onChange properly', () => {
  function Comp() {
    const form = useForm({
      defaultValues: {
        firstName: 'test',
        age: 84,
      },
    } as const)

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
          children={() => null}
        />
        <form.Field
          name="age"
          validators={{
            onChange: ({ value }) => {
              assertType<84>(value)
              return null
            },
          }}
          children={() => null}
        />
      </>
    )
  }
})
