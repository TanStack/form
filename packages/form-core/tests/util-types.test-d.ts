import { expectTypeOf } from 'vitest'
import type { DeepKeys, DeepValue } from '../src/index'

/**
 * Properly recognizes that `0` is not an object and should not have subkeys
 */
type TupleSupport = DeepKeys<{ topUsers: [User, 0, User] }>
expectTypeOf(0 as never as TupleSupport).toEqualTypeOf<
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

/**
 * Properly recognizes that a normal number index won't cut it and should be `[number]` prefixed instead
 */
type ArraySupport = DeepKeys<{ users: User[] }>
expectTypeOf(0 as never as ArraySupport).toEqualTypeOf<
  | 'users'
  | `users[${number}]`
  | `users[${number}].name`
  | `users[${number}].id`
  | `users[${number}].age`
>()

/**
 * Properly handles deep object nesting like so:
 */
type NestedSupport = DeepKeys<{ meta: { mainUser: User } }>
expectTypeOf(0 as never as NestedSupport).toEqualTypeOf<
  | 'meta'
  | 'meta.mainUser'
  | 'meta.mainUser.name'
  | 'meta.mainUser.id'
  | 'meta.mainUser.age'
>()

/**
 * Properly handles deep partial object nesting like so:
 */
type NestedPartialSupport = DeepKeys<{ meta?: { mainUser?: User } }>
expectTypeOf(0 as never as NestedPartialSupport).toEqualTypeOf<
  | 'meta'
  | 'meta.mainUser'
  | 'meta.mainUser.name'
  | 'meta.mainUser.id'
  | 'meta.mainUser.age'
>()

/**
 * Properly handles `object` edgecase nesting like so:
 */
type ObjectNestedEdgecase = DeepKeys<{ meta: { mainUser: object } }>
expectTypeOf(0 as never as ObjectNestedEdgecase).toEqualTypeOf(
  0 as never as 'meta' | 'meta.mainUser' | `meta.mainUser.${string}`,
)

/**
 * Properly handles `object` edgecase like so:
 */
type ObjectEdgecase = DeepKeys<object>
expectTypeOf(0 as never as ObjectEdgecase).toEqualTypeOf<string>()

/**
 * Properly handles `object` edgecase nesting like so:
 */
type UnknownNestedEdgecase = DeepKeys<{ meta: { mainUser: unknown } }>
expectTypeOf(
  0 as never as 'meta' | 'meta.mainUser' | `meta.mainUser.${string}`,
).toEqualTypeOf(0 as never as UnknownNestedEdgecase)

/**
 * Properly handles discriminated unions like so:
 */
type DiscriminatedUnion = { name: string } & (
  | { variant: 'foo' }
  | { variant: 'bar'; baz: boolean }
)
type DiscriminatedUnionKeys = DeepKeys<DiscriminatedUnion>
expectTypeOf(0 as never as DiscriminatedUnionKeys).toEqualTypeOf<
  'name' | 'variant' | 'baz'
>()

type DiscriminatedUnionValueShared = DeepValue<DiscriminatedUnion, 'variant'>
expectTypeOf(0 as never as DiscriminatedUnionValueShared).toEqualTypeOf<
  'foo' | 'bar'
>()
type DiscriminatedUnionValueFixed = DeepValue<DiscriminatedUnion, 'baz'>
expectTypeOf(
  0 as never as DiscriminatedUnionValueFixed,
).toEqualTypeOf<boolean>()

/**
 * Properly handles `object` edgecase like so:
 */
type UnknownEdgecase = DeepKeys<unknown>
expectTypeOf(0 as never as UnknownEdgecase).toEqualTypeOf<string>()

type NestedKeysExample = DeepValue<
  { meta: { mainUser: User } },
  'meta.mainUser.age'
>
expectTypeOf(0 as never as NestedKeysExample).toEqualTypeOf<number>()

type NestedNullableObjectCase = {
  null: { mainUser: 'name' } | null
  undefined: { mainUser: 'name' } | undefined
  optional?: { mainUser: 'name' }
  mixed: { mainUser: 'name' } | null | undefined
}

type NestedNullableObjectCaseNull = DeepValue<
  NestedNullableObjectCase,
  'null.mainUser'
>
expectTypeOf(0 as never as NestedNullableObjectCaseNull).toEqualTypeOf<
  'name' | null
>()
type NestedNullableObjectCaseUndefined = DeepValue<
  NestedNullableObjectCase,
  'undefined.mainUser'
>
expectTypeOf(0 as never as NestedNullableObjectCaseUndefined).toEqualTypeOf<
  'name' | undefined
>()
type NestedNullableObjectCaseOptional = DeepValue<
  NestedNullableObjectCase,
  'undefined.mainUser'
>
expectTypeOf(0 as never as NestedNullableObjectCaseOptional).toEqualTypeOf<
  'name' | undefined
>()
type NestedNullableObjectCaseMixed = DeepValue<
  NestedNullableObjectCase,
  'mixed.mainUser'
>
expectTypeOf(0 as never as 'name' | null | undefined).toEqualTypeOf(
  0 as never as NestedNullableObjectCaseMixed,
)

type DoubleNestedNullableObjectCase = {
  mixed?: { mainUser: { name: 'name' } } | null | undefined
}
type DoubleNestedNullableObjectA = DeepValue<
  DoubleNestedNullableObjectCase,
  'mixed.mainUser'
>
expectTypeOf(0 as never as { name: 'name' } | null | undefined).toEqualTypeOf(
  0 as never as DoubleNestedNullableObjectA,
)
type DoubleNestedNullableObjectB = DeepValue<
  DoubleNestedNullableObjectCase,
  'mixed.mainUser.name'
>
expectTypeOf(0 as never as DoubleNestedNullableObjectB).toEqualTypeOf<
  'name' | null | undefined
>()

type NestedObjectUnionCase = {
  normal:
    | { a: User }
    | { a: string }
    | { b: string }
    | { c: { user: User } | { user: number } }
}
type NestedObjectUnionA = DeepValue<NestedObjectUnionCase, 'normal.a.age'>
expectTypeOf(0 as never as NestedObjectUnionA).toEqualTypeOf<number>()
type NestedObjectUnionB = DeepValue<NestedObjectUnionCase, 'normal.b'>
expectTypeOf(0 as never as NestedObjectUnionB).toEqualTypeOf<string>()
type NestedObjectUnionC = DeepValue<NestedObjectUnionCase, 'normal.c.user.id'>
expectTypeOf(0 as never as NestedObjectUnionC).toEqualTypeOf<string>()

type NestedNullableObjectUnionCase = {
  nullable:
    | { a?: number; b?: { c: boolean } | null }
    | { b?: { c: string; e: number } }
}
type NestedNullableObjectUnionA = DeepValue<
  NestedNullableObjectUnionCase,
  'nullable.a'
>
expectTypeOf(0 as never as NestedNullableObjectUnionA).toEqualTypeOf<
  number | undefined
>()
type NestedNullableObjectUnionB = DeepValue<
  NestedNullableObjectUnionCase,
  'nullable.b.c'
>
expectTypeOf(0 as never as string | boolean | null | undefined).toEqualTypeOf(
  0 as never as NestedNullableObjectUnionB,
)
type NestedNullableObjectUnionC = DeepValue<
  NestedNullableObjectUnionCase,
  'nullable.b.e'
>
expectTypeOf(0 as never as NestedNullableObjectUnionC).toEqualTypeOf<
  number | null | undefined
>()

type NestedArrayExample = DeepValue<{ users: User[] }, 'users[0].age'>
expectTypeOf(0 as never as NestedArrayExample).toEqualTypeOf<number>()

type NestedLooseArrayExample = DeepValue<{ users: User[] }, 'users[number].age'>
expectTypeOf(0 as never as NestedLooseArrayExample).toEqualTypeOf<number>()

type NestedArrayUnionExample = DeepValue<
  { users: string | User[] },
  'users[0].age'
>
expectTypeOf(0 as never as NestedArrayUnionExample).toEqualTypeOf<number>()

type NestedTupleExample = DeepValue<
  { topUsers: [User, 0, User] },
  'topUsers[0].age'
>
expectTypeOf(0 as never as NestedTupleExample).toEqualTypeOf<number>()

type NestedTupleBroadExample = DeepValue<
  { topUsers: User[] },
  `topUsers[${number}].age`
>
expectTypeOf(0 as never as NestedTupleBroadExample).toEqualTypeOf<number>()

type DeeplyNestedTupleBroadExample = DeepValue<
  { nested: { topUsers: User[] } },
  `nested.topUsers[${number}].age`
>
expectTypeOf(
  0 as never as DeeplyNestedTupleBroadExample,
).toEqualTypeOf<number>()

type SimpleArrayExample = DeepValue<User[], `[${number}]`>
expectTypeOf(0 as never as SimpleArrayExample).toEqualTypeOf<User>()

type SimpleNestedArrayExample = DeepValue<User[], `[${number}].age`>
expectTypeOf(0 as never as SimpleNestedArrayExample).toEqualTypeOf<number>()

type NestedTupleItemExample = DeepValue<
  { topUsers: [User, 0, User] },
  'topUsers[1]'
>
expectTypeOf(0 as never as NestedTupleItemExample).toEqualTypeOf<0>()

type ArrayExample = DeepValue<[1, 2, 3], '[1]'>
expectTypeOf(0 as never as ArrayExample).toEqualTypeOf<2>()

type NonNestedObjExample = DeepValue<{ a: 1 }, 'a'>
expectTypeOf(0 as never as NonNestedObjExample).toEqualTypeOf<1>()

interface User {
  name: string
  id: string
  age: number
}

type FormDefinition = {
  nested: {
    people: User[]
  }
}

type FormDefinitionValue = DeepValue<
  FormDefinition,
  `nested.people[${number}].name`
>

expectTypeOf(0 as never as FormDefinitionValue).toEqualTypeOf<string>()

type DoubleDeepArray = DeepValue<
  {
    people: {
      parents: {
        name: string
        age: number
      }[]
    }[]
  },
  `people[${0}].parents[${0}].name`
>

expectTypeOf(0 as never as DoubleDeepArray).toEqualTypeOf<string>()

// Deepness is infinite error check
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
