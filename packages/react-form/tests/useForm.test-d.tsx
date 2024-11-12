import { assertType, it } from 'vitest'
import { useForm } from '../src/index'
import type { ReactFormExtendedApi } from '../src/useForm'

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

it('should not have recursion problems and type register properly', () => {
  const register = <Data,>(f: ReactFormExtendedApi<Data>) => f

  function Comp() {
    const form = useForm({
      defaultValues: {
        name: '',
        title: '',
      },
    })

    const x = register(form)

    return null
  }
})
