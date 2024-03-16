export type RequiredByKey<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>

type Narrowable = string | number | bigint | boolean

type NarrowRaw<A> =
  | (A extends [] ? [] : never)
  | (A extends Narrowable ? A : never)
  | {
      [K in keyof A]: A[K] extends Function ? A[K] : NarrowRaw<A[K]>
    }

export type Narrow<A> = Try<A, [], NarrowRaw<A>>

type Try<A1, A2, Catch = never> = A1 extends A2 ? A1 : Catch

// Hack to get TypeScript to show simplified types in error messages
export type Pretty<T> = { [K in keyof T]: T[K] } & {}

type ComputeRange<
  N extends number,
  Result extends Array<unknown> = [],
> = Result['length'] extends N
  ? Result
  : ComputeRange<N, [...Result, Result['length']]>
type Index40 = ComputeRange<40>[number]

// Is this type a tuple?
type IsTuple<T> = T extends readonly any[] & { length: infer Length }
  ? Length extends Index40
    ? T
    : never
  : never

// If this type is a tuple, what indices are allowed?
type AllowedIndexes<
  Tuple extends ReadonlyArray<any>,
  Keys extends number = never,
> = Tuple extends readonly []
  ? Keys
  : Tuple extends readonly [infer _, ...infer Tail]
    ? AllowedIndexes<Tail, Keys | Tail['length']>
    : Keys

type PrefixArrayAccessor<T extends any[], TDepth extends any[]> = {
  [K in keyof T]: `[${number}]${DeepKeys<T[K], TDepth>}`
}[number]

type PrefixTupleAccessor<
  T extends any[],
  TIndex extends number,
  TDepth extends any[],
> = {
  [K in TIndex]: `[${K}]` | `[${K}]${DeepKeys<T[K], TDepth>}`
}[TIndex]

type PrefixObjectAccessor<T extends object, TDepth extends any[]> = {
  [K in keyof T]: K extends string | number
    ?
        | PrefixFromDepth<K, TDepth>
        | `${PrefixFromDepth<K, TDepth>}${DeepKeys<T[K], [TDepth]>}`
    : never
}[keyof T]

export type DeepKeys<T, TDepth extends any[] = []> = TDepth['length'] extends 5
  ? never
  : unknown extends T
    ? PrefixFromDepth<string, TDepth>
    : object extends T
      ? PrefixFromDepth<string, TDepth>
      : T extends readonly any[] & IsTuple<T>
        ? PrefixTupleAccessor<T, AllowedIndexes<T>, TDepth>
        : T extends any[]
          ? PrefixArrayAccessor<T, [...TDepth, any]>
          : T extends Date
            ? never
            : T extends object
              ? PrefixObjectAccessor<T, TDepth>
              : never

type PrefixFromDepth<
  T extends string | number,
  TDepth extends any[],
> = TDepth['length'] extends 0 ? T : `.${T}`

export type DeepValue<TValue, TAccessor> = TValue extends Record<
  string | number,
  any
>
  ? TAccessor extends `${infer TBefore}[${infer TBrackets}].${infer TAfter}`
    ? DeepValue<TValue[TBefore][TBrackets], TAfter>
    : TAccessor extends `[${infer TBrackets}]`
      ? DeepValue<TValue, TBrackets>
      : TAccessor extends `${infer TBefore}[${infer TBrackets}]`
        ? DeepValue<TValue[TBefore], TBrackets>
        : TAccessor extends `${infer TBefore}.${infer TAfter}`
          ? DeepValue<TValue[TBefore], TAfter>
          : TValue[TAccessor & string]
  : TValue extends ReadonlyArray<infer TElement>
    ? TAccessor extends `[${infer TBrackets}].${infer TAfter}`
      ? TBrackets extends number
        ? DeepValue<TElement, TAfter>
        : TBrackets extends keyof TValue
          ? DeepValue<TValue[TBrackets], TAfter>
          : never
      : TAccessor extends `[${infer TMaybeNumber}]`
        ? TMaybeNumber extends number
          ? TElement
          : never
        : never
    : never
