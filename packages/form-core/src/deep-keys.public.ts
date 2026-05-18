import type { BuiltInType } from './utils.lib'

interface AnyDeepKeyAndValue<
  TKey extends string = string,
  TValue extends any = any,
> {
  key: TKey
  value: TValue
}

type ObjectPart<T> = T extends object
  ? T extends ReadonlyArray<any>
    ? never
    : T
  : never

type ArrayPart<T> = T extends ReadonlyArray<any> ? T : never

type NullishPart<T> = Extract<T, null | undefined>

type UndefinedIfNullish<T> = [NullishPart<T>] extends [never]
  ? never
  : undefined

type NonNullish<T> = Exclude<T, null | undefined>

type ValueForKey<T, TKey extends string | number> =
  NonNullish<T> extends infer TNonNullish
    ? TNonNullish extends any
      ? TKey extends keyof TNonNullish
        ? TNonNullish[TKey]
        : never
      : never
    : never

type UndefinedForMissingKey<T, TKey extends string | number> =
  NonNullish<T> extends infer TNonNullish
    ? TNonNullish extends any
      ? TKey extends keyof TNonNullish
        ? never
        : undefined
      : never
    : never

type ValueForKeyOrUndefined<T, TKey extends string | number> =
  | ValueForKey<T, TKey>
  | UndefinedForMissingKey<T, TKey>
  | UndefinedIfNullish<T>

type ArrayAccessor<TParent extends AnyDeepKeyAndValue> =
  `${TParent['key'] extends never ? '' : TParent['key']}[${number}]`

interface ArrayDeepKeyAndValue<
  in out TParent extends AnyDeepKeyAndValue,
  in out T extends ReadonlyArray<any>,
> extends AnyDeepKeyAndValue {
  key: ArrayAccessor<TParent>
  value: T[number] | UndefinedIfNullish<TParent['value']>
}

type DeepKeyAndValueArray<
  TParent extends AnyDeepKeyAndValue,
  T extends ReadonlyArray<any>,
  TAcc,
> = DeepKeysAndValuesImpl<
  NonNullable<T[number]>,
  ArrayDeepKeyAndValue<TParent, T>,
  TAcc | ArrayDeepKeyAndValue<TParent, T>
>

type TupleAccessor<
  TParent extends AnyDeepKeyAndValue,
  TKey extends string,
> = `${TParent['key'] extends never ? '' : TParent['key']}[${TKey}]`

interface TupleDeepKeyAndValue<
  in out TParent extends AnyDeepKeyAndValue,
  in out T,
  in out TKey extends AllTupleKeys<T>,
> extends AnyDeepKeyAndValue {
  key: TupleAccessor<TParent, TKey>
  value: T[TKey] | UndefinedIfNullish<TParent['value']>
}

type AllTupleKeys<T> = T extends any ? keyof T & `${number}` : never

type DeepKeyAndValueTuple<
  TParent extends AnyDeepKeyAndValue,
  T extends ReadonlyArray<any>,
  TAcc,
  TAllKeys extends AllTupleKeys<T> = AllTupleKeys<T>,
> = TAllKeys extends any
  ? DeepKeysAndValuesImpl<
      NonNullable<T[TAllKeys]>,
      TupleDeepKeyAndValue<TParent, T, TAllKeys>,
      TAcc | TupleDeepKeyAndValue<TParent, T, TAllKeys>
    >
  : never

type AllObjectKeys<T> = T extends any ? keyof T & (string | number) : never

type ObjectAccessor<
  TParent extends AnyDeepKeyAndValue,
  TKey extends string | number,
> = TParent['key'] extends never ? `${TKey}` : `${TParent['key']}.${TKey}`

type ObjectValue<
  TParent extends AnyDeepKeyAndValue,
  T,
  TKey extends AllObjectKeys<ObjectPart<T>>,
> = ValueForKeyOrUndefined<T, TKey> | UndefinedIfNullish<TParent['value']>

interface ObjectDeepKeyAndValue<
  in out TParent extends AnyDeepKeyAndValue,
  in out T,
  in out TKey extends AllObjectKeys<ObjectPart<T>>,
> extends AnyDeepKeyAndValue {
  key: ObjectAccessor<TParent, TKey>
  value: ObjectValue<TParent, T, TKey>
}

type DeepKeyAndValueObject<
  TParent extends AnyDeepKeyAndValue,
  T,
  TAcc,
  TAllKeys extends AllObjectKeys<ObjectPart<T>> = AllObjectKeys<ObjectPart<T>>,
> = [TAllKeys] extends [never]
  ? TAcc | UnknownDeepKeyAndValue<TParent>
  : TAllKeys extends any
    ? DeepKeysAndValuesImpl<
        NonNullable<ValueForKey<T, TAllKeys>>,
        ObjectDeepKeyAndValue<TParent, T, TAllKeys>,
        TAcc | ObjectDeepKeyAndValue<TParent, T, TAllKeys>
      >
    : never

type UnknownAccessor<TParent extends AnyDeepKeyAndValue> =
  TParent['key'] extends never ? string : `${TParent['key']}.${string}`

interface UnknownDeepKeyAndValue<
  TParent extends AnyDeepKeyAndValue,
> extends AnyDeepKeyAndValue {
  key: UnknownAccessor<TParent>
  value: unknown
}

type DeepKeysAndValues<T> =
  DeepKeysAndValuesImpl<T> extends AnyDeepKeyAndValue
    ? DeepKeysAndValuesImpl<T>
    : never

type DeepKeysAndValuesImpl<
  T,
  TParent extends AnyDeepKeyAndValue = never,
  TAcc = never,
> = [T] extends [never]
  ? TAcc
  : unknown extends T
    ? TAcc | UnknownDeepKeyAndValue<TParent>
    : // If omitted, DeepKeys has an excessive stack when comparing keyof. Likely because of trying to check
      // unknown or any, but I don't know for sure.
      unknown extends T
      ? T
      : [T] extends [BuiltInType]
        ? TAcc
        : [ArrayPart<T>] extends [never]
          ? [ObjectPart<T>] extends [never]
            ? TAcc
            : DeepKeyAndValueObject<TParent, T, TAcc>
          : number extends ArrayPart<T>['length']
            ? DeepKeyAndValueArray<TParent, ArrayPart<T>, TAcc>
            : DeepKeyAndValueTuple<TParent, ArrayPart<T>, TAcc>

type ValueMatchingAccessor<
  TValue extends AnyDeepKeyAndValue,
  TAccessor extends string,
> = TValue extends TValue
  ? TAccessor extends TValue['key']
    ? TValue
    : never
  : never

type MostSpecificKey<TValue extends AnyDeepKeyAndValue> = MostSpecificKeyImpl<
  TValue,
  TValue
>

type LongerPrefix<TPrefix extends string> =
  | `${TPrefix}.${string}`
  | `${TPrefix}[${string}`

type HasLonger<TAll extends AnyDeepKeyAndValue, TName extends string> =
  Extract<TAll, { key: LongerPrefix<TName> }> extends never ? false : true

type MostSpecificKeyImpl<
  TValue extends AnyDeepKeyAndValue,
  TAll extends AnyDeepKeyAndValue,
> = TValue extends TValue
  ? HasLonger<TAll, TValue['key']> extends true
    ? never
    : TValue['value']
  : never

type DeepValueImpl<TValue, TAccessor extends string> = MostSpecificKey<
  ValueMatchingAccessor<DeepKeysAndValues<TValue>, TAccessor>
>

/**
 * The keys of an object or array, deeply nested.
 */
export type DeepKeys<T> = unknown extends T
  ? string
  : DeepKeysAndValues<T>['key']

/**
 * Infer the type of a deeply nested property within an object or an array.
 */
export type DeepValue<TValue, TAccessor extends string> = unknown extends TValue
  ? TValue
  : TAccessor extends DeepKeys<TValue>
    ? DeepValueImpl<TValue, TAccessor>
    : never

export type DeepKeysWhereValueIncludes<TData, TValue> =
  DeepKeysAndValues<TData> extends infer TDeepKeyAndValue
    ? TDeepKeyAndValue extends AnyDeepKeyAndValue
      ? Extract<NonNullable<TDeepKeyAndValue['value']>, TValue> extends never
        ? never
        : TDeepKeyAndValue['key']
      : never
    : never

export type TryGetArrayElementType<TValue> = Extract<TValue, Array<any>>[number]
