import type { AnyInternalFieldApi } from './FieldApi/FieldApi.lib'

// type
import type { FieldUpdateOptions, OneOrMany, Updater } from './types.public'
import type {
  InternalFieldUpdateOptions,
  ResolvedInternalFieldUpdateOptions,
} from './types.lib'
import type { AnyInternalFormApi } from './FormApi/FormApi.lib'

export type NameSegment = string | number
export type NameSegments = Array<NameSegment>

/**
 * Convert a name into an array of segments.
 *
 * If it already is an array, it will create a shallow copy.
 */
export function nameToFieldNodeSegments(
  nameOrSegments: string | NameSegments,
): NameSegments {
  if (typeof nameOrSegments !== 'string') return nameOrSegments.slice()

  const result: NameSegments = []
  let start = 0

  for (let i = 0; i < nameOrSegments.length; i++) {
    switch (nameOrSegments.charCodeAt(i)) {
      case 0x2e: // '.'
      case 0x5b: // '['
        if (i > start) {
          result.push(nameOrSegments.slice(start, i))
        }
        start = i + 1
        break
      case 0x5d: // ']'
        if (i > start) {
          result.push(parseInt(nameOrSegments.slice(start, i), 10))
        }
        start = i + 1
        break
    }
  }
  if (start < nameOrSegments.length) {
    result.push(nameOrSegments.slice(start))
  }

  return result
}

export function resolveFieldUpdateOptions(
  options: InternalFieldUpdateOptions | undefined,
  event: 'change' | 'blur' | 'submit' | 'noEvent',
): ResolvedInternalFieldUpdateOptions {
  const baseOpts: Required<FieldUpdateOptions> = {
    causeValidation: options?.causeValidation ?? true,
    markAsBlurred: options?.markAsBlurred ?? event === 'blur',
    markAsDirty: options?.markAsDirty ?? event === 'change',
    markAsTouched:
      options?.markAsTouched ?? (event === 'change' || event === 'submit'),
  }
  const noFieldCreationNeeded =
    !baseOpts.markAsTouched && !baseOpts.markAsDirty && !baseOpts.markAsBlurred

  return {
    ...baseOpts,
    _skipFieldCreation: options?._skipFieldCreation ?? noFieldCreationNeeded,
    fieldApiOverride: options?.fieldApiOverride ?? null,
    doPropagate: options?.doPropagate ?? true,
  }
}

export function getTargetField(
  formApi: AnyInternalFormApi,
  fieldName: string,
  options: ResolvedInternalFieldUpdateOptions,
) {
  let field: AnyInternalFieldApi | null

  if (options.fieldApiOverride) {
    field = options.fieldApiOverride
  } else if (options._skipFieldCreation) {
    field = formApi._tryGetFieldApi(fieldName)
  } else {
    field = formApi._getOrCreateFieldApi({ name: fieldName })
  }
  return field
}

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

export function isNotNil<T>(input: T): input is NonNullable<T> {
  return input !== null && input !== undefined
}
export function isNil<T>(input: T): input is Extract<T, undefined | null> {
  return !isNotNil(input)
}

/**
 * Get a value from an object using a path, including dot notation.
 * @private
 */
export function getBy(obj: unknown, path: string | Array<string>): any {
  const pathObj = nameToFieldNodeSegments(path)

  return pathObj.reduce((current: any, pathPart) => current?.[pathPart], obj)
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

export function normalizeToArray<T>(
  input: null | undefined | OneOrMany<T>,
): Array<T> {
  if (Array.isArray(input)) return input
  if (input === null || input === undefined) return []
  return [input]
}

// TODO remove and import from store:
// https://github.com/TanStack/store/pull/313
export function evaluate<T>(
  objA: T,
  objB: T,
  seen: WeakMap<object, WeakSet<object>> = new WeakMap(),
): boolean {
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

  // guards against circular references
  let seenB = seen.get(objA)

  if (seenB?.has(objB)) return true

  if (!seenB) {
    seenB = new WeakSet()
    seen.set(objA, seenB)
  }

  seenB.add(objB)

  // guards against runtime cross type evaluation
  if (Object.getPrototypeOf(objA) !== Object.getPrototypeOf(objB)) {
    return false
  }

  if (objA instanceof Date && objB instanceof Date) {
    return objA.getTime() === objB.getTime()
  }

  if (
    typeof File !== 'undefined' &&
    objA instanceof File &&
    objB instanceof File
  ) {
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
      if (!objB.has(k) || !evaluate(v, objB.get(k), seen)) return false
    }

    return true
  }

  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false

    for (const v of objA) {
      if (![...objB].some((bv) => evaluate(v, bv, seen))) return false
    }

    return true
  }

  const keysA = getOwnKeys(objA)
  const keysB = getOwnKeys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, key) ||
      !evaluate(objA[key as keyof T], objB[key as keyof T], seen)
    ) {
      return false
    }
  }

  return true
}

function getOwnKeys(obj: object): Array<string | symbol> {
  return (Object.keys(obj) as Array<string | symbol>).concat(
    Object.getOwnPropertySymbols(obj),
  )
}

export function concatenateFieldNames(nameA: string, nameB: string): string {
  if (nameA.length === 0) return nameB
  if (nameB.length === 0) return nameA
  if (nameB.startsWith('[')) return `${nameA}${nameB}`
  return `${nameA}.${nameB}`
}

export function isPromiseLike<T>(
  value: T | PromiseLike<T>,
): value is PromiseLike<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof value.then === 'function'
  )
}
