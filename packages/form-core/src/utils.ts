import { nameToFieldNodeSegments } from './FieldApi.lib'
import type { OneOrMany, UpdateFn, Updater } from './types.public'

/*
/ credit is due to https://github.com/lukeed/uuid for this code, with current npm
/ attacks we didn't feel comfortable installing directly from npm. But big appreciation
/ from the TanStack Form team <3.
*/

let IDX = 256
const HEX: Array<string> = []
let BUFFER: Array<number> | undefined

while (IDX--) {
  HEX[IDX] = (IDX + 256).toString(16).substring(1)
}

export function uuid(): string {
  let i = 0
  let num: number
  let out = ''

  if (!BUFFER || IDX + 16 > 256) {
    BUFFER = new Array<number>(256)
    i = 256
    while (i--) {
      BUFFER[i] = (256 * Math.random()) | 0
    }
    i = 0
    IDX = 0
  }

  for (; i < 16; i++) {
    num = BUFFER[IDX + i] as number
    if (i === 6) out += HEX[(num & 15) | 64]
    else if (i === 8) out += HEX[(num & 63) | 128]
    else out += HEX[num]

    if (i & 1 && i > 1 && i < 11) out += '-'
  }

  IDX++
  return out
}

/**
 * Get a value from an object using a path, including dot notation.
 * @private
 */
export function getBy(obj: unknown, path: string | Array<string>): any {
  const pathObj = nameToFieldNodeSegments(path)

  return pathObj.reduce((current: any, pathPart) => {
    if (current === null) return null

    if (typeof current !== 'undefined') {
      return current[pathPart]
    }

    return undefined
  }, obj)
}

/**
 * Set a value on an object using a path, including dot notation.
 * @private
 */
export function setBy(obj: any, _path: any, updater: Updater<any>) {
  const path = nameToFieldNodeSegments(_path)

  function doSet(parent?: any): any {
    if (!path.length) {
      return callUpdater(updater, parent)
    }

    const key = path.shift()

    if (
      typeof key === 'string' ||
      (typeof key === 'number' && !Array.isArray(parent))
    ) {
      if (typeof parent === 'object') {
        if (parent === null) {
          parent = {}
        }
        return {
          ...parent,
          [key]: doSet(parent[key]),
        }
      }
      return {
        [key]: doSet(),
      }
    }

    if (Array.isArray(parent) && typeof key === 'number') {
      const prefix = parent.slice(0, key)
      return [
        ...(prefix.length ? prefix : new Array(key)),
        doSet(parent[key]),
        ...parent.slice(key + 1),
      ]
    }
    return [...new Array(key), doSet()]
  }

  return doSet(obj)
}

export function callUpdater<T>(updater: Updater<T>, object: T): T {
  return typeof updater === 'function'
    ? (updater as (...args: Array<any>) => any)(object)
    : updater
}

/**
 * @private
 * Immutably delete a key from a map.
 */
export function mapDelete<TKey, TValue>(
  key: NoInfer<TKey>,
): UpdateFn<ReadonlyMap<TKey, TValue>>
export function mapDelete<TKey, TValue>(
  key: TKey,
  map: ReadonlyMap<TKey, TValue>,
): ReadonlyMap<TKey, TValue>
export function mapDelete<TKey, TValue>(
  key: TKey,
  map?: ReadonlyMap<TKey, TValue>,
): Updater<ReadonlyMap<TKey, TValue>> {
  const pipeline = (oldMap: ReadonlyMap<TKey, TValue>) => {
    if (!oldMap.has(key)) {
      return oldMap
    }
    const newMap = new Map(oldMap)
    newMap.delete(key)
    return newMap
  }

  return map ? pipeline(map) : pipeline
}

export function normalizeToArray<T>(
  input: null | undefined | OneOrMany<T>,
): Array<T> {
  if (Array.isArray(input)) return input
  if (input === null || input === undefined) return []
  return [input]
}

// TODO remove and import from store:
// https://github.com/TanStack/store/pull/313
export function evaluate<T>(objA: T, objB: T) {
  if (Object.is(objA, objB)) {
    return true
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false
  }

  if (objA instanceof Date && objB instanceof Date) {
    return objA.getTime() === objB.getTime()
  }

  if (objA instanceof File && objB instanceof File) {
    return (
      objA.name === objB.name &&
      objA.size === objB.size &&
      objA.type === objB.type &&
      objA.lastModified === objB.lastModified
    )
  }

  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false
    for (const [k, v] of objA) {
      if (!objB.has(k) || !Object.is(v, objB.get(k))) return false
    }
    return true
  }

  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false
    for (const v of objA) {
      if (!objB.has(v)) return false
    }
    return true
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (const key of keysA) {
    if (
      !keysB.includes(key) ||
      !evaluate(objA[key as keyof T], objB[key as keyof T])
    ) {
      return false
    }
  }

  return true
}
