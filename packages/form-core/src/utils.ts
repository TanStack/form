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

export function getBy(obj: any, path: any) {
  if (!path) {
    throw new Error('A path string is required to use getBy')
  }
  const pathArray = makePathArray(path)
  const pathObj = pathArray
  return pathObj.reduce((current: any, pathPart: any) => {
    if (typeof current !== 'undefined') {
      return current[pathPart]
    }
    return undefined
  }, obj)
}

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

const reFindNumbers0 = /^(\d*)$/gm
const reFindNumbers1 = /\.(\d*)\./gm
const reFindNumbers2 = /^(\d*)\./gm
const reFindNumbers3 = /\.(\d*$)/gm
const reFindMultiplePeriods = /\.{2,}/gm

function makePathArray(str: string) {
  return str
    .replace('[', '.')
    .replace(']', '')
    .replace(reFindNumbers0, '__int__$1')
    .replace(reFindNumbers1, '.__int__$1.')
    .replace(reFindNumbers2, '__int__$1.')
    .replace(reFindNumbers3, '.__int__$1')
    .replace(reFindMultiplePeriods, '.')
    .split('.')
    .map((d) => {
      if (d.indexOf('__int__') === 0) {
        return parseInt(d.substring('__int__'.length), 10)
      }
      return d
    })
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

export type DeepKeys<T> = unknown extends T
  ? keyof T
  : object extends T
  ? string
  : T extends readonly any[] & IsTuple<T>
  ? AllowedIndexes<T> | DeepKeysPrefix<T, AllowedIndexes<T>>
  : T extends any[]
  ? never & 'Dynamic length array indexing is not supported'
  : T extends Date
  ? never
  : T extends object
  ? (keyof T & string) | DeepKeysPrefix<T, keyof T>
  : never

type DeepKeysPrefix<T, TPrefix> = TPrefix extends keyof T & (number | string)
  ? `${TPrefix}.${DeepKeys<T[TPrefix]> & string}`
  : never

export type DeepValue<T, TProp> = T extends Record<string | number, any>
  ? TProp extends `${infer TBranch}.${infer TDeepProp}`
    ? DeepValue<T[TBranch], TDeepProp>
    : T[TProp & string]
  : never
