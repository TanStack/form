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

export interface AnyDeepKeyAndValue<
  K extends string = string,
  V extends any = any,
  P extends unknown[] = unknown[],
> {
  key: K
  value: V
  priority: P
}

export type ArrayAccessor<TParent extends AnyDeepKeyAndValue> =
  `${TParent['key'] extends never ? '' : TParent['key']}[${number}]`

export interface ArrayDeepKeyAndValue<
  in out TParent extends AnyDeepKeyAndValue,
  in out T extends ReadonlyArray<any>,
  in out TPriority extends unknown[],
> extends AnyDeepKeyAndValue {
  key: ArrayAccessor<TParent>
  value: T[number] | Nullable<TParent['value']>
  priority: TPriority
}

export type DeepKeyAndValueArray<
  TParent extends AnyDeepKeyAndValue,
  T extends ReadonlyArray<any>,
  TAcc,
  TPriority extends unknown[],
> = DeepKeysAndValuesImpl<
  NonNullable<T[number]>,
  ArrayDeepKeyAndValue<TParent, T, TPriority>,
  TAcc | ArrayDeepKeyAndValue<TParent, T, TPriority>
>

export type TupleAccessor<
  TParent extends AnyDeepKeyAndValue,
  TKey extends string,
> = `${TParent['key'] extends never ? '' : TParent['key']}[${TKey}]`

export interface TupleDeepKeyAndValue<
  in out TParent extends AnyDeepKeyAndValue,
  in out T,
  in out TKey extends AllTupleKeys<T>,
  in out TPriority extends unknown[],
> extends AnyDeepKeyAndValue {
  key: TupleAccessor<TParent, TKey>
  value: T[TKey] | Nullable<TParent['value']>
  priority: TPriority
}

export type AllTupleKeys<T> = T extends any ? keyof T & `${number}` : never

export type DeepKeyAndValueTuple<
  TParent extends AnyDeepKeyAndValue,
  T extends ReadonlyArray<any>,
  TAcc,
  TPriority extends unknown[],
  TAllKeys extends AllTupleKeys<T> = AllTupleKeys<T>,
> = TAllKeys extends any
  ? DeepKeysAndValuesImpl<
      NonNullable<T[TAllKeys]>,
      TupleDeepKeyAndValue<TParent, T, TAllKeys, TPriority>,
      TAcc | TupleDeepKeyAndValue<TParent, T, TAllKeys, TPriority>
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

export type ObjectValue<
  TParent extends AnyDeepKeyAndValue,
  T,
  TKey extends AllObjectKeys<T>,
> = T[TKey] | Nullable<TParent['value']>

export interface ObjectDeepKeyAndValue<
  in out TParent extends AnyDeepKeyAndValue,
  in out T,
  in out TKey extends AllObjectKeys<T>,
  in out TPriority extends unknown[],
> extends AnyDeepKeyAndValue {
  key: ObjectAccessor<TParent, TKey>
  value: ObjectValue<TParent, T, TKey>
  priority: TPriority
}

export type DeepKeyAndValueObject<
  TParent extends AnyDeepKeyAndValue,
  T,
  TAcc,
  TPriority extends unknown[],
  TAllKeys extends AllObjectKeys<T> = AllObjectKeys<T>,
> = TAllKeys extends any
  ? string extends TAllKeys
    ? DeepKeysAndValuesImpl<
        NonNullable<T[TAllKeys]>,
        ObjectDeepKeyAndValue<TParent, T, TAllKeys, TPriority>,
        TAcc | ObjectDeepKeyAndValue<TParent, T, TAllKeys, TPriority>,
        // children of records risk causing mismatches because they are
        // subtypes of the record parent.
        // `foo.${string}.bar` is also assignable to `foo.${string}`,
        // so we need higher priority for children.
        [...TPriority, unknown]
      >
    : DeepKeysAndValuesImpl<
        NonNullable<T[TAllKeys]>,
        ObjectDeepKeyAndValue<TParent, T, TAllKeys, TPriority>,
        TAcc | ObjectDeepKeyAndValue<TParent, T, TAllKeys, TPriority>,
        TPriority
      >
  : never

export type UnknownAccessor<TParent extends AnyDeepKeyAndValue> =
  TParent['key'] extends never ? string : `${TParent['key']}.${string}`

export interface UnknownDeepKeyAndValue<TParent extends AnyDeepKeyAndValue>
  extends AnyDeepKeyAndValue {
  key: UnknownAccessor<TParent>
  value: unknown
  priority: unknown[]
}

export type DeepKeysAndValues<T> =
  DeepKeysAndValuesImpl<T> extends AnyDeepKeyAndValue
    ? DeepKeysAndValuesImpl<T>
    : never

export type DeepKeysAndValuesImpl<
  T,
  TParent extends AnyDeepKeyAndValue = never,
  TAcc = never,
  TPriority extends unknown[] = [],
> = unknown extends T
  ? TAcc | UnknownDeepKeyAndValue<TParent>
  : unknown extends T // this stops runaway recursion when T is any
    ? T
    : T extends string | number | boolean | bigint | Date
      ? TAcc
      : T extends ReadonlyArray<any>
        ? number extends T['length']
          ? DeepKeyAndValueArray<TParent, T, TAcc, TPriority>
          : DeepKeyAndValueTuple<TParent, T, TAcc, TPriority>
        : keyof T extends never
          ? TAcc | UnknownDeepKeyAndValue<TParent>
          : T extends object
            ? DeepKeyAndValueObject<TParent, T, TAcc, TPriority>
            : TAcc

/**
 * The keys of an object or array, deeply nested.
 */
export type DeepKeys<T> = unknown extends T
  ? string
  : DeepKeysAndValues<T>['key']

type ValueOfKey<TValue extends AnyDeepKeyAndValue, TAccessor extends string> =
  TValue extends AnyDeepKeyAndValue<infer ValueKey>
    ? TAccessor extends ValueKey
      ? TValue
      : never
    : never

type HighestPriority<
  T extends AnyDeepKeyAndValue,
  TAll extends AnyDeepKeyAndValue = T,
> = T extends any
  ? // Check if no other member of the union has a longer element.
    // If the union consists of one member, this will always result in never
    Extract<
      TAll,
      { priority: [...T['priority'], unknown, ...unknown[]] }
    > extends never
    ? T
    : never
  : never

/**
 * Infer the type of a deeply nested property within an object or an array.
 */
export type DeepValue<TValue, TAccessor extends string> = unknown extends TValue
  ? TValue
  : HighestPriority<ValueOfKey<DeepKeysAndValues<TValue>, TAccessor>>['value']

/**
 * The keys of an object or array, deeply nested and only with a value of TValue
 */
export type DeepKeysOfType<TData, TValue> = Extract<
  DeepKeysAndValues<TData>,
  AnyDeepKeyAndValue<string, TValue>
>['key']

/**
 * Maps the deep keys of TFormData to the shallow keys of TFieldGroupData.
 *  Since using template strings as keys is impractical, it relies on shallow keys only.
 */
export type FieldsMap<TFormData, TFieldGroupData> =
  TFieldGroupData extends any[]
    ? never
    : string extends keyof TFieldGroupData
      ? never
      : {
          [K in keyof TFieldGroupData]: DeepKeysOfType<
            TFormData,
            TFieldGroupData[K]
          >
        }
