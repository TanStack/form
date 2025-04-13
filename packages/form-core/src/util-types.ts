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

export type ArrayAccessor<TPrefix extends string> = `${TPrefix}[${number}]`

export type DeepRecordArrayUnion<
  T extends ReadonlyArray<any>,
  TPrefix extends string,
  TAcc,
  TNullable,
> = DeepRecordUnion<
  T[number],
  ArrayAccessor<TPrefix>,
  TAcc | Record<ArrayAccessor<TPrefix>, T[number]>,
  TNullable
>

export type TupleAccessor<
  TPrefix extends string,
  TKey,
> = `${TPrefix}[${TKey & string}]`

export type AllTupleKeys<T> = T extends any ? keyof T & `${number}` : never

export type DeepRecordTupleUnion<
  T extends ReadonlyArray<any>,
  TPrefix extends string,
  TAcc,
  TNullable,
  TAllKeys extends AllTupleKeys<T> = AllTupleKeys<T>,
> = TAllKeys extends any
  ? DeepRecordUnion<
      NonNullable<T[TAllKeys]>,
      TupleAccessor<TPrefix, TAllKeys>,
      TAcc | Record<TupleAccessor<TPrefix, TAllKeys>, T[TAllKeys]>,
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

export type DeepRecordObjectUnion<
  T,
  TPrefix extends string,
  TAcc,
  TNullable,
  TAllKeys extends AllObjectKeys<T> = AllObjectKeys<T>,
> = TAllKeys extends any
  ? DeepRecordUnion<
      NonNullable<T[TAllKeys]>,
      ObjectAccessor<TPrefix, TAllKeys>,
      TAcc | Record<ObjectAccessor<TPrefix, TAllKeys>, T[TAllKeys] | TNullable>,
      Nullable<TNullable | T[TAllKeys]>
    >
  : never

export type UnknownAccessor<TPrefix extends string> = TPrefix extends ''
  ? string
  : `${TPrefix}.${string}`

export type DeepRecordUnknownUnion<TPrefix extends string, TAcc> =
  | TAcc
  | Record<UnknownAccessor<TPrefix>, unknown>

export type DeepRecordUnion<
  T,
  TPrefix extends string = '',
  TAcc = never,
  TNullable = Nullable<T>,
> =
  IsAny<T> extends true
    ? T
    : T extends string | number | boolean | bigint | Date
      ? TAcc
      : T extends ReadonlyArray<any>
        ? number extends T['length']
          ? DeepRecordArrayUnion<T, TPrefix, TAcc, TNullable>
          : DeepRecordTupleUnion<T, TPrefix, TAcc, TNullable>
        : keyof T extends never
          ? DeepRecordUnknownUnion<TPrefix, TAcc>
          : T extends object
            ? DeepRecordObjectUnion<T, TPrefix, TAcc, TNullable>
            : TAcc

export type DeepRecord<T> = {
  [TRecord in DeepRecordUnion<T> as keyof TRecord]: TRecord[keyof TRecord]
}

type UnionKeys<T> = T extends any ? keyof T : never

/**
 * The keys of an object or array, deeply nested.
 */
export type DeepKeys<T> = unknown extends T
  ? string
  : UnionKeys<DeepRecordUnion<T>> & string

/**
 * Infer the type of a deeply nested property within an object or an array.
 */
export type DeepValue<TValue, TAccessor> =
  DeepRecord<TValue> extends infer TDeepRecord
    ? TAccessor extends keyof TDeepRecord
      ? TDeepRecord[TAccessor]
      : never
    : never
