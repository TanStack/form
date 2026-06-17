import { describe, expectTypeOf, it } from 'vitest'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  TryGetArrayElementType,
} from '../src/index'

interface User {
  name: string
  id: string
  age: number
}

// TODO we should give people a way to narrow things for themselves.
// For example, if they have a field of Foo | Bar and they do a runtime check of Foo,
// it would be nice if Field or Form can be cast in a way where they pick up on it.
// How, you ask? Idfk, go figure it out.

// TODO this PR changes DeepKeysAndValues. Add its regression spec before v2.
// https://github.com/TanStack/form/pull/2057

/**
 * Properly recognizes that `0` is not an object and should not have subkeys
 */
describe('DeepKeys', () => {
  it('Should support tuples with various internal types', () => {
    type TestShape = { topUsers: [User, 0, User] }
    // It should not use template `number` since it's a tuple
    type Expected =
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

    expectTypeOf<DeepKeys<TestShape>>().toEqualTypeOf<Expected>()
  })

  it('Should support arrays', () => {
    type OneElementType = { users: Array<User> }
    type ExpectedOneElement =
      | 'users'
      | `users[${number}]`
      | `users[${number}].name`
      | `users[${number}].id`
      | `users[${number}].age`

    expectTypeOf<DeepKeys<OneElementType>>().toEqualTypeOf<ExpectedOneElement>()
  })

  it('Should allow keys for unions in arrays', () => {
    type UnionType = { users: Array<User | number> }
    type ExpectedUnionType =
      | 'users'
      | `users[${number}]`
      | `users[${number}].name`
      | `users[${number}].id`
      | `users[${number}].age`

    expectTypeOf<DeepKeys<UnionType>>().toEqualTypeOf<ExpectedUnionType>()
  })

  it('Should allow deep nesting', () => {
    type NestedSupport = { meta: { mainUser: User } }
    type ExpectedKeys =
      | 'meta'
      | 'meta.mainUser'
      | 'meta.mainUser.name'
      | 'meta.mainUser.id'
      | 'meta.mainUser.age'

    expectTypeOf<DeepKeys<NestedSupport>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('Should allow partial objects', () => {
    type PartialObject = { meta?: { mainUser?: User } }
    type ExpectedKeys =
      | 'meta'
      | 'meta.mainUser'
      | 'meta.mainUser.name'
      | 'meta.mainUser.id'
      | 'meta.mainUser.age'

    expectTypeOf<DeepKeys<PartialObject>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('should handle the `object` type', () => {
    expectTypeOf<DeepKeys<object>>().toEqualTypeOf<string>()

    type NestedObject = { meta: { mainUser: object } }
    type ExpectedKeys = 'meta' | 'meta.mainUser' | `meta.mainUser.${string}`

    expectTypeOf<DeepKeys<NestedObject>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('should handle `unknown` in types', () => {
    expectTypeOf<DeepKeys<unknown>>().toEqualTypeOf<string>()

    type NestedUnknown = { meta: { mainUser: unknown } }
    type ExpectedKeys = 'meta' | 'meta.mainUser' | `meta.mainUser.${string}`

    expectTypeOf<DeepKeys<NestedUnknown>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('should handle `any` in types', () => {
    expectTypeOf<DeepKeys<any>>().toEqualTypeOf<string>()

    type NestedUnknown = { meta: { mainUser: any } }
    type ExpectedKeys = 'meta' | 'meta.mainUser' | `meta.mainUser.${string}`

    expectTypeOf<DeepKeys<NestedUnknown>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('should handle unions and intersections', () => {
    type DiscriminatedUnion = { name: string } & (
      | { variant: 'foo' }
      | { variant: 'bar'; baz: boolean }
    )
    type ExpectedKeys = 'name' | 'variant' | 'baz'

    expectTypeOf<DeepKeys<DiscriminatedUnion>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('should handle nullish states', () => {
    type Insert = { mainUser: 'name' }
    type NullishStates = {
      required: Insert
      nullable: Insert | null
      undefinable: Insert | undefined
      optional?: Insert
      mixed: Insert | null | undefined
      onlyNull: null
      onlyUndefined: undefined
      optionalNull?: null
      onlyNil: null | undefined
    }

    type ExpectedKeys =
      | 'required'
      | 'required.mainUser'
      | 'nullable'
      | 'nullable.mainUser'
      | 'undefinable'
      | 'undefinable.mainUser'
      | 'optional'
      | 'optional.mainUser'
      | 'mixed'
      | 'mixed.mainUser'
      | 'onlyNull'
      | 'onlyUndefined'
      | 'optionalNull'
      | 'onlyNil'

    expectTypeOf<DeepKeys<NullishStates>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('should handle nullish states with nested objects', () => {
    type NestedNullishState = {
      mixed?: { mainUser: { name: 'name' } } | null | undefined
    }

    type ExpectedKeys = 'mixed' | 'mixed.mainUser' | 'mixed.mainUser.name'

    expectTypeOf<DeepKeys<NestedNullishState>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('should handle unions with nested cases', () => {
    type TheUnion =
      | { a: User }
      | { a: string }
      | { b: string }
      | { c: { user: User } | { user: number } }
    type NestedObjectUnionCase = {
      normal: TheUnion
    }
    type ExpectedKeys =
      | 'normal'
      | 'normal.a'
      | 'normal.a.name'
      | 'normal.a.id'
      | 'normal.a.age'
      | 'normal.b'
      | 'normal.c'
      | 'normal.c.user'
      | 'normal.c.user.name'
      | 'normal.c.user.id'
      | 'normal.c.user.age'

    expectTypeOf<
      DeepKeys<NestedObjectUnionCase>
    >().toEqualTypeOf<ExpectedKeys>()
  })

  it('should handle nullish within nested unions', () => {
    type NullishNested = {
      nullable:
        | { a?: number; b?: { c: boolean } | null }
        | { b?: { c: string; e: number } }
    }

    type ExpectedKeys =
      | 'nullable'
      | 'nullable.a'
      | 'nullable.b'
      | 'nullable.b.c'
      | 'nullable.b.e'

    expectTypeOf<DeepKeys<NullishNested>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('should handle one dimensional arrays', () => {
    type OneDimArrays = {
      ages: Array<number>
      names: Array<string>
      users: Array<User>
    }
    type ExpectedKeys =
      | 'ages'
      | `ages[${number}]`
      | 'names'
      | `names[${number}]`
      | 'users'
      | `users[${number}]`
      | `users[${number}].name`
      | `users[${number}].id`
      | `users[${number}].age`

    expectTypeOf<DeepKeys<OneDimArrays>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('should handle two dimensional arrays', () => {
    type TwoDimArrays = {
      ages: Array<Array<number>>
      names: Array<Array<string>>
      users: Array<Array<User>>
    }
    type ExpectedKeys =
      | 'ages'
      | `ages[${number}]`
      | `ages[${number}][${number}]`
      | 'names'
      | `names[${number}]`
      | `names[${number}][${number}]`
      | 'users'
      | `users[${number}]`
      | `users[${number}][${number}]`
      | `users[${number}][${number}].name`
      | `users[${number}][${number}].id`
      | `users[${number}][${number}].age`

    expectTypeOf<DeepKeys<TwoDimArrays>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('should handle two arrays with object', () => {
    type TwoDimArrays = {
      entries: Array<{
        ages: Array<number>
        names: Array<string>
        users: Array<User>
      }>
    }
    type ExpectedKeys =
      | 'entries'
      | `entries[${number}]`
      | `entries[${number}].ages`
      | `entries[${number}].ages[${number}]`
      | `entries[${number}].names`
      | `entries[${number}].names[${number}]`
      | `entries[${number}].users`
      | `entries[${number}].users[${number}]`
      | `entries[${number}].users[${number}].name`
      | `entries[${number}].users[${number}].id`
      | `entries[${number}].users[${number}].age`

    expectTypeOf<DeepKeys<TwoDimArrays>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('should handle optional arrays', () => {
    type UsersArray = {
      nullable: Array<User> | null
      undefinable: Array<User> | undefined
      optional?: Array<User>
    }

    type ExpectedKeys =
      | 'nullable'
      | `nullable[${number}]`
      | `nullable[${number}].name`
      | `nullable[${number}].id`
      | `nullable[${number}].age`
      | 'undefinable'
      | `undefinable[${number}]`
      | `undefinable[${number}].name`
      | `undefinable[${number}].id`
      | `undefinable[${number}].age`
      | 'optional'
      | `optional[${number}]`
      | `optional[${number}].name`
      | `optional[${number}].id`
      | `optional[${number}].age`

    expectTypeOf<DeepKeys<UsersArray>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('should support top level arrays', () => {
    type UserArray = Array<User>

    type ExpectedKeys =
      | `[${number}]`
      | `[${number}].name`
      | `[${number}].id`
      | `[${number}].age`

    expectTypeOf<DeepKeys<UserArray>>().toEqualTypeOf<ExpectedKeys>()
  })

  it('should handle a real use case object', () => {
    type Stock = {
      id: string
      quantity: number
      isChecked: boolean
    }

    type Product = {
      id: string
      description?: string
      price_internet?: number
      price_dealer_region?: number
      price_dealer?: number
      stock: Array<Stock> | null
      quantity: number
      isChecked: boolean
    }
    type Cart = {
      id: number
      product: Product
    }

    type Payment_types = Array<{
      id: string
      title: string
      name: string
    }>

    type Shipping_methods = Array<{
      id: string
      title: string
      name: string
    }>

    type Avatar = {
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
    }

    type UserDto = {
      id: string
      first_name: string | null
      email: string | null
      avatar: string | Avatar | null
      // Reference Cart, Payment_types, Shipping_methods
      cart: Cart | null
      payment_types: Payment_types | null
      shipping_methods: Shipping_methods | null
    }

    type ExpectedKeys =
      | 'id'
      | 'first_name'
      | 'email'
      | 'avatar'
      | 'avatar.url'
      | 'avatar.id'
      | 'avatar.storage'
      | 'avatar.filename_disk'
      | 'avatar.filename_original'
      | 'avatar.filename_download'
      | 'avatar.filename_preview'
      | 'avatar.filename_thumbnail'
      | 'avatar.filename_medium'
      | 'avatar.filename_large'
      | 'avatar.filename_huge'
      | 'avatar.filename_icon'
      | 'avatar.filename_icon_large'
      | 'avatar.focal_point_y'
      | 'cart'
      | 'cart.id'
      | 'cart.product'
      | 'cart.product.id'
      | 'cart.product.description'
      | 'cart.product.price_internet'
      | 'cart.product.price_dealer_region'
      | 'cart.product.price_dealer'
      | 'cart.product.quantity'
      | 'cart.product.isChecked'
      | 'cart.product.stock'
      | `cart.product.stock[${number}]`
      | `cart.product.stock[${number}].id`
      | `cart.product.stock[${number}].quantity`
      | `cart.product.stock[${number}].isChecked`
      | 'payment_types'
      | `payment_types[${number}]`
      | `payment_types[${number}].id`
      | `payment_types[${number}].title`
      | `payment_types[${number}].name`
      | 'shipping_methods'
      | `shipping_methods[${number}]`
      | `shipping_methods[${number}].id`
      | `shipping_methods[${number}].title`
      | `shipping_methods[${number}].name`

    expectTypeOf<DeepKeys<UserDto>>().toEqualTypeOf<ExpectedKeys>()
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

    type ExpectedKeys =
      | 'records'
      | `records.${string}`
      | `records.${string}.a`
      | `records.${string}.b`
      | `records.${string}.c`
      | `records.${string}.c.d`

    expectTypeOf<DeepKeys<RecordExample>>().toEqualTypeOf<ExpectedKeys>()
  })
})

describe('DeepValue', () => {
  it('Should support tuples with various internal types', () => {
    type TestShape = { topUsers: [User, 0, User] }

    type Expect<TKey extends string> = DeepValue<TestShape, TKey>

    expectTypeOf<Expect<'topUsers'>>().toEqualTypeOf<TestShape['topUsers']>()
    expectTypeOf<Expect<'topUsers[0]'>>().toEqualTypeOf<User>()
    expectTypeOf<Expect<'topUsers[1]'>>().toEqualTypeOf<0>()
    expectTypeOf<Expect<'topUsers[2]'>>().toEqualTypeOf<User>()
  })

  it('Should support arrays', () => {
    type OneElementType = { users: Array<User> }

    type Expect<TKey extends string> = DeepValue<OneElementType, TKey>

    expectTypeOf<Expect<'users'>>().toEqualTypeOf<Array<User>>()
    expectTypeOf<Expect<'users[1]'>>().toEqualTypeOf<User>()
    expectTypeOf<Expect<'users[15]'>>().toEqualTypeOf<User>()
  })

  it('Should allow keys for unions in arrays', () => {
    type UnionType = { users: Array<User | number> }

    type Expect<TKey extends string> = DeepValue<UnionType, TKey>

    expectTypeOf<Expect<'users'>>().toEqualTypeOf<Array<User | number>>()
    expectTypeOf<Expect<'users[0]'>>().toEqualTypeOf<User | number>()
    expectTypeOf<Expect<'users[15]'>>().toEqualTypeOf<User | number>()
    // number['name'] evaluates to undefined
    expectTypeOf<Expect<'users[15].name'>>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Expect<'users[15].age'>>().toEqualTypeOf<number | undefined>()
    expectTypeOf<Expect<'users[15].id'>>().toEqualTypeOf<string | undefined>()
  })

  it('Should allow deep nesting', () => {
    type NestedSupport = { meta: { mainUser: User } }

    type Expect<TKey extends string> = DeepValue<NestedSupport, TKey>

    expectTypeOf<Expect<'meta'>>().toEqualTypeOf<{ mainUser: User }>()
    expectTypeOf<Expect<'meta.mainUser'>>().toEqualTypeOf<User>()
    expectTypeOf<Expect<'meta.mainUser.name'>>().toEqualTypeOf<string>()
    expectTypeOf<Expect<'meta.mainUser.id'>>().toEqualTypeOf<string>()
    expectTypeOf<Expect<'meta.mainUser.age'>>().toEqualTypeOf<number>()
  })

  it('Should allow partial objects', () => {
    type PartialObject = { meta?: { mainUser?: User } }

    type Expect<TKey extends string> = DeepValue<PartialObject, TKey>

    expectTypeOf<Expect<'meta'>>().toEqualTypeOf<
      { mainUser?: User } | undefined
    >()
    expectTypeOf<Expect<'meta.mainUser'>>().toEqualTypeOf<User | undefined>()
    expectTypeOf<Expect<'meta.mainUser.name'>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<'meta.mainUser.id'>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<'meta.mainUser.age'>>().toEqualTypeOf<
      number | undefined
    >()
  })

  it('should handle the `object` type', () => {
    expectTypeOf<DeepValue<object, 'anything'>>().toEqualTypeOf<unknown>()

    type NestedObject = { meta: { mainUser: object } }

    type Expect<TKey extends string> = DeepValue<NestedObject, TKey>

    expectTypeOf<Expect<'meta'>>().toEqualTypeOf<{ mainUser: object }>()
    expectTypeOf<Expect<'meta.mainUser'>>().toEqualTypeOf<object>()
    expectTypeOf<Expect<'meta.mainUser.foo'>>().toEqualTypeOf<unknown>()
    expectTypeOf<Expect<'meta.mainUser.bar'>>().toEqualTypeOf<unknown>()
    expectTypeOf<
      Expect<'meta.mainUser.foo.bar.foobar'>
    >().toEqualTypeOf<unknown>()
  })

  it('should handle `unknown` in types', () => {
    expectTypeOf<DeepValue<unknown, 'foo'>>().toEqualTypeOf<unknown>()
    expectTypeOf<DeepValue<unknown, 'foo.bar'>>().toEqualTypeOf<unknown>()
    expectTypeOf<
      DeepValue<unknown, 'foo.bar.foobar'>
    >().toEqualTypeOf<unknown>()

    type NestedUnknown = { meta: { mainUser: unknown } }

    type Expect<TKey extends string> = DeepValue<NestedUnknown, TKey>

    expectTypeOf<Expect<'meta'>>().toEqualTypeOf<{ mainUser: unknown }>()
    expectTypeOf<Expect<'meta.mainUser'>>().toEqualTypeOf<unknown>()
    expectTypeOf<Expect<'meta.mainUser.foo'>>().toEqualTypeOf<unknown>()
    expectTypeOf<Expect<'meta.mainUser.foo.bar'>>().toEqualTypeOf<unknown>()
    expectTypeOf<
      Expect<'meta.mainUser.foo.bar.foobar'>
    >().toEqualTypeOf<unknown>()
  })

  it('should handle `any` in types', () => {
    // Whether this is any or unknown is up to us. Change unit test if desired.
    expectTypeOf<DeepValue<any, 'foo'>>().toEqualTypeOf<any>()
    expectTypeOf<DeepValue<any, 'foo.bar'>>().toEqualTypeOf<any>()
    expectTypeOf<DeepValue<any, 'foo.bar.foobar'>>().toEqualTypeOf<any>()

    type NestedAny = { meta: { mainUser: any } }

    type Expect<TKey extends string> = DeepValue<NestedAny, TKey>

    expectTypeOf<Expect<'meta'>>().toEqualTypeOf<{ mainUser: any }>()
    expectTypeOf<Expect<'meta.mainUser'>>().toEqualTypeOf<any>()
    expectTypeOf<Expect<'meta.mainUser.foo'>>().toEqualTypeOf<unknown>()
    expectTypeOf<Expect<'meta.mainUser.foo.bar'>>().toEqualTypeOf<unknown>()
    expectTypeOf<
      Expect<'meta.mainUser.foo.bar.foobar'>
    >().toEqualTypeOf<unknown>()
  })

  it('should handle unions and intersections', () => {
    type DiscriminatedUnion = { name: string } & (
      | { variant: 'foo' }
      | { variant: 'bar'; baz: boolean }
    )
    type Expect<TKey extends string> = DeepValue<DiscriminatedUnion, TKey>

    expectTypeOf<Expect<'name'>>().toEqualTypeOf<string>()
    expectTypeOf<Expect<'variant'>>().toEqualTypeOf<'foo' | 'bar'>()
    expectTypeOf<Expect<'baz'>>().toEqualTypeOf<boolean | undefined>()
  })

  it('should handle nullish states', () => {
    type Insert = { mainUser: 'name' }
    type NullishStates = {
      required: Insert
      nullable: Insert | null
      undefinable: Insert | undefined
      optional?: Insert
      mixed: Insert | null | undefined
      onlyNull: null
      onlyUndefined: undefined
      optionalNull?: null
      onlyNil: null | undefined
    }

    type Expect<TKey extends string> = DeepValue<NullishStates, TKey>

    expectTypeOf<Expect<'required'>>().toEqualTypeOf<Insert>()
    expectTypeOf<Expect<'required.mainUser'>>().toEqualTypeOf<'name'>()
    expectTypeOf<Expect<'nullable'>>().toEqualTypeOf<Insert | null>()
    expectTypeOf<Expect<'nullable.mainUser'>>().toEqualTypeOf<
      'name' | undefined
    >()
    expectTypeOf<Expect<'undefinable'>>().toEqualTypeOf<Insert | undefined>()
    expectTypeOf<Expect<'undefinable.mainUser'>>().toEqualTypeOf<
      'name' | undefined
    >()
    expectTypeOf<Expect<'optional'>>().toEqualTypeOf<Insert | undefined>()
    expectTypeOf<Expect<'optional.mainUser'>>().toEqualTypeOf<
      'name' | undefined
    >()
    expectTypeOf<Expect<'mixed'>>().toEqualTypeOf<Insert | undefined | null>()
    expectTypeOf<Expect<'mixed.mainUser'>>().toEqualTypeOf<'name' | undefined>()
    expectTypeOf<Expect<'onlyNull'>>().toEqualTypeOf<null>()
    expectTypeOf<Expect<'onlyUndefined'>>().toEqualTypeOf<undefined>()
    expectTypeOf<Expect<'optionalNull'>>().toEqualTypeOf<undefined | null>()
    expectTypeOf<Expect<'onlyNil'>>().toEqualTypeOf<undefined | null>()
  })

  it('should handle nullish states with nested objects', () => {
    type Roles = { mainUser: { name: 'name' } }
    type NestedNullishState = {
      mixed?: Roles | null | undefined
    }

    type Expect<TKey extends string> = DeepValue<NestedNullishState, TKey>

    expectTypeOf<Expect<'mixed'>>().toEqualTypeOf<Roles | null | undefined>()
    expectTypeOf<Expect<'mixed.mainUser'>>().toEqualTypeOf<
      { name: 'name' } | undefined
    >()
    expectTypeOf<Expect<'mixed.mainUser.name'>>().toEqualTypeOf<
      'name' | undefined
    >()
  })

  it('should handle unions with nested cases', () => {
    type TheUnion =
      | { a: User }
      | { a: string }
      | { b: string }
      | { c: { user: User } | { user: number } }
    type NestedObjectUnionCase = {
      normal: TheUnion
    }

    type Expect<TKey extends string> = DeepValue<NestedObjectUnionCase, TKey>

    expectTypeOf<Expect<'normal'>>().toEqualTypeOf<TheUnion>()
    expectTypeOf<Expect<'normal.a'>>().toEqualTypeOf<
      User | string | undefined
    >()
    expectTypeOf<Expect<'normal.a.id'>>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Expect<'normal.a.name'>>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Expect<'normal.a.age'>>().toEqualTypeOf<number | undefined>()
    expectTypeOf<Expect<'normal.b'>>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Expect<'normal.c'>>().toEqualTypeOf<
      { user: User } | { user: number } | undefined
    >()
    expectTypeOf<Expect<'normal.c.user'>>().toEqualTypeOf<
      User | number | undefined
    >()
    expectTypeOf<Expect<'normal.c.user.name'>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<'normal.c.user.id'>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<'normal.c.user.age'>>().toEqualTypeOf<
      number | undefined
    >()
  })

  it('should handle nullish within nested unions', () => {
    type TheUnion =
      | { a?: number; b?: { c: boolean } | null }
      | { b?: { c: string; e: number } }

    type NullishNested = {
      nullable: TheUnion
    }

    type Expect<TKey extends string> = DeepValue<NullishNested, TKey>

    expectTypeOf<Expect<'nullable'>>().toEqualTypeOf<TheUnion>()
    expectTypeOf<Expect<'nullable.a'>>().toEqualTypeOf<number | undefined>()
    expectTypeOf<Expect<'nullable.b'>>().toEqualTypeOf<
      { c: boolean } | { c: string; e: number } | null | undefined
    >()
    expectTypeOf<Expect<'nullable.b.c'>>().toEqualTypeOf<
      boolean | string | undefined
    >()
    expectTypeOf<Expect<'nullable.b.e'>>().toEqualTypeOf<number | undefined>()
  })

  it('should handle one dimensional arrays', () => {
    type OneDimArrays = {
      ages: Array<number>
      names: Array<string>
      users: Array<User>
    }

    type Expect<TKey extends string> = DeepValue<OneDimArrays, TKey>

    expectTypeOf<Expect<'ages'>>().toEqualTypeOf<Array<number>>()
    expectTypeOf<Expect<`ages[${number}]`>>().toEqualTypeOf<number>()
    expectTypeOf<Expect<'names'>>().toEqualTypeOf<Array<string>>()
    expectTypeOf<Expect<`names[${number}]`>>().toEqualTypeOf<string>()
    expectTypeOf<Expect<'users'>>().toEqualTypeOf<Array<User>>()
    expectTypeOf<Expect<`users[${number}]`>>().toEqualTypeOf<User>()
    expectTypeOf<Expect<`users[${number}].name`>>().toEqualTypeOf<string>()
    expectTypeOf<Expect<`users[${number}].id`>>().toEqualTypeOf<string>()
    expectTypeOf<Expect<`users[${number}].age`>>().toEqualTypeOf<number>()
  })

  it('should handle two dimensional arrays', () => {
    type TwoDimArrays = {
      ages: Array<Array<number>>
      names: Array<Array<string>>
      users: Array<Array<User>>
    }

    type Expect<TKey extends string> = DeepValue<TwoDimArrays, TKey>

    expectTypeOf<Expect<'ages'>>().toEqualTypeOf<Array<Array<number>>>()
    expectTypeOf<Expect<`ages[${number}]`>>().toEqualTypeOf<Array<number>>()
    expectTypeOf<Expect<`ages[${number}][${number}]`>>().toEqualTypeOf<number>()
    expectTypeOf<Expect<'names'>>().toEqualTypeOf<Array<Array<string>>>()
    expectTypeOf<Expect<`names[${number}]`>>().toEqualTypeOf<Array<string>>()
    expectTypeOf<
      Expect<`names[${number}][${number}]`>
    >().toEqualTypeOf<string>()
    expectTypeOf<Expect<'users'>>().toEqualTypeOf<Array<Array<User>>>()
    expectTypeOf<Expect<`users[${number}]`>>().toEqualTypeOf<Array<User>>()
    expectTypeOf<Expect<`users[${number}][${number}]`>>().toEqualTypeOf<User>()
    expectTypeOf<
      Expect<`users[${number}][${number}].name`>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      Expect<`users[${number}][${number}].id`>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      Expect<`users[${number}][${number}].age`>
    >().toEqualTypeOf<number>()
  })

  it('should handle two arrays with object', () => {
    type TwoDimArrays = {
      entries: Array<{
        ages: Array<number>
        names: Array<string>
        users: Array<User>
      }>
    }

    type Expect<TKey extends string> = DeepValue<TwoDimArrays, TKey>

    expectTypeOf<Expect<'entries'>>().toEqualTypeOf<
      Array<{ ages: Array<number>; names: Array<string>; users: Array<User> }>
    >()
    expectTypeOf<Expect<`entries[${number}]`>>().toEqualTypeOf<{
      ages: Array<number>
      names: Array<string>
      users: Array<User>
    }>()
    expectTypeOf<Expect<`entries[${number}].ages`>>().toEqualTypeOf<
      Array<number>
    >()
    expectTypeOf<
      Expect<`entries[${number}].ages[${number}]`>
    >().toEqualTypeOf<number>()
    expectTypeOf<Expect<`entries[${number}].names`>>().toEqualTypeOf<
      Array<string>
    >()
    expectTypeOf<
      Expect<`entries[${number}].names[${number}]`>
    >().toEqualTypeOf<string>()
    expectTypeOf<Expect<`entries[${number}].users`>>().toEqualTypeOf<
      Array<User>
    >()
    expectTypeOf<
      Expect<`entries[${number}].users[${number}]`>
    >().toEqualTypeOf<User>()
    expectTypeOf<
      Expect<`entries[${number}].users[${number}].name`>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      Expect<`entries[${number}].users[${number}].id`>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      Expect<`entries[${number}].users[${number}].age`>
    >().toEqualTypeOf<number>()
  })

  it('should handle optional arrays', () => {
    type UsersArray = {
      nullable: Array<User> | null
      undefinable: Array<User> | undefined
      optional?: Array<User>
    }

    type Expect<TKey extends string> = DeepValue<UsersArray, TKey>

    expectTypeOf<Expect<'nullable'>>().toEqualTypeOf<Array<User> | null>()
    expectTypeOf<Expect<`nullable[${number}]`>>().toEqualTypeOf<
      User | undefined
    >()
    expectTypeOf<Expect<`nullable[${number}].name`>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<`nullable[${number}].id`>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<`nullable[${number}].age`>>().toEqualTypeOf<
      number | undefined
    >()

    expectTypeOf<Expect<'undefinable'>>().toEqualTypeOf<
      Array<User> | undefined
    >()
    expectTypeOf<Expect<`undefinable[${number}]`>>().toEqualTypeOf<
      User | undefined
    >()
    expectTypeOf<Expect<`undefinable[${number}].name`>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<`undefinable[${number}].id`>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<`undefinable[${number}].age`>>().toEqualTypeOf<
      number | undefined
    >()

    expectTypeOf<Expect<'optional'>>().toEqualTypeOf<Array<User> | undefined>()
    expectTypeOf<Expect<`optional[${number}]`>>().toEqualTypeOf<
      User | undefined
    >()
    expectTypeOf<Expect<`optional[${number}].name`>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<`optional[${number}].id`>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<`optional[${number}].age`>>().toEqualTypeOf<
      number | undefined
    >()
  })

  it('should support top level arrays', () => {
    type UserArray = Array<User>

    type Expect<TKey extends string> = DeepValue<UserArray, TKey>

    expectTypeOf<Expect<'[0]'>>().toEqualTypeOf<User>()
    expectTypeOf<Expect<'[15]'>>().toEqualTypeOf<User>()
    expectTypeOf<Expect<`[${number}]`>>().toEqualTypeOf<User>()
    expectTypeOf<Expect<`[${number}].name`>>().toEqualTypeOf<string>()
    expectTypeOf<Expect<`[${number}].id`>>().toEqualTypeOf<string>()
    expectTypeOf<Expect<`[${number}].age`>>().toEqualTypeOf<number>()
  })

  it('should handle a real use case object', () => {
    type Stock = {
      id: string
      quantity: number
      isChecked: boolean
    }

    type Product = {
      id: string
      description?: string
      price_internet?: number
      price_dealer_region?: number
      price_dealer?: number
      stock: Array<Stock> | null
      quantity: number
      isChecked: boolean
    }
    type Cart = {
      id: number
      product: Product
    }

    type Payment_type = {
      id: string
      title: string
      name: string
    }

    type Shipping_method = {
      id: string
      title: string
      name: string
    }

    type Avatar = {
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
    }

    type UserDto = {
      id: string
      first_name: string | null
      email: string | null
      avatar: string | Avatar | null
      // Reference Cart, Payment_types, Shipping_methods
      cart: Cart | null
      payment_types: Array<Payment_type> | null
      shipping_methods: Array<Shipping_method> | null
    }

    type Expect<TKey extends string> = DeepValue<UserDto, TKey>

    expectTypeOf<Expect<'id'>>().toEqualTypeOf<string>()
    expectTypeOf<Expect<'first_name'>>().toEqualTypeOf<string | null>()
    expectTypeOf<Expect<'email'>>().toEqualTypeOf<string | null>()
    expectTypeOf<Expect<'avatar'>>().toEqualTypeOf<string | Avatar | null>()
    expectTypeOf<Expect<'avatar.url'>>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Expect<'avatar.id'>>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Expect<'avatar.storage'>>().toEqualTypeOf<string | undefined>()
    expectTypeOf<Expect<'avatar.filename_disk'>>().toEqualTypeOf<
      string | null | undefined
    >()
    expectTypeOf<Expect<'avatar.filename_original'>>().toEqualTypeOf<
      string | null | undefined
    >()
    expectTypeOf<Expect<'avatar.filename_download'>>().toEqualTypeOf<
      string | null | undefined
    >()
    expectTypeOf<Expect<'avatar.filename_preview'>>().toEqualTypeOf<
      string | null | undefined
    >()
    expectTypeOf<Expect<'avatar.filename_thumbnail'>>().toEqualTypeOf<
      string | null | undefined
    >()
    expectTypeOf<Expect<'avatar.filename_medium'>>().toEqualTypeOf<
      string | null | undefined
    >()
    expectTypeOf<Expect<'avatar.filename_large'>>().toEqualTypeOf<
      string | null | undefined
    >()
    expectTypeOf<Expect<'avatar.filename_huge'>>().toEqualTypeOf<
      string | null | undefined
    >()
    expectTypeOf<Expect<'avatar.filename_icon'>>().toEqualTypeOf<
      string | null | undefined
    >()
    expectTypeOf<Expect<'avatar.filename_icon_large'>>().toEqualTypeOf<
      string | null | undefined
    >()
    expectTypeOf<Expect<'avatar.focal_point_y'>>().toEqualTypeOf<
      number | null | undefined
    >()
    expectTypeOf<Expect<'cart'>>().toEqualTypeOf<Cart | null>()
    expectTypeOf<Expect<'cart.id'>>().toEqualTypeOf<number | undefined>()
    expectTypeOf<Expect<'cart.product'>>().toEqualTypeOf<Product | undefined>()
    expectTypeOf<Expect<'cart.product.id'>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<'cart.product.description'>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<'cart.product.price_internet'>>().toEqualTypeOf<
      number | undefined
    >()
    expectTypeOf<Expect<'cart.product.price_dealer_region'>>().toEqualTypeOf<
      number | undefined
    >()
    expectTypeOf<Expect<'cart.product.price_dealer'>>().toEqualTypeOf<
      number | undefined
    >()
    expectTypeOf<Expect<'cart.product.quantity'>>().toEqualTypeOf<
      number | undefined
    >()
    expectTypeOf<Expect<'cart.product.isChecked'>>().toEqualTypeOf<
      boolean | undefined
    >()
    expectTypeOf<Expect<'cart.product.stock'>>().toEqualTypeOf<
      Array<Stock> | null | undefined
    >()
    expectTypeOf<Expect<`cart.product.stock[${number}]`>>().toEqualTypeOf<
      Stock | undefined
    >()
    expectTypeOf<Expect<`cart.product.stock[${number}].id`>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<
      Expect<`cart.product.stock[${number}].quantity`>
    >().toEqualTypeOf<number | undefined>()
    expectTypeOf<
      Expect<`cart.product.stock[${number}].isChecked`>
    >().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<
      Expect<'payment_types'>
    >().toEqualTypeOf<Array<Payment_type> | null>()
    expectTypeOf<Expect<`payment_types[${number}]`>>().toEqualTypeOf<
      Payment_type | undefined
    >()
    expectTypeOf<Expect<`payment_types[${number}].id`>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<`payment_types[${number}].title`>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<`payment_types[${number}].name`>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<
      Expect<'shipping_methods'>
    >().toEqualTypeOf<Array<Shipping_method> | null>()
    expectTypeOf<Expect<`shipping_methods[${number}]`>>().toEqualTypeOf<
      Shipping_method | undefined
    >()
    expectTypeOf<Expect<`shipping_methods[${number}].id`>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<`shipping_methods[${number}].title`>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<Expect<`shipping_methods[${number}].name`>>().toEqualTypeOf<
      string | undefined
    >()
  })

  it('should handle objects with any', () => {
    type ObjectWithAny = {
      a: any
      b: number
      obj: {
        c: any
        d: number
      }
    }

    type ExpectedKeys =
      | 'a'
      | `a.${string}`
      | 'b'
      | 'obj'
      | 'obj.c'
      | `obj.c.${string}`
      | 'obj.d'

    expectTypeOf<DeepKeys<ObjectWithAny>>().toEqualTypeOf<ExpectedKeys>()

    type Expect<TKey extends string> = DeepValue<ObjectWithAny, TKey>

    expectTypeOf<Expect<'a'>>().toEqualTypeOf<any>()
    expectTypeOf<Expect<'a.anything'>>().toEqualTypeOf<unknown>()
    expectTypeOf<Expect<`a.${string}`>>().toEqualTypeOf<unknown>()
    expectTypeOf<Expect<'b'>>().toEqualTypeOf<number>()
    expectTypeOf<Expect<'obj'>>().toEqualTypeOf<{ c: any; d: number }>()
    expectTypeOf<Expect<'obj.c'>>().toEqualTypeOf<any>()
    expectTypeOf<Expect<'obj.c.anything'>>().toEqualTypeOf<unknown>()
    expectTypeOf<Expect<`obj.c.${string}`>>().toEqualTypeOf<unknown>()
    expectTypeOf<Expect<'obj.d'>>().toEqualTypeOf<number>()
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

    type Expect<TKey extends string> = DeepValue<RecordExample, TKey>

    expectTypeOf<Expect<'records'>>().toEqualTypeOf<Record<string, Value>>()
    expectTypeOf<Expect<'records.foo'>>().toEqualTypeOf<Value>()
    expectTypeOf<Expect<'records.foo.a'>>().toEqualTypeOf<string>()
    expectTypeOf<Expect<'records.foo.b'>>().toEqualTypeOf<number>()
    expectTypeOf<Expect<'records.foo.c'>>().toEqualTypeOf<{ d: string }>()
    expectTypeOf<Expect<'records.foo.c.d'>>().toEqualTypeOf<string>()
    expectTypeOf<Expect<`records.${string}`>>().toEqualTypeOf<Value>()
    expectTypeOf<Expect<`records.${string}.a`>>().toEqualTypeOf<string>()
    expectTypeOf<Expect<`records.${string}.b`>>().toEqualTypeOf<number>()
    expectTypeOf<Expect<`records.${string}.c`>>().toEqualTypeOf<{ d: string }>()
    expectTypeOf<Expect<`records.${string}.c.d`>>().toEqualTypeOf<string>()
  })
})

describe('DeepKeysWhereValueIncludes', () => {
  it('should allow unions to pass', () => {
    type Example = {
      foo: Array<{ bar: string }> | null | undefined
      bar: Array<{ bar: string }> | string | number
      foobar: Array<{ bar: string } | { different: string }>
    }

    type ExpectedKeys =
      | 'foo'
      | `foo[${number}]`
      | `foo[${number}].bar`
      | 'bar'
      | `bar[${number}]`
      | `bar[${number}].bar`
      | 'foobar'
      | `foobar[${number}]`
      | `foobar[${number}].bar`
      | `foobar[${number}].different`

    expectTypeOf<DeepKeys<Example>>().toEqualTypeOf<ExpectedKeys>()

    expectTypeOf<
      DeepKeysWhereValueIncludes<Example, Array<any>>
    >().toEqualTypeOf<'foo' | 'bar' | 'foobar'>()
  })

  it('should match readonly arrays', () => {
    type Example = {
      mutable: Array<string>
      readonly: ReadonlyArray<number>
      tuple: readonly [boolean]
      value: string
    }

    expectTypeOf<
      DeepKeysWhereValueIncludes<Example, ReadonlyArray<any>>
    >().toEqualTypeOf<'mutable' | 'readonly' | 'tuple'>()
  })
})

describe('TryGetArrayElementType', () => {
  it('should infer elements from mutable and readonly arrays', () => {
    expectTypeOf<
      TryGetArrayElementType<Array<string>>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      TryGetArrayElementType<ReadonlyArray<number>>
    >().toEqualTypeOf<number>()
    expectTypeOf<
      TryGetArrayElementType<readonly [boolean]>
    >().toEqualTypeOf<boolean>()
  })
})
