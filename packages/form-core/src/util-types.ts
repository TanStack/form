/**
 * @private
 */
export type UnwrapOneLevelOfArray<T> = T extends (infer U)[] ? U : T

type Narrowable = string | number | bigint | boolean

type NarrowRaw<A> =
  | (A extends [] ? [] : never)
  | (A extends Narrowable ? A : never)
  | {
      [K in keyof A]: A[K] extends Function ? A[K] : NarrowRaw<A[K]>
    }

type Try<A1, A2, Catch = never> = A1 extends A2 ? A1 : Catch

/**
 * @private
 */
export type Narrow<A> = Try<A, [], NarrowRaw<A>>

type IsAny<T> = 0 extends 1 & T ? true : false

export type DeepKeysAndValuesArray<
  T extends ReadonlyArray<any>,
  TPrefix extends string,
  TNextPrefix extends string = `${TPrefix}[${number}]` | `${TPrefix}[number]`,
> = { [TKey in TNextPrefix]: T[number] } & DeepKeysAndValues<
  T[number],
  TNextPrefix
>

export type TupleAccessor<
  TPrefix extends string,
  TKey,
> = `${TPrefix}[${TKey & string}]`

export type AllTupleKeys<T> = T extends any ? keyof T & `${number}` : never

export type GetValue<T, TKey> = T extends any
  ? TKey extends keyof T
    ? T[TKey]
    : never
  : never

export type FlattenTupleKeys<T, TPrefix extends string> = T extends any
  ? AllTupleKeys<T> extends infer TKey extends AllTupleKeys<T>
    ? TKey extends any
      ? TupleAccessor<TPrefix, TKey> extends infer TAccessor extends string
        ? T[TKey] extends infer TValue
          ? TValue extends any
            ? keyof DeepKeysAndValues<TValue, TAccessor>
            : never
          : never
        : never
      : never
    : never
  : never

export type FlattenTupleValues<T, TKey, TPrefix extends string> = T extends any
  ? AllObjectKeys<T> extends infer TAllKeys extends AllTupleKeys<T>
    ? TAllKeys extends any
      ? TupleAccessor<TPrefix, TAllKeys> extends infer TAccessor extends string
        ? T[TAllKeys] extends infer TValue
          ? TValue extends any
            ? TKey extends keyof DeepKeysAndValues<TValue, TAccessor>
              ? DeepKeysAndValues<TValue, TAccessor>[TKey]
              : never
            : never
          : never
        : never
      : never
    : never
  : never

export type DeepKeysAndValuesTuple<T, TPrefix extends string> = {
  [TKey in AllTupleKeys<T> as TupleAccessor<TPrefix, TKey>]: GetValue<T, TKey>
} & {
  [TKey in FlattenTupleKeys<T, TPrefix>]: FlattenTupleValues<T, TKey, TPrefix>
}

export type ObjectAccessor<
  TPrefix extends string,
  TKey extends string | number,
> = TPrefix extends '' ? `${TKey}` : `${TPrefix}.${TKey}`

export type AllObjectKeys<T> = T extends any
  ? keyof T & (string | number)
  : never

export type FlattenObjectKeys<T, TPrefix extends string> = T extends any
  ? AllObjectKeys<T> extends infer TKey extends AllObjectKeys<T>
    ? TKey extends any
      ? T[TKey] extends infer TValue
        ? TValue extends any
          ? keyof DeepKeysAndValues<TValue, ObjectAccessor<TPrefix, TKey>>
          : never
        : never
      : never
    : never
  : never

export type FlattenObjectValues<T, TKey, TPrefix extends string> = T extends any
  ? AllObjectKeys<T> extends infer TAllKeys extends AllObjectKeys<T>
    ? TAllKeys extends any
      ? ObjectAccessor<TPrefix, TAllKeys> extends infer TAccessor extends string
        ? T[TAllKeys] extends infer TValue
          ? TValue extends any
            ? TKey extends keyof DeepKeysAndValues<TValue, TAccessor>
              ? DeepKeysAndValues<TValue, TAccessor>[TKey]
              : never
            : never
          : never
        : never
      : never
    : never
  : never

export type DeepKeysAndValuesObject<T, TPrefix extends string> = {
  [TKey in AllObjectKeys<T> as ObjectAccessor<TPrefix, TKey>]: GetValue<T, TKey>
} & {
  [TKey in FlattenObjectKeys<T, TPrefix>]: FlattenObjectValues<T, TKey, TPrefix>
}

export type DeepKeysAndValues<T, TPrefix extends string = ''> =
  IsAny<T> extends true
    ? T
    : T extends string | number | boolean | bigint
      ? Record<never, never>
      : T extends ReadonlyArray<any>
        ? number extends T['length']
          ? DeepKeysAndValuesArray<T, TPrefix>
          : DeepKeysAndValuesTuple<T, TPrefix>
        : T extends object
          ? DeepKeysAndValuesObject<T, TPrefix>
          : Record<never, never>

/**
 * The keys of an object or array, deeply nested.
 */
export type DeepKeys<T> = unknown extends T
  ? string
  : keyof DeepKeysAndValues<T> & string

export type ValidateName<T, TName extends string> = ConstrainLiteral<
  TName,
  DeepKeys<T>
>

export type ConstrainLiteral<T, TConstraint, TDefault = TConstraint> =
  | (T & TConstraint)
  | TDefault

/**
 * Infer the type of a deeply nested property within an object or an array.
 */
export type DeepValue<TValue, TAccessor> = DeepKeysAndValues<TValue>[TAccessor &
  keyof DeepKeysAndValues<TValue>]
