
import { describe, expectTypeOf, it } from 'vitest'
import type { FieldWithValue } from '../src'

describe('FieldWithValue', () => {
  it('should preserve string typing for field name', () => {
    const field = null as unknown as FieldWithValue<boolean>

    expectTypeOf<typeof field.name>().toEqualTypeOf<string>()
    expectTypeOf<typeof field.value>().toEqualTypeOf<boolean>()

    const validName: string = field.name

    // @ts-expect-error Field name must not be a number
    const invalidName: number = field.name

    // @ts-expect-error Field name does not have Number methods
    field.name.toFixed()

    // @ts-expect-error Boolean field must not accept a string
    field.handleChange('not a boolean')

    field.handleChange(true)

    void validName
    void invalidName
  })
})
