import { nameToFieldNodeSegments } from './FieldApi.lib'
import type { Updater } from './types.public'

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

function callUpdater(updater: Updater<any>, object: any): any {
  return typeof updater === 'function'
    ? (updater as (...args: Array<any>) => any)(object)
    : updater
}
