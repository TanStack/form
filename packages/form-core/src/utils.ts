export type UpdaterFn<TInput, TOutput = TInput> = (input: TInput) => TOutput

export type Updater<TInput, TOutput = TInput> =
  | TOutput
  | UpdaterFn<TInput, TOutput>

export function functionalUpdate<TInput, TOutput = TInput>(
  updater: Updater<TInput, TOutput>,
  input: TInput,
): TOutput {
  return typeof updater === 'function'
    ? (updater as UpdaterFn<TInput, TOutput>)(input)
    : updater
}

/**
 * Get a value from an object using a path, including dot notation.
 */
export function getBy(obj: any, path: any) {
  const pathArray = makePathArray(path)
  const pathObj = pathArray
  return pathObj.reduce((current: any, pathPart: any) => {
    if (typeof current !== 'undefined') {
      return current[pathPart]
    }
    return undefined
  }, obj)
}

/**
 * Set a value on an object using a path, including dot notation.
 */
export function setBy(obj: any, _path: any, updater: Updater<any>) {
  const path = makePathArray(_path)

  function doSet(parent?: any): any {
    if (!path.length) {
      return functionalUpdate(updater, parent)
    }

    const key = path.shift()

    if (typeof key === 'string') {
      if (typeof parent === 'object') {
        return {
          ...parent,
          [key]: doSet(parent[key]),
        }
      }
      return {
        [key]: doSet(),
      }
    }

    if (typeof key === 'number') {
      if (Array.isArray(parent)) {
        const prefix = parent.slice(0, key)
        return [
          ...(prefix.length ? prefix : new Array(key)),
          doSet(parent[key]),
          ...parent.slice(key + 1),
        ]
      }
      return [...new Array(key), doSet()]
    }

    throw new Error('Uh oh!')
  }

  return doSet(obj)
}

/**
 * Delete a field on an object using a path, including dot notation.
 */
export function deleteBy(obj: any, _path: any) {
  const path = makePathArray(_path)

  function doDelete(parent: any): any {
    if (path.length === 1) {
      const finalPath = path[0]!
      const { [finalPath]: remove, ...rest } = parent
      return rest
    }

    const key = path.shift()

    if (typeof key === 'string') {
      if (typeof parent === 'object') {
        return {
          ...parent,
          [key]: doDelete(parent[key]),
        }
      }
    }

    if (typeof key === 'number') {
      if (Array.isArray(parent)) {
        const prefix = parent.slice(0, key)
        return [
          ...(prefix.length ? prefix : new Array(key)),
          doDelete(parent[key]),
          ...parent.slice(key + 1),
        ]
      }
    }

    throw new Error('It seems we have created an infinite loop in deleteBy. ')
  }

  return doDelete(obj)
}

const reFindNumbers0 = /^(\d*)$/gm
const reFindNumbers1 = /\.(\d*)\./gm
const reFindNumbers2 = /^(\d*)\./gm
const reFindNumbers3 = /\.(\d*$)/gm
const reFindMultiplePeriods = /\.{2,}/gm

const intPrefix = '__int__'
const intReplace = `${intPrefix}$1`

function makePathArray(str: string) {
  if (typeof str !== 'string') {
    throw new Error('Path must be a string.')
  }

  return str
    .replace('[', '.')
    .replace(']', '')
    .replace(reFindNumbers0, intReplace)
    .replace(reFindNumbers1, `.${intReplace}.`)
    .replace(reFindNumbers2, `${intReplace}.`)
    .replace(reFindNumbers3, `.${intReplace}`)
    .replace(reFindMultiplePeriods, '.')
    .split('.')
    .map((d) => {
      if (d.indexOf(intPrefix) === 0) {
        return parseInt(d.substring(intPrefix.length), 10)
      }
      return d
    })
}

export function isNonEmptyArray(obj: any) {
  return !(Array.isArray(obj) && obj.length === 0)
}

export type RequiredByKey<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>

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

export type DeepKeys<T, TDepth extends any[] = []> = TDepth['length'] extends 5
  ? never
  : unknown extends T
  ? string
  : object extends T
  ? string
  : T extends readonly any[] & IsTuple<T>
  ? AllowedIndexes<T> | DeepKeysPrefix<T, AllowedIndexes<T>, TDepth>
  : T extends any[]
  ? DeepKeys<T[number], [...TDepth, any]>
  : T extends Date
  ? never
  : T extends object
  ? (keyof T & string) | DeepKeysPrefix<T, keyof T, TDepth>
  : never

type DeepKeysPrefix<
  T,
  TPrefix,
  TDepth extends any[],
> = TPrefix extends keyof T & (number | string)
  ? `${TPrefix}.${DeepKeys<T[TPrefix], [...TDepth, any]> & string}`
  : never

export type DeepValue<T, TProp> = T extends Record<string | number, any>
  ? TProp extends `${infer TBranch}.${infer TDeepProp}`
    ? DeepValue<T[TBranch], TDeepProp>
    : T[TProp & string]
  : never

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
