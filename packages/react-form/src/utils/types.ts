type Contra<T> = T extends any ? (arg: T) => void : never

type InferContra<T> = [T] extends [(arg: infer I) => void] ? I : never

/**
 * "a" | "b" | "c" => "a"
 */
type PickOne<T> = InferContra<InferContra<Contra<Contra<T>>>>

/**
 * "a" | "b" | "c" => ["a", "b", "c"]
 */
export type UnionToTuple<T> = PickOne<T> extends infer U
  ? Exclude<T, U> extends never
    ? readonly [T]
    : readonly [...UnionToTuple<Exclude<T, U>>, U]
  : never

/**
 * "a" | "b" | "c" => ['a', 'b', 'c'] | ['a', 'c', 'b'] | ['b', 'a', 'c'] | ['b', 'c', 'a'] | ['c', 'a', 'b'] | ['c', 'b', 'a'];
 */
export type Permutation<T, U = T> = [T] extends readonly [never]
  ? readonly []
  : T extends T
  ? readonly [T, ...Permutation<Exclude<U, T>>]
  : never
