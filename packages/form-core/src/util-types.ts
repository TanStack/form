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

export interface AnyDeepKeyAndValue {
  key: string
  value: any
}

export type ArrayAccessor<TParent extends AnyDeepKeyAndValue> =
  `${TParent['key'] extends never ? '' : TParent['key']}[${number}]`

export interface ArrayDeepKeyAndValue<
  in out TParent extends AnyDeepKeyAndValue,
  in out T extends ReadonlyArray<any>,
> {
  key: ArrayAccessor<TParent>
  value: T[number] | Nullable<TParent['value']>
}

export type DeepKeyAndValueArray<
  TParent extends AnyDeepKeyAndValue,
  T extends ReadonlyArray<any>,
  TAcc,
> = DeepKeysAndValues<
  NonNullable<T[number]>,
  ArrayDeepKeyAndValue<TParent, T>,
  TAcc | ArrayDeepKeyAndValue<TParent, T>
>

export type TupleAccessor<
  TParent extends AnyDeepKeyAndValue,
  TKey extends string,
> = `${TParent['key'] extends never ? '' : TParent['key']}[${TKey}]`

export interface TupleDeepKeyAndValue<
  in out TParent extends AnyDeepKeyAndValue,
  in out T,
  in out TKey extends AllTupleKeys<T>,
> {
  key: TupleAccessor<TParent, TKey>
  value: T[TKey] | Nullable<TParent['value']>
}

export type AllTupleKeys<T> = T extends any ? keyof T & `${number}` : never

export type DeepKeyAndValueTuple<
  TParent extends AnyDeepKeyAndValue,
  T extends ReadonlyArray<any>,
  TAcc,
  TAllKeys extends AllTupleKeys<T> = AllTupleKeys<T>,
> = TAllKeys extends any
  ? DeepKeysAndValues<
      NonNullable<T[TAllKeys]>,
      TupleDeepKeyAndValue<TParent, T, TAllKeys>,
      TAcc | TupleDeepKeyAndValue<TParent, T, TAllKeys>
    >
  : never

export type AllObjectKeys<T> = T extends any
  ? keyof T & (string | number)
  : never

export type ObjectAccessor<
  TParent extends AnyDeepKeyAndValue,
  TKey extends string | number,
> = TParent['key'] extends never ? `${TKey}` : `${TParent['key']}.${TKey}`

export type Nullable<T> = T & (undefined | null)

export interface ObjectDeepKeyAndValue<
  in out TParent extends AnyDeepKeyAndValue,
  in out T,
  in out TKey extends AllObjectKeys<T>,
> {
  key: ObjectAccessor<TParent, TKey>
  value: T[TKey] | Nullable<TParent['value']>
}

export type DeepKeyAndValueObject<
  TParent extends AnyDeepKeyAndValue,
  T,
  TAcc,
  TAllKeys extends AllObjectKeys<T> = AllObjectKeys<T>,
> = TAllKeys extends any
  ? DeepKeysAndValues<
      NonNullable<T[TAllKeys]>,
      ObjectDeepKeyAndValue<TParent, T, TAllKeys>,
      TAcc | ObjectDeepKeyAndValue<TParent, T, TAllKeys>
    >
  : never

export type UnknownAccessor<TParent extends AnyDeepKeyAndValue> =
  TParent['key'] extends never ? string : `${TParent['key']}.${string}`

export interface UnknownDeepKeyAndValue<TParent extends AnyDeepKeyAndValue> {
  key: UnknownAccessor<TParent>
  value: unknown
}

export type DeepKeysAndValues<
  T,
  TParent extends AnyDeepKeyAndValue = never,
  TAcc = never,
> = unknown extends T
  ? TAcc | UnknownDeepKeyAndValue<TParent>
  : unknown extends T // this stops runaway recursion when T is any
    ? T
    : T extends string | number | boolean | bigint | Date
      ? TAcc
      : T extends ReadonlyArray<any>
        ? number extends T['length']
          ? DeepKeyAndValueArray<TParent, T, TAcc>
          : DeepKeyAndValueTuple<TParent, T, TAcc>
        : keyof T extends never
          ? TAcc | UnknownDeepKeyAndValue<TParent>
          : T extends object
            ? DeepKeyAndValueObject<TParent, T, TAcc>
            : TAcc

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
