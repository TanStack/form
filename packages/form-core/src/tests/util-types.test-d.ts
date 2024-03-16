import { assertType } from 'vitest'
import type { DeepKeys, DeepValue } from '../util-types'

/**
 * Properly recognizes that `0` is not an object and should not have subkeys
 */
type TupleSupport = DeepKeys<{ topUsers: [User, 0, User] }>
assertType<
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
>(0 as never as TupleSupport)

/**
 * Properly recognizes that a normal number index won't cut it and should be `[number]` prefixed instead
 */
type ArraySupport = DeepKeys<{ users: User[] }>
assertType<
  | 'users'
  | `users[${number}].name`
  | `users[${number}].id`
  | `users[${number}].age`
>(0 as never as ArraySupport)

/**
 * Properly handles deep object nesting like so:
 */
type NestedSupport = DeepKeys<{ meta: { mainUser: User } }>
assertType<
  | 'meta'
  | 'meta.mainUser'
  | 'meta.mainUser.name'
  | 'meta.mainUser.id'
  | 'meta.mainUser.age'
>(0 as never as NestedSupport)

/**
 * Properly handles `object` edgecase nesting like so:
 */
type ObjectNestedEdgecase = DeepKeys<{ meta: { mainUser: object } }>
assertType<'meta' | 'meta.mainUser' | `meta.mainUser.${string}`>(
  0 as never as ObjectNestedEdgecase,
)

/**
 * Properly handles `object` edgecase like so:
 */
type ObjectEdgecase = DeepKeys<object>
assertType<string>(0 as never as ObjectEdgecase)

/**
 * Properly handles `object` edgecase nesting like so:
 */
type UnknownNestedEdgecase = DeepKeys<{ meta: { mainUser: unknown } }>
assertType<'meta' | 'meta.mainUser' | `meta.mainUser.${string}`>(
  0 as never as UnknownNestedEdgecase,
)

/**
 * Properly handles `object` edgecase like so:
 */
type UnknownEdgecase = DeepKeys<unknown>
assertType<string>(0 as never as UnknownEdgecase)

type NestedKeysExample = DeepValue<
  { meta: { mainUser: User } },
  'meta.mainUser.age'
>
assertType<number>(0 as never as NestedKeysExample)

type NestedArrayExample = DeepValue<{ users: User[] }, 'users[0].age'>
assertType<number>(0 as never as NestedArrayExample)

type NestedLooseArrayExample = DeepValue<{ users: User[] }, 'users[number].age'>
assertType<number>(0 as never as NestedLooseArrayExample)

type NestedTupleExample = DeepValue<
  { topUsers: [User, 0, User] },
  'topUsers[0].age'
>
assertType<number>(0 as never as NestedTupleExample)

type NestedTupleBroadExample = DeepValue<
  { topUsers: User[] },
  `topUsers[${number}].age`
>
assertType<number>(0 as never as NestedTupleBroadExample)

type DeeplyNestedTupleBroadExample = DeepValue<
  { nested: { topUsers: User[] } },
  `nested.topUsers[${number}].age`
>
assertType<number>(0 as never as DeeplyNestedTupleBroadExample)

type SimpleArrayExample = DeepValue<User[], `[${number}]`>
assertType<User>(0 as never as SimpleArrayExample)

type SimpleNestedArrayExample = DeepValue<User[], `[${number}].age`>
assertType<number>(0 as never as SimpleNestedArrayExample)

type NestedTupleItemExample = DeepValue<
  { topUsers: [User, 0, User] },
  'topUsers[1]'
>
assertType<0>(0 as never as NestedTupleItemExample)

type ArrayExample = DeepValue<[1, 2, 3], '[1]'>
assertType<2>(0 as never as ArrayExample)

type NonNestedObjExample = DeepValue<{ a: 1 }, 'a'>
assertType<1>(0 as never as NonNestedObjExample)

interface User {
  name: string
  id: string
  age: number
}

type FormDefinition = {
  nested: {
    people: {
      name: string
      age: number
    }[]
  }
}

type FormDefinitionValue = DeepValue<
  FormDefinition,
  `nested.people[${number}].name`
>

assertType<string>(0 as never as FormDefinitionValue)
