/** @jsxImportSource octane */
import { expectTypeOf, it } from 'vitest'

it('should type state.value properly', () => {
  expectTypeOf(1).toEqualTypeOf<number>()
})
