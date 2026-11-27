import type { BuiltInType } from './utils.public'

interface AnyDeepKeyAndValue<
  in out TKey extends string = string,
  in out TValue extends any = any,
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
  ValueForKey<T, TKey> | UndefinedForMissingKey<T, TKey> | UndefinedIfNullish<T>

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
  in out TParent extends AnyDeepKeyAndValue,
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
  `${TPrefix}.${string}` | `${TPrefix}[${string}`

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
 * Constructs a union of field paths, including parent fields and subfields.
 *
 * Object properties use dot notation. Array elements use bracket notation.
 * Array indices and record keys can vary. Tuples use their known indices.
 *
 * An `any` or `unknown` input resolves to `string`.
 *
 * @remarks
 * **Important:** The library exports this type to support its type declarations.
 * Use the form and field APIs instead of using this type directly.
 *
 * @typeParam T - Library-managed. Do not specify explicitly.
 */
export type DeepKeys<T> = unknown extends T
  ? string
  : DeepKeysAndValues<T>['key']

/**
 * Resolves the value type at a field path in `TValue`.
 *
 * The result includes `undefined` when a parent can be `null` or `undefined`,
 * or a property is absent from a union member.
 *
 * For `any` or `unknown`, the result preserves `TValue`.
 * Otherwise, a path outside {@link DeepKeys} resolves to `never`.
 *
 * @remarks
 * **Important:** The library exports this type to support its type declarations.
 * Use the form and field APIs instead of using this type directly.
 *
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 * @typeParam TAccessor - Library-managed. Do not specify explicitly.
 */
export type DeepValue<TValue, TAccessor extends string> = unknown extends TValue
  ? TValue
  : // For some reason, this "unnecessary" check reduces instantiations.
    // Probably due to TS caching or the like? Fine by us!
    TAccessor extends DeepKeys<TValue>
    ? DeepValueImpl<TValue, TAccessor>
    : never

/**
 * Selects field paths by matching their value types against `TValue`.
 *
 * The type removes `null` and `undefined` from each field's value type.
 * A path matches if at least one remaining union member is assignable to
 * `TValue`.
 *
 * @remarks
 * **Important:** The library exports this type to support its type declarations.
 * Use the form and field APIs instead of using this type directly.
 *
 * @typeParam TData - Library-managed. Do not specify explicitly.
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 */
export type DeepKeysWhereValueIncludes<TData, TValue> =
  DeepKeysAndValues<TData> extends infer TDeepKeyAndValue
    ? TDeepKeyAndValue extends AnyDeepKeyAndValue
      ? Extract<NonNullable<TDeepKeyAndValue['value']>, TValue> extends never
        ? never
        : TDeepKeyAndValue['key']
      : never
    : never

/**
 * Extracts the element types from mutable or readonly arrays and tuples.
 *
 * Non-array union members are ignored. If no union member is an array, the
 * result is `never`.
 *
 * @remarks
 * **Important:** The library exports this type to support its type declarations.
 * Use the form and field APIs instead of using this type directly.
 *
 * @typeParam TValue - Library-managed. Do not specify explicitly.
 */
export type TryGetArrayElementType<TValue> =
  TValue extends ReadonlyArray<infer TElement> ? TElement : never
