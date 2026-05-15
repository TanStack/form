import { describe, expect, expectTypeOf, it } from 'vitest'
import type { DeepKeys, DeepKeysAndValuesImpl, DeepValue } from '../src/index'

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
})

// type NestedNullableObjectCase = {
//   null: { mainUser: 'name' } | null
//   undefined: { mainUser: 'name' } | undefined
//   optional?: { mainUser: 'name' }
//   mixed: { mainUser: 'name' } | null | undefined
// }

// type NestedNullableObjectCaseNull = DeepValue<
//   NestedNullableObjectCase,
//   'null.mainUser'
// >
// expectTypeOf(0 as never as NestedNullableObjectCaseNull).toEqualTypeOf<
//   'name' | null
// >()
// type NestedNullableObjectCaseUndefined = DeepValue<
//   NestedNullableObjectCase,
//   'undefined.mainUser'
// >
// expectTypeOf(0 as never as NestedNullableObjectCaseUndefined).toEqualTypeOf<
//   'name' | undefined
// >()
// type NestedNullableObjectCaseOptional = DeepValue<
//   NestedNullableObjectCase,
//   'undefined.mainUser'
// >
// expectTypeOf(0 as never as NestedNullableObjectCaseOptional).toEqualTypeOf<
//   'name' | undefined
// >()
// type NestedNullableObjectCaseMixed = DeepValue<
//   NestedNullableObjectCase,
//   'mixed.mainUser'
// >
// expectTypeOf(
//   0 as never as 'name' | null | undefined,
// ).toEqualTypeOf<NestedNullableObjectCaseMixed>()

// type DoubleNestedNullableObjectCase = {
//   mixed?: { mainUser: { name: 'name' } } | null | undefined
// }
// type DoubleNestedNullableObjectA = DeepValue<
//   DoubleNestedNullableObjectCase,
//   'mixed.mainUser'
// >
// expectTypeOf(
//   0 as never as { name: 'name' } | null | undefined,
// ).toEqualTypeOf<DoubleNestedNullableObjectA>()
// type DoubleNestedNullableObjectB = DeepValue<
//   DoubleNestedNullableObjectCase,
//   'mixed.mainUser.name'
// >
// expectTypeOf(0 as never as DoubleNestedNullableObjectB).toEqualTypeOf<
//   'name' | null | undefined
// >()

// type NestedObjectUnionCase = {
//   normal:
//     | { a: User }
//     | { a: string }
//     | { b: string }
//     | { c: { user: User } | { user: number } }
// }
// type NestedObjectUnionA = DeepValue<NestedObjectUnionCase, 'normal.a.age'>
// expectTypeOf(0 as never as NestedObjectUnionA).toEqualTypeOf<number>()
// type NestedObjectUnionB = DeepValue<NestedObjectUnionCase, 'normal.b'>
// expectTypeOf(0 as never as NestedObjectUnionB).toEqualTypeOf<string>()
// type NestedObjectUnionC = DeepValue<NestedObjectUnionCase, 'normal.c.user.id'>
// expectTypeOf(0 as never as NestedObjectUnionC).toEqualTypeOf<string>()

// type NestedNullableObjectUnionCase = {
//   nullable:
//     | { a?: number; b?: { c: boolean } | null }
//     | { b?: { c: string; e: number } }
// }
// type NestedNullableObjectUnionA = DeepValue<
//   NestedNullableObjectUnionCase,
//   'nullable.a'
// >
// expectTypeOf(0 as never as NestedNullableObjectUnionA).toEqualTypeOf<
//   number | undefined
// >()
// type NestedNullableObjectUnionB = DeepValue<
//   NestedNullableObjectUnionCase,
//   'nullable.b.c'
// >
// expectTypeOf(
//   0 as never as string | boolean | null | undefined,
// ).toEqualTypeOf<NestedNullableObjectUnionB>()
// type NestedNullableObjectUnionC = DeepValue<
//   NestedNullableObjectUnionCase,
//   'nullable.b.e'
// >
// expectTypeOf(0 as never as NestedNullableObjectUnionC).toEqualTypeOf<
//   number | undefined
// >()

// type NestedArrayExample = DeepValue<{ users: Array<User> }, 'users[0].age'>
// expectTypeOf(0 as never as NestedArrayExample).toEqualTypeOf<number>()

// type NestedLooseArrayExample = DeepValue<
//   { users: Array<User> },
//   `users[${number}].age`
// >
// expectTypeOf(0 as never as NestedLooseArrayExample).toEqualTypeOf<number>()

// type NestedArrayUnionExample = DeepValue<
//   { users: string | Array<User> },
//   'users[0].age'
// >
// expectTypeOf(0 as never as NestedArrayUnionExample).toEqualTypeOf<number>()

// type NestedTupleExample = DeepValue<
//   { topUsers: [User, 0, User] },
//   'topUsers[0].age'
// >
// expectTypeOf(0 as never as NestedTupleExample).toEqualTypeOf<number>()

// type NestedTupleBroadExample = DeepValue<
//   { topUsers: Array<User> },
//   `topUsers[${number}].age`
// >
// expectTypeOf(0 as never as NestedTupleBroadExample).toEqualTypeOf<number>()

// type DeeplyNestedTupleBroadExample = DeepValue<
//   { nested: { topUsers: Array<User> } },
//   `nested.topUsers[${number}].age`
// >
// expectTypeOf(
//   0 as never as DeeplyNestedTupleBroadExample,
// ).toEqualTypeOf<number>()

// type SimpleArrayExample = DeepValue<Array<User>, `[${number}]`>
// expectTypeOf(0 as never as SimpleArrayExample).toEqualTypeOf<User>()

// type SimpleNestedArrayExample = DeepValue<Array<User>, `[${number}].age`>
// expectTypeOf(0 as never as SimpleNestedArrayExample).toEqualTypeOf<number>()

// type NestedTupleItemExample = DeepValue<
//   { topUsers: [User, 0, User] },
//   'topUsers[1]'
// >
// expectTypeOf<NestedTupleItemExample>().toEqualTypeOf<0>()

// type ArrayExample = DeepValue<[1, 2, 3], '[1]'>
// expectTypeOf(0 as never as ArrayExample).toEqualTypeOf<2>()

// type NonNestedObjExample = DeepValue<{ a: 1 }, 'a'>
// expectTypeOf(0 as never as NonNestedObjExample).toEqualTypeOf<1>()

// type FormDefinition = {
//   nested: {
//     people: Array<User>
//   }
// }

// type FormDefinitionValue = DeepValue<
//   FormDefinition,
//   `nested.people[${number}].name`
// >

// expectTypeOf(0 as never as FormDefinitionValue).toEqualTypeOf<string>()

// type DoubleDeepArray = DeepValue<
//   {
//     people: Array<{
//       parents: Array<{
//         name: string
//         age: number
//       }>
//     }>
//   },
//   `people[${0}].parents[${0}].name`
// >

// expectTypeOf(0 as never as DoubleDeepArray).toEqualTypeOf<string>()

// // Deepness is infinite error check
// type Cart = Array<{
//   id: number
//   product: {
//     id: string
//     description?: string
//     price_internet?: number
//     price_dealer_region?: number
//     price_dealer?: number
//     stock: Array<{
//       id: string
//       quantity: number
//       isChecked: boolean
//     }> | null
//   }
//   quantity: number
//   isChecked: boolean
// }>

// type Payment_types = Array<{
//   id: string
//   title: string
//   name: string
// }>

// type Shipping_methods = Array<{
//   id: string
//   title: string
//   name: string
// }>

// type Userr = {
//   id: string
//   first_name: string | null
//   email: string | null
//   avatar:
//     | string
//     | ({
//         url?: string
//       } & {
//         id: string
//         storage: string
//         filename_disk: string | null
//         filename_original: string | null
//         filename_download: string | null
//         filename_preview: string | null
//         filename_thumbnail: string | null
//         filename_medium: string | null
//         filename_large: string | null
//         filename_huge: string | null
//         filename_icon: string | null
//         filename_icon_large: string | null
//         focal_point_y: number | null
//       })
//     | null
//   // Reference Cart, Payment_types, Shipping_methods
//   cart: Cart | null
//   payment_types: Payment_types | null
//   shipping_methods: Shipping_methods | null
// }

// type UserKeys = DeepValue<Userr, DeepKeys<Userr>>

// type ObjectWithAny = {
//   a: any
//   b: number
//   obj: {
//     c: any
//     d: number
//   }
// }

// expectTypeOf(0 as never as DeepKeys<ObjectWithAny>).toEqualTypeOf<
//   'a' | 'b' | 'obj' | `a.${string}` | 'obj.c' | `obj.c.${string}` | 'obj.d'
// >()

// type AnyObjectExample = DeepValue<ObjectWithAny, 'a'>
// expectTypeOf(0 as never as AnyObjectExample).toEqualTypeOf<any>()
// type AnyObjectExample2 = DeepValue<ObjectWithAny, 'b'>
// expectTypeOf(0 as never as AnyObjectExample2).toEqualTypeOf<number>()
// type AnyObjectExample3 = DeepValue<ObjectWithAny, 'obj'>
// expectTypeOf(0 as never as AnyObjectExample3).toEqualTypeOf<{
//   c: any
//   d: number
// }>
// type AnyObjectExample4 = DeepValue<ObjectWithAny, 'obj.c'>
// expectTypeOf(0 as never as AnyObjectExample4).toEqualTypeOf<any>()
// type AnyObjectExample5 = DeepValue<ObjectWithAny, 'obj.d'>
// expectTypeOf(0 as never as AnyObjectExample5).toEqualTypeOf<number>()
