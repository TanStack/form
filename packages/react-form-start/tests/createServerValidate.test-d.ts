import { expectTypeOf, it } from 'vitest'
import { createServerValidate } from '../src/createServerValidate'

it('should accept FormDataInfo options like booleans', () => {
  const serverValidate = createServerValidate({
    onServerValidate: async () => undefined,
  })

  expectTypeOf(serverValidate).parameter(1).toEqualTypeOf<
    | {
        arrays?: string[]
        booleans?: string[]
        dates?: string[]
        files?: string[]
        numbers?: string[]
      }
    | undefined
  >()

  void serverValidate(new FormData(), {
    booleans: ['rememberMe'],
  })
})
