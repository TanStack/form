import { assertType } from 'vitest'
import * as React from 'react'
import { useForm } from '../useForm'

it('should type onSubmit properly', () => {
  function Comp() {
    const form = useForm({
      defaultValues: {
        firstName: 'test',
        age: 84,
        // as const is required here
      } as const,
      onSubmit({ value }) {
        assertType<84>(value.age)
      },
    })
  }
})

it('should type a validator properly', () => {
  function Comp() {
    const form = useForm({
      defaultValues: {
        firstName: 'test',
        age: 84,
        // as const is required here
      } as const,
      validators: {
        onChange({ value }) {
          assertType<84>(value.age)
          return undefined
        },
      },
    })
  }
})
