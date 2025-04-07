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
> = DeepRecordUnion<
  T[number],
  ArrayAccessor<TPrefix>,
  TAcc | Record<ArrayAccessor<TPrefix>, T[number]>
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
  TAllKeys extends AllTupleKeys<T> = AllTupleKeys<T>,
> = TAllKeys extends any
  ? DeepRecordUnion<
      T[TAllKeys],
      TupleAccessor<TPrefix, TAllKeys>,
      TAcc | Record<TupleAccessor<TPrefix, TAllKeys>, T[TAllKeys]>
    >
  : never

export type AllObjectKeys<T> = T extends any
  ? keyof T & (string | number)
  : never

export type ObjectAccessor<
  TPrefix extends string,
  TKey extends string | number,
> = TPrefix extends '' ? `${TKey}` : `${TPrefix}.${TKey}`

export type DeepRecordObjectUnion<
  T,
  TPrefix extends string,
  TAcc,
  TAllKeys extends AllObjectKeys<T> = AllObjectKeys<T>,
> = TAllKeys extends any
  ? DeepRecordUnion<
      T[TAllKeys],
      ObjectAccessor<TPrefix, TAllKeys>,
      TAcc | Record<ObjectAccessor<TPrefix, TAllKeys>, T[TAllKeys]>
    >
  : never

export type DeepRecordUnion<T, TPrefix extends string = '', TAcc = never> =
  IsAny<T> extends true
    ? T
    : T extends string | number | boolean | bigint | Date
      ? TAcc
      : T extends ReadonlyArray<any>
        ? number extends T['length']
          ? DeepRecordArrayUnion<T, TPrefix, TAcc>
          : DeepRecordTupleUnion<T, TPrefix, TAcc>
        : T extends object
          ? DeepRecordObjectUnion<T, TPrefix, TAcc>
          : TAcc

export type UnionToIntersection<T> = (
  T extends any ? (param: T) => any : never
) extends (param: infer TI) => any
  ? TI
  : never

export type DeepRecord<T> = UnionToIntersection<DeepRecordUnion<T>>

/**
 * The keys of an object or array, deeply nested.
 */
export type DeepKeys<T> = unknown extends T
  ? string
  : keyof DeepRecord<T> & string

/**
 * Infer the type of a deeply nested property within an object or an array.
 */
export type DeepValue<TValue, TAccessor> = DeepRecord<TValue>[TAccessor &
  keyof DeepRecord<TValue>]
