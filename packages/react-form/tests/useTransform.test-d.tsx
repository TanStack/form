import { assertType, it } from 'vitest'
import { formOptions, mergeForm, useForm, useTransform } from '../src'
import type { ServerFormState } from '../src/server/types'

it('should maintain the type of the form', () => {
  const state = {} as ServerFormState<any, any>

  const formOpts = formOptions({
    defaultValues: {
      firstName: '',
      age: 123,
    } as const,
  })

  function Comp() {
    const form = useForm({
      ...formOpts,
      transform: useTransform(
        (baseForm) => mergeForm(baseForm, state),
        [state],
      ),
    })

    assertType<123>(form.state.values.age)
    assertType<string>(form.state.values.firstName)

    // @ts-expect-error this should be a number
    form.state.values.age = 'age'
  }
})
