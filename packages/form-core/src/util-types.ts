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

export interface DeepKeyAndValue<in out TKey, in out TValue> {
  key: TKey
  value: TValue
}

export type AnyDeepKeyAndValue = DeepKeyAndValue<any, any>

export type ArrayAccessor<TPrefix extends string> = `${TPrefix}[${number}]`

export type DeepKeyAndValueArray<
  T extends ReadonlyArray<any>,
  TPrefix extends string,
  TNullable,
> =
  | DeepKeyAndValue<ArrayAccessor<TPrefix>, T[number]>
  | DeepKeysAndValues<T[number], ArrayAccessor<TPrefix>, TNullable>

export type TupleAccessor<
  TPrefix extends string,
  TKey extends string,
> = `${TPrefix}[${TKey}]`

export type AllTupleKeys<T> = T extends any ? keyof T & `${number}` : never

export type DeepKeyAndValueTuple<
  T extends ReadonlyArray<any>,
  TPrefix extends string,
  TNullable,
  TAllKeys extends AllTupleKeys<T> = AllTupleKeys<T>,
> = TAllKeys extends any
  ?
      | DeepKeyAndValue<TupleAccessor<TPrefix, TAllKeys>, T[TAllKeys]>
      | DeepKeysAndValues<
          NonNullable<T[TAllKeys]>,
          TupleAccessor<TPrefix, TAllKeys>,
          TNullable | Nullable<T[TAllKeys]>
        >
  : never

export type AllObjectKeys<T> = T extends any
  ? keyof T & (string | number)
  : never

export type ObjectAccessor<
  TPrefix extends string,
  TKey extends string | number,
> = TPrefix extends '' ? `${TKey}` : `${TPrefix}.${TKey}`

export type Nullable<T> = T & (undefined | null)

export type DeepKeyAndValueObject<
  T,
  TPrefix extends string,
  TNullable,
  TAllKeys extends AllObjectKeys<T> = AllObjectKeys<T>,
> = TAllKeys extends any
  ?
      | DeepKeyAndValue<
          ObjectAccessor<TPrefix, TAllKeys>,
          T[TAllKeys] | TNullable
        >
      | DeepKeysAndValues<
          NonNullable<T[TAllKeys]>,
          ObjectAccessor<TPrefix, TAllKeys>,
          TNullable | Nullable<T[TAllKeys]>
        >
  : never

export type UnknownAccessor<TPrefix extends string> = TPrefix extends ''
  ? string
  : `${TPrefix}.${string}`

export type DeepKeyAndValueUnknown<TPrefix extends string> = DeepKeyAndValue<
  UnknownAccessor<TPrefix>,
  unknown
>

export type DeepKeysAndValues<
  T,
  TPrefix extends string = '',
  TNullable = Nullable<T>,
> =
  IsAny<T> extends true
    ? T
    : T extends string | number | boolean | bigint | Date
      ? never
      : T extends ReadonlyArray<any>
        ? number extends T['length']
          ? DeepKeyAndValueArray<T, TPrefix, TNullable>
          : DeepKeyAndValueTuple<T, TPrefix, TNullable>
        : keyof T extends never
          ? DeepKeyAndValueUnknown<TPrefix>
          : T extends object
            ? DeepKeyAndValueObject<T, TPrefix, TNullable>
            : never

export type DeepRecord<T> = {
  [TRecord in DeepKeysAndValues<T> extends AnyDeepKeyAndValue
    ? DeepKeysAndValues<T>
    : never as TRecord['key']]: TRecord['value']
}

/**
 * The keys of an object or array, deeply nested.
 */
export type DeepKeys<T> = unknown extends T
  ? string
  : DeepKeysAndValues<T> extends AnyDeepKeyAndValue
    ? DeepKeysAndValues<T>['key']
    : never

/**
 * Infer the type of a deeply nested property within an object or an array.
 */
export type DeepValue<TValue, TAccessor> =
  DeepRecord<TValue> extends infer TDeepRecord
    ? TAccessor extends keyof TDeepRecord
      ? TDeepRecord[TAccessor]
      : never
    : never
