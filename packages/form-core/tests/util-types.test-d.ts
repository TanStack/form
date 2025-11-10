import { describe, expect, expectTypeOf, it } from 'vitest'
import type {
  DeepKeys,
  DeepKeysOfType,
  DeepValue,
  FieldsMap,
} from '../src/index'

describe('DeepKeys, DeepKeysOfType', () => {
  it('should support tuples', () => {
    type User = {
      name: string
      id: string
      age: number
    }
    /**
     * It should recognize that '0' does not have subkeys
     */
    type Tuple = { topUsers: [User, 0, User] }

    type Keys = DeepKeys<Tuple>
    type WithNumber = DeepKeysOfType<Tuple, number>
    type WithString = DeepKeysOfType<Tuple, string>
    type WithDate = DeepKeysOfType<Tuple, Date>
    type WithUser = DeepKeysOfType<Tuple, User>

    expectTypeOf<Keys>().toEqualTypeOf<
      | 'topUsers'
      | 'topUsers[0]'
      | 'topUsers[0].name'
      | 'topUsers[0].id'
      | 'topUsers[0].age'
      | 'topUsers[1]'
      | 'topUsers[2]'
      | 'topUsers[2].name'
      | 'topUsers[2].id'
      | 'topUsers[2].age'
    >()

    expectTypeOf<WithNumber>().toEqualTypeOf<
      'topUsers[0].age' | 'topUsers[1]' | 'topUsers[2].age'
    >()

    expectTypeOf<WithString>().toEqualTypeOf<
      | 'topUsers[0].name'
      | 'topUsers[0].id'
      | 'topUsers[2].name'
      | 'topUsers[2].id'
    >()

    expectTypeOf<WithUser>().toEqualTypeOf<'topUsers[0]' | 'topUsers[2]'>()

    expectTypeOf<WithDate>().toBeNever()
  })

  it('should support arrays', () => {
    type User = {
      name: string
      id: string
      age: number
    }
    /**
     * Properly recognizes that a normal number index won't cut it and should be `[number]` prefixed instead
     */
    type Array = { users: User[] }

    type Keys = DeepKeys<Array>
    type WithNumber = DeepKeysOfType<Array, number>
    type WithString = DeepKeysOfType<Array, string>
    type WithUser = DeepKeysOfType<Array, User>
    type WithDate = DeepKeysOfType<Array, Date>

    expectTypeOf<Keys>().toEqualTypeOf<
      | 'users'
      | `users[${number}]`
      | `users[${number}].name`
      | `users[${number}].id`
      | `users[${number}].age`
    >()

    expectTypeOf<WithNumber>().toEqualTypeOf<`users[${number}].age`>()

    expectTypeOf<WithString>().toEqualTypeOf<
      `users[${number}].name` | `users[${number}].id`
    >()

    expectTypeOf<WithUser>().toEqualTypeOf<`users[${number}]`>()

    expectTypeOf<WithDate>().toBeNever()
  })

  it('should support nested objects', () => {
    type User = {
      name: string
      id: string
      age: number
    }
    type Nested = { meta: { mainUser: User } }

    type Keys = DeepKeys<Nested>
    type WithNumber = DeepKeysOfType<Nested, number>
    type WithString = DeepKeysOfType<Nested, string>
    type WithUser = DeepKeysOfType<Nested, User>
    type WithDate = DeepKeysOfType<Nested, Date>

    expectTypeOf<Keys>().toEqualTypeOf<
      | 'meta'
      | 'meta.mainUser'
      | 'meta.mainUser.name'
      | 'meta.mainUser.id'
      | 'meta.mainUser.age'
    >()
    expectTypeOf<WithNumber>().toEqualTypeOf<`meta.mainUser.age`>()

    expectTypeOf<WithString>().toEqualTypeOf<
      `meta.mainUser.name` | `meta.mainUser.id`
    >()

    expectTypeOf<WithUser>().toEqualTypeOf<`meta.mainUser`>()

    expectTypeOf<WithDate>().toBeNever()
  })

  it('should support nested partial objects', () => {
    type User = {
      name: string
      id: string
      age: number
    }
    type NestedPartial = { meta?: { mainUser?: User } }

    type Keys = DeepKeys<NestedPartial>
    type WithNumber = DeepKeysOfType<NestedPartial, number>
    type WithMaybeNumber = DeepKeysOfType<NestedPartial, number | undefined>

    expectTypeOf<Keys>().toEqualTypeOf<
      | 'meta'
      | 'meta.mainUser'
      | 'meta.mainUser.name'
      | 'meta.mainUser.id'
      | 'meta.mainUser.age'
    >()

    expectTypeOf<WithNumber>().toBeNever()

    expectTypeOf<WithMaybeNumber>().toEqualTypeOf<'meta.mainUser.age'>()
  })

  it('should handle a `object`', () => {
    type NestedObject = { meta: { mainUser: object } }

    type Keys = DeepKeys<NestedObject>
    type WithObject = DeepKeysOfType<NestedObject, object>

    expectTypeOf<Keys>().toEqualTypeOf<
      'meta' | 'meta.mainUser' | `meta.mainUser.${string}`
    >()

    expectTypeOf<WithObject>().toEqualTypeOf<'meta' | 'meta.mainUser'>()

    type ObjectKeys = DeepKeys<object>
    expectTypeOf<ObjectKeys>().toBeString()
  })

  it('should handle `unknown`', () => {
    type NestedUnknown = { meta: { mainUser: unknown } }

    type Keys = DeepKeys<NestedUnknown>
    type WithObject = DeepKeysOfType<NestedUnknown, object>

    expectTypeOf<Keys>().toEqualTypeOf<
      'meta' | 'meta.mainUser' | `meta.mainUser.${string}`
    >()

    expectTypeOf<WithObject>().toEqualTypeOf<'meta'>()

    type UnknownKeys = DeepKeys<unknown>
    type UnknownWithUnknown = DeepKeysOfType<unknown, unknown>
    type UnknownWithObject = DeepKeysOfType<unknown, object>

    expectTypeOf<UnknownKeys>().toBeString()

    expectTypeOf<UnknownWithUnknown>().toBeString()

    expectTypeOf<UnknownWithObject>().toBeNever()
  })

  it('should handle discriminated unions', () => {
    type DiscriminatedUnion = { name: string } & (
      | { variant: 'foo' }
      | { variant: 'bar'; baz: boolean }
    )

    type Keys = DeepKeys<DiscriminatedUnion>
    type WithString = DeepKeysOfType<DiscriminatedUnion, string>
    type WithBoolean = DeepKeysOfType<DiscriminatedUnion, boolean>

    expectTypeOf<Keys>().toEqualTypeOf<'name' | 'variant' | 'baz'>()

    expectTypeOf<WithString>().toEqualTypeOf<'name' | 'variant'>()

    expectTypeOf<WithBoolean>().toEqualTypeOf<'baz'>()
  })

  it('should handle records', () => {
    type Value = {
      a: string
      b: number
      c: { d: string }
    }
    type RecordExample = {
      records: Record<string, Value>
    }
    type WithNumber = DeepKeysOfType<RecordExample, number>
    type WithString = DeepKeysOfType<RecordExample, string>

    expectTypeOf<DeepKeys<RecordExample>>().toEqualTypeOf<
      | 'records'
      | `records.${string}`
      | `records.${string}.a`
      | `records.${string}.b`
      | `records.${string}.c`
      | `records.${string}.c.d`
    >()

    expectTypeOf<WithNumber>().toEqualTypeOf<`records.${string}.b`>()

    expectTypeOf<WithString>().toEqualTypeOf<
      `records.${string}.a` | `records.${string}.c.d`
    >()
  })

  it('should handle objects containing any', () => {
    type ObjectWithAny = {
      a: any
      b: number
      obj: {
        c: any
        d: number
      }
    }

    type Keys = DeepKeys<ObjectWithAny>
    type WithNumber = DeepKeysOfType<ObjectWithAny, number>
    type WithString = DeepKeysOfType<ObjectWithAny, string>

    expectTypeOf<Keys>().toEqualTypeOf<
      'a' | 'b' | 'obj' | `a.${string}` | 'obj.c' | `obj.c.${string}` | 'obj.d'
    >()
    // since any can also be number, It's okay to be included
    expectTypeOf<WithNumber>().toEqualTypeOf<'a' | 'b' | 'obj.c' | 'obj.d'>()
    expectTypeOf<WithString>().toEqualTypeOf<'a' | 'obj.c'>()
  })
})

describe('DeepValue', () => {
  it('should handle discriminated unions', () => {
    type DiscriminatedUnion = { name: string } & (
      | { variant: 'foo' }
      | { variant: 'bar'; baz: boolean }
    )

    type SharedValue = DeepValue<DiscriminatedUnion, 'variant'>
    type FixedValue = DeepValue<DiscriminatedUnion, 'baz'>
    type FixedValue2 = DeepValue<DiscriminatedUnion, 'name'>

    expectTypeOf<SharedValue>().toEqualTypeOf<'foo' | 'bar'>()
    // TODO this might have implications for high-level nullable / undefinable not cascading.
    expectTypeOf<FixedValue>().toBeBoolean()
    expectTypeOf<FixedValue2>().toBeString()
  })

  it('should handle nested objects', () => {
    type User = {
      name: string
      id: string
      age: number
    }
    type Nested = { meta: { mainUser: User } }

    type ExpectNumber = DeepValue<Nested, 'meta.mainUser.age'>

    expectTypeOf<ExpectNumber>().toBeNumber()
  })

  it('should handle undefined / nullable in objects', () => {
    type NestedNullableObjectCase = {
      null: { mainUser: 'name' } | null
      undefined: { mainUser: 'name' } | undefined
      optional?: { mainUser: 'name' }
      mixed: { mainUser: 'name' } | null | undefined
    }

    type NameOrNullValue = DeepValue<NestedNullableObjectCase, 'null.mainUser'>
    type NameOrUndefinedValue = DeepValue<
      NestedNullableObjectCase,
      'undefined.mainUser'
    >
    type NameOrUndefinedValue2 = DeepValue<
      NestedNullableObjectCase,
      'optional.mainUser'
    >
    type NameOrNil = DeepValue<NestedNullableObjectCase, 'mixed.mainUser'>

    expectTypeOf<NameOrNullValue>().toEqualTypeOf<'name' | null>()

    expectTypeOf<NameOrUndefinedValue>().toEqualTypeOf<'name' | undefined>()

    expectTypeOf<NameOrUndefinedValue2>().toEqualTypeOf<'name' | undefined>()

    expectTypeOf<NameOrNil>().toEqualTypeOf<'name' | null | undefined>()

    type DoubleNestedNullableObjectCase = {
      mixed?: { mainUser: { name: 'name' } } | null | undefined
    }
    type ObjectOrNil = DeepValue<
      DoubleNestedNullableObjectCase,
      'mixed.mainUser'
    >
    type NameOrNil2 = DeepValue<
      DoubleNestedNullableObjectCase,
      'mixed.mainUser.name'
    >

    expectTypeOf<ObjectOrNil>().toEqualTypeOf<
      { name: 'name' } | null | undefined
    >()

    expectTypeOf<NameOrNil2>().toEqualTypeOf<'name' | null | undefined>()
  })

  it('should handle unions in objects', () => {
    type User = {
      name: string
      id: string
      age: number
    }
    type NestedUnion = {
      normal:
        | { a: User }
        | { a: string }
        | { b: string }
        | { c: { user: User } | { user: number } }
    }
    type NumberValue = DeepValue<NestedUnion, 'normal.a.age'>
    type StringValue = DeepValue<NestedUnion, 'normal.b'>
    type StringValue2 = DeepValue<NestedUnion, 'normal.c.user.id'>

    expectTypeOf<NumberValue>().toBeNumber()

    expectTypeOf<StringValue>().toBeString()

    expectTypeOf<StringValue2>().toBeString()

    type NestedNullableUnion = {
      mixed:
        | { a?: number; b?: { c: boolean } | null }
        | { b?: { c: string; e: number } }
    }
    type NumberOptional = DeepValue<NestedNullableUnion, 'mixed.a'>
    type MixedValue = DeepValue<NestedNullableUnion, 'mixed.b.c'>
    type NumberOptional2 = DeepValue<NestedNullableUnion, 'mixed.b.e'>

    expectTypeOf<NumberOptional>().toEqualTypeOf<number | undefined>()

    expectTypeOf<MixedValue>().toEqualTypeOf<
      string | boolean | null | undefined
    >()

    expectTypeOf<NumberOptional2>().toEqualTypeOf<number | undefined>()
  })

  it('should handle nested arrays', () => {
    type User = {
      name: string
      id: string
      age: number
    }
    type NestedArray = { users: User[] }

    type NumberValue = DeepValue<NestedArray, 'users[0].age'>
    type NumberValue2 = DeepValue<NestedArray, `users[${number}].age`>

    expectTypeOf<NumberValue>().toBeNumber()

    expectTypeOf<NumberValue2>().toBeNumber()
  })

  it('should handle nested arrays with unions', () => {
    type User = {
      name: string
      id: string
      age: number
    }
    type NestedArrayUnion1 = { users: string | User[] }
    type NestedArrayUnion2 = { users: (string | User)[] }

    type NumberValue = DeepValue<NestedArrayUnion1, 'users[0].age'>
    type NumberValue2 = DeepValue<NestedArrayUnion2, 'users[0].age'>
    type UserValue = DeepValue<NestedArrayUnion1, 'users[0]'>
    type UserOrString = DeepValue<NestedArrayUnion2, 'users[0]'>

    expectTypeOf<NumberValue>().toBeNumber()

    expectTypeOf<NumberValue2>().toBeNumber()

    expectTypeOf<UserValue>().toEqualTypeOf<User>()

    expectTypeOf<UserOrString>().toEqualTypeOf<User | string>()
  })

  it('should handle nested tuples', () => {
    type User = {
      name: string
      id: string
      age: number
    }

    type NestedTuple = { topUsers: [User, 0, User] }

    type NumberValue = DeepValue<NestedTuple, 'topUsers[0].age'>
    type NeverValue = DeepValue<NestedTuple, 'topUsers[1].age'>
    type NumberValue2 = DeepValue<NestedTuple, 'topUsers[2].age'>
    type UserValue = DeepValue<NestedTuple, 'topUsers[0]'>
    type ZeroValue = DeepValue<NestedTuple, 'topUsers[1]'>
    type UserValue2 = DeepValue<NestedTuple, 'topUsers[2]'>

    expectTypeOf<NumberValue>().toBeNumber()

    expectTypeOf<NeverValue>().toBeNever()

    expectTypeOf<NumberValue2>().toBeNumber()

    expectTypeOf<UserValue>().toEqualTypeOf<User>()

    expectTypeOf<ZeroValue>().toEqualTypeOf(0 as const)

    expectTypeOf<UserValue2>().toEqualTypeOf<User>()
  })

  it('should handle top-level arrays', () => {
    type User = {
      name: string
      id: string
      age: number
    }

    type UserValue = DeepValue<User[], '[5]'>
    //   ^? actual: never
    type NumberValue = DeepValue<User[], '[5].age'>

    expectTypeOf<UserValue>().toEqualTypeOf<User>()

    expectTypeOf<NumberValue>().toBeNumber()
  })

  it('should allow string and number literals', () => {
    type Tuple = ['a', 'b', 'c']

    type OneValue = DeepValue<{ a: 1 }, 'a'>

    type AValue = DeepValue<Tuple, '[0]'>
    type BValue = DeepValue<Tuple, '[1]'>
    type CValue = DeepValue<Tuple, '[2]'>

    expectTypeOf<OneValue>().toEqualTypeOf(1 as const)
    expectTypeOf<AValue>().toEqualTypeOf('a' as const)
    expectTypeOf<BValue>().toEqualTypeOf('b' as const)
    expectTypeOf<CValue>().toEqualTypeOf('c' as const)
  })

  it('should handle 2-dimensional arrays', () => {
    type User = {
      name: string
      id: string
      age: number
    }

    type DoubleArray = {
      people: {
        parents: User[]
      }[]
    }

    type StringValue = DeepValue<
      DoubleArray,
      `people[${number}].parents[${number}].name`
    >

    expectTypeOf<StringValue>().toBeString()
  })

  it('should handle records', () => {
    type Foo = {
      a: string
      b: number
      c: { d: string }
    }
    type RecordExample = {
      records: Record<string, Foo>
    }

    type RecordValue = DeepValue<RecordExample, 'records'>
    type FooValue = DeepValue<RecordExample, `records.${string}`>
    type StringValue = DeepValue<RecordExample, `records.${string}.a`>
    type NumberValue = DeepValue<RecordExample, `records.${string}.b`>
    type ObjectValue = DeepValue<RecordExample, `records.${string}.c`>
    type StringValue2 = DeepValue<RecordExample, `records.${string}.c.d`>

    type FooValue2 = DeepValue<RecordExample, 'records.something'>
    type StringValue3 = DeepValue<RecordExample, 'records.something.a'>
    type NumberValue2 = DeepValue<RecordExample, 'records.something.b'>
    type ObjectValue2 = DeepValue<RecordExample, 'records.something.c'>
    type StringValue4 = DeepValue<RecordExample, 'records.something.c.d'>

    expectTypeOf<RecordValue>().toEqualTypeOf<Record<string, Foo>>()

    expectTypeOf<FooValue>().toEqualTypeOf<Foo>()
    expectTypeOf<FooValue2>().toEqualTypeOf<Foo>()

    expectTypeOf<StringValue>().toBeString()
    expectTypeOf<StringValue2>().toBeString()
    expectTypeOf<StringValue3>().toBeString()
    expectTypeOf<StringValue4>().toBeString()

    expectTypeOf<NumberValue>().toBeNumber()
    expectTypeOf<NumberValue2>().toBeNumber()

    expectTypeOf<ObjectValue>().toEqualTypeOf<{
      d: string
    }>()
    expectTypeOf<ObjectValue2>().toEqualTypeOf<{
      d: string
    }>()
  })

  it('should handle records with arrays as values', () => {
    type Foo = {
      a: string
      b: number
      c: { d: string }
    }
    type RecordExample = {
      records: Record<string, Foo[]>
    }

    type RecordValue = DeepValue<RecordExample, 'records'>
    type FooArrayValue = DeepValue<RecordExample, `records.${string}`>
    type FooValue = DeepValue<RecordExample, `records.${string}[${number}]`>
    type StringValue = DeepValue<
      RecordExample,
      `records.${string}[${number}].a`
    >
    type NumberValue = DeepValue<
      RecordExample,
      `records.${string}[${number}].b`
    >
    type ObjectValue = DeepValue<
      RecordExample,
      `records.${string}[${number}].c`
    >
    type StringValue2 = DeepValue<
      RecordExample,
      `records.${string}[${number}].c.d`
    >

    type FooArrayValue2 = DeepValue<RecordExample, 'records.something'>
    type FooValue2 = DeepValue<RecordExample, 'records.something[0]'>
    type StringValue3 = DeepValue<RecordExample, 'records.something[0].a'>
    type NumberValue2 = DeepValue<RecordExample, 'records.something[0].b'>
    type ObjectValue2 = DeepValue<RecordExample, 'records.something[0].c'>
    type StringValue4 = DeepValue<RecordExample, 'records.something[0].c.d'>

    expectTypeOf<RecordValue>().toEqualTypeOf<Record<string, Foo[]>>()

    expectTypeOf<FooArrayValue>().toEqualTypeOf<Foo[]>()
    expectTypeOf<FooArrayValue2>().toEqualTypeOf<Foo[]>()

    expectTypeOf<FooValue>().toEqualTypeOf<Foo>()
    expectTypeOf<FooValue2>().toEqualTypeOf<Foo>()

    expectTypeOf<StringValue>().toBeString()
    expectTypeOf<StringValue2>().toBeString()
    expectTypeOf<StringValue3>().toBeString()
    expectTypeOf<StringValue4>().toBeString()

    expectTypeOf<NumberValue>().toBeNumber()
    expectTypeOf<NumberValue2>().toBeNumber()

    expectTypeOf<ObjectValue>().toEqualTypeOf<{
      d: string
    }>()
    expectTypeOf<ObjectValue2>().toEqualTypeOf<{
      d: string
    }>()
  })

  it('should handle nested records', () => {
    type Foo = {
      a: string
      b: number
      c: { d: string }
    }
    type NestedRecord = Record<string, Record<string, Foo>>
    type RecordExample = {
      records: NestedRecord
    }

    type RecordValue = DeepValue<RecordExample, 'records'>
    type RecordValue2 = DeepValue<RecordExample, `records.${string}`>
    type FooValue = DeepValue<RecordExample, `records.${string}.${string}`>
    type StringValue = DeepValue<RecordExample, `records.${string}.${string}.a`>
    type NumberValue = DeepValue<RecordExample, `records.${string}.${string}.b`>
    type ObjectValue = DeepValue<RecordExample, `records.${string}.${string}.c`>
    type StringValue2 = DeepValue<
      RecordExample,
      `records.${string}.${string}.c.d`
    >

    type RecordValue3 = DeepValue<RecordExample, 'records'>
    type RecordValue4 = DeepValue<RecordExample, 'records.something'>
    type FooValue2 = DeepValue<RecordExample, 'records.something.else'>
    type StringValue3 = DeepValue<RecordExample, 'records.something.else.a'>
    type NumberValue2 = DeepValue<RecordExample, 'records.something.else.b'>
    type ObjectValue2 = DeepValue<RecordExample, 'records.something.else.c'>
    type StringValue4 = DeepValue<RecordExample, 'records.something.else.c.d'>

    expectTypeOf<RecordValue>().toEqualTypeOf<NestedRecord>()
    expectTypeOf<RecordValue2>().toEqualTypeOf<Record<string, Foo>>()
    expectTypeOf<RecordValue3>().toEqualTypeOf<NestedRecord>()
    expectTypeOf<RecordValue4>().toEqualTypeOf<Record<string, Foo>>()

    expectTypeOf<FooValue>().toEqualTypeOf<Foo>()
    expectTypeOf<FooValue2>().toEqualTypeOf<Foo>()

    expectTypeOf<StringValue>().toBeString()
    expectTypeOf<StringValue2>().toBeString()
    expectTypeOf<StringValue3>().toBeString()
    expectTypeOf<StringValue4>().toBeString()

    expectTypeOf<NumberValue>().toBeNumber()
    expectTypeOf<NumberValue2>().toBeNumber()

    expectTypeOf<ObjectValue>().toEqualTypeOf<{
      d: string
    }>()
    expectTypeOf<ObjectValue2>().toEqualTypeOf<{
      d: string
    }>()
  })

  it('should not error for large objects', () => {
    type Cart = {
      id: number
      product: {
        id: string
        description?: string
        price_internet?: number
        price_dealer_region?: number
        price_dealer?: number
        stock:
          | {
              id: string
              quantity: number
              isChecked: boolean
            }[]
          | null
      }
      quantity: number
      isChecked: boolean
    }[]

    type Payment_types = {
      id: string
      title: string
      name: string
    }[]

    type Shipping_methods = {
      id: string
      title: string
      name: string
    }[]

    type Userr = {
      id: string
      first_name: string | null
      email: string | null
      avatar:
        | string
        | ({
            url?: string
          } & {
            id: string
            storage: string
            filename_disk: string | null
            filename_original: string | null
            filename_download: string | null
            filename_preview: string | null
            filename_thumbnail: string | null
            filename_medium: string | null
            filename_large: string | null
            filename_huge: string | null
            filename_icon: string | null
            filename_icon_large: string | null
            focal_point_y: number | null
          })
        | null
      // Reference Cart, Payment_types, Shipping_methods
      cart: Cart | null
      payment_types: Payment_types | null
      shipping_methods: Shipping_methods | null
    }

    type UserKeys = DeepValue<Userr, DeepKeys<Userr>>
  })

  it('should handle objects containing any', () => {
    type ObjectWithAny = {
      a: any
      b: number
      obj: {
        c: any
        d: number
      }
    }

    type AnyValue = DeepValue<ObjectWithAny, 'a'>
    type NumberValue = DeepValue<ObjectWithAny, 'b'>
    type ObjectValue = DeepValue<ObjectWithAny, 'obj'>
    type AnyValue2 = DeepValue<ObjectWithAny, 'obj.c'>
    type NumberValue2 = DeepValue<ObjectWithAny, 'obj.d'>

    expectTypeOf<AnyValue>().toBeAny()
    expectTypeOf<NumberValue>().toBeNumber()
    expectTypeOf<ObjectValue>().toEqualTypeOf<{
      c: any
      d: number
    }>
    expectTypeOf<AnyValue2>().toBeAny()
    expectTypeOf<NumberValue2>().toBeNumber()
  })
})

describe('FieldsMap', () => {
  it('should map to all available types', () => {
    type FormData = {
      user: {
        name: string
        accounts: {
          provider: string
          id: number
        }[]
      }
      metadata: {
        created: string
        tags: string[]
      }
      matrix: { values: number[][] }[]
    }

    type FieldGroup = {
      stringField1: string
      stringField2: string
      stringArray: string[]
      numberField: number
    }

    type Result = FieldsMap<FormData, FieldGroup>

    expectTypeOf<Result>().toEqualTypeOf<{
      stringField1:
        | 'user.name'
        | `user.accounts[${number}].provider`
        | 'metadata.created'
        | `metadata.tags[${number}]`
      stringField2:
        | 'user.name'
        | `user.accounts[${number}].provider`
        | 'metadata.created'
        | `metadata.tags[${number}]`
      stringArray: 'metadata.tags'
      numberField:
        | `user.accounts[${number}].id`
        | `matrix[${number}].values[${number}][${number}]`
    }>()
  })

  it('should return never if no path matches the target type', () => {
    type FormData = {
      id: string
    }

    type FieldGroup = {
      shouldNotExist: number
    }

    type Result = FieldsMap<FormData, FieldGroup>

    expectTypeOf<Result>().toEqualTypeOf<{
      shouldNotExist: never
    }>()
  })

  it('should return nevr for non-indexable types', () => {
    type TopLevelArray = FieldsMap<FormData, { foo: string }[]>
    type TopLevelObject = FieldsMap<FormData, Record<string, { foo: string }>>

    expectTypeOf<TopLevelArray>().toBeNever()
    expectTypeOf<TopLevelObject>().toBeNever()
  })
})
