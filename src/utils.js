export default {
  get,
  set,
  isObject,
  isArray,
  isShallowEqual,
  isDeepEqual,
  noop
}

function isArray (a) {
  return Array.isArray(a)
}

function isObject (a) {
  return !Array.isArray(a) && typeof a === 'object' && a !== null
}

function flattenDeep (arr, newArr = []) {
  if (!isArray(arr)) {
    newArr.push(arr)
  } else {
    for (let i = 0; i < arr.length; i++) {
      flattenDeep(arr[i], newArr)
    }
  }
  return newArr
}

function makePathArray (obj) {
  let path = []
  const flat = flattenDeep(obj)
  flat.forEach(part => {
    if (typeof part === 'string') {
      path = path.concat(
        part
          .replace(/\[(\d*)\]/gm, '.__int__$1')
          .replace('[', '.')
          .replace(']', '')
          .split('.')
          .map(d => {
            if (d.indexOf('__int__') === 0) {
              return parseInt(d.substring(7), 10)
            }
            return d
          })
      )
    } else {
      path.push(part)
    }
  })
  return path
}

// TODO figure out way to make state immutable
function set (obj = {}, path, value, deleteWhenFalsey) {
  const keys = makePathArray(path)
  let keyPart

  if (typeof keys[0] === 'number' && !isArray(obj)) {
    obj = []
  } else if (typeof keys[0] === 'string' && !isObject(obj)) {
    obj = {}
  }

  let cursor = obj

  while (typeof (keyPart = keys.shift()) !== 'undefined' && keys.length) {
    if (typeof keys[0] === 'number' && !isArray(cursor[keyPart])) {
      cursor[keyPart] = []
    }
    if (typeof keys[0] !== 'number' && !isObject(cursor[keyPart])) {
      cursor[keyPart] = {}
    }
    cursor = cursor[keyPart]
  }
  if (!value && deleteWhenFalsey) {
    delete cursor[keyPart]
  } else {
    cursor[keyPart] = value
  }
  return obj
}

function get (obj, path, def) {
  if (!path) {
    return obj
  }
  const pathObj = makePathArray(path)
  const val = pathObj.reduce((current, pathPart) => {
    if (typeof current !== 'undefined' && current !== null) {
      return current[pathPart]
    }
    return undefined
  }, obj)
  return typeof val !== 'undefined' ? val : def
}

function isShallowEqual (obj1, obj2, keys) {
  if (!keys && Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
  }
  const isEqual = Object.keys(obj1).every(prop => {
    if (keys) {
      if (keys.includes(prop)) {
        return obj1[prop] === obj2[prop]
      }
      return true
    }
    return obj1[prop] === obj2[prop]
  })
  if (!isEqual) {
    return false
  }
  return true
}

function isDeepEqual (a, b) {
  if (a === b) return true

  const arrA = Array.isArray(a)
  const arrB = Array.isArray(b)
  let i

  if (arrA && arrB) {
    if (a.length !== b.length) return false
    for (i = 0; i < a.length; i++) if (!isDeepEqual(a[i], b[i])) return false
    return true
  }

  if (arrA !== arrB) return false

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = Object.keys(a)
    if (keys.length !== Object.keys(b).length) return false

    const dateA = a instanceof Date
    const dateB = b instanceof Date
    if (dateA && dateB) return a.getTime() === b.getTime()
    if (dateA !== dateB) return false

    const regexpA = a instanceof RegExp
    const regexpB = b instanceof RegExp
    if (regexpA && regexpB) return a.toString() === b.toString()
    if (regexpA !== regexpB) return false

    for (i = 0; i < keys.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false
    }

    for (i = 0; i < keys.length; i++) if (!isDeepEqual(a[keys[i]], b[keys[i]])) return false

    return true
  }

  return false
}

function noop () {}
