import { expectTypeOf, it } from 'vitest'
import { createServerValidate, formOptions } from '../src'

it('types serverValidate return values as decoded form data', () => {
  const serverValidate = createServerValidate({
    ...formOptions({
      defaultValues: {
        firstName: '',
        age: 0,
      },
    }),
    onServerValidate: async () => undefined,
  })

  type ServerValidateResult = Awaited<ReturnType<typeof serverValidate>>

  expectTypeOf<ServerValidateResult>().toEqualTypeOf<Record<string, unknown>>()
  expectTypeOf<ServerValidateResult['age']>().toEqualTypeOf<unknown>()
})
