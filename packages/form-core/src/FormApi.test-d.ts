import { assertType, it } from 'vitest'
import { FormApi } from '../src/index'

it('should type handleSubmit as never when onSubmitMeta is not passed', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
  } as const)

  assertType<() => Promise<void>>(form.handleSubmit)
})

type OnSubmitMeta = {
  group: string
}

it('should type handleChange correctly', () => {
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    onSubmitMeta: {} as OnSubmitMeta,
  } as const)

  form.handleSubmit({ group: 'track' })

  assertType<(submitMeta: { group: string }) => Promise<void>>(
    form.handleSubmit,
  )
})
