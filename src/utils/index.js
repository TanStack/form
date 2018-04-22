export default {
  clone,
  get,
  set,
  isObject,
  isArray,
  isShallowEqual,
  isDeepEqual,
  noop,
  makePathArray,
  mapObject,
  cleanError,
  removeError
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
  return path.filter(d => typeof d !== 'undefined')
}

function clone (obj) {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch (err) {
    return obj
  }
}

// TODO figure out way to make state immutable
function set (obj = {}, path, value, deleteWhenFalsey) {
  if (!path) {
    return value
  }
  const keys = makePathArray(path)

  let cursor = obj

  while (keys.length > 1) {
    const key = keys[0]
    const nextKey = keys[1]
    if (typeof nextKey === 'number' && !isArray(cursor[key])) {
      cursor[key] = []
    }
    if (typeof nextKey !== 'number' && !isObject(cursor[key])) {
      cursor[key] = {}
    }
    cursor = cursor[key]
    keys.shift()
  }

  if (!value && deleteWhenFalsey) {
    delete cursor[keys[0]]
  } else {
    cursor[keys[0]] = value
  }

  return obj
}

function get (obj, path, def) {
  if (!path) {
    return obj
  }
  const pathArray = makePathArray(path)
  const pathObj = pathArray
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

function mapObject (obj, cb) {
  return Object.keys(obj).map(key => cb(obj[key], key))
}

function cleanError (obj, { removeSuccess } = {}) {
  if (!obj) {
    return undefined
  }
  if (isObject(obj)) {
    mapObject(obj, (val, key) => {
      obj[key] = cleanError(obj[key]) // clean nested objects
      if (removeSuccess && key === 'success') {
        delete obj[key]
      }
      if (!obj[key]) {
        delete obj[key] // remove falsey keys
      }
    })
    if (!Object.keys(obj).length) {
      return undefined
    }
  }
  if (isArray(obj)) {
    obj = obj.map(cleanError) // clean nested falsey arrays
    if (!obj.length || obj.every(d => !d)) {
      return undefined
    }
  }
  return obj
}

function removeError (field = undefined, errors = undefined) {
  if (!field || !errors) {
    return errors
  }
  // field is array
  if (isArray(field)) {
    const fieldName = field[0]
    const fieldIndex = field[1]
    // check if field and error exist in errors
    if (!errors[fieldName] || errors[fieldName].length < fieldIndex) {
      return errors
    }
    // remove key if the only field
    if (errors[fieldName].length - 1 === 0) {
      delete errors[fieldName]
      return { ...errors }
    }
    // remove field error
    return { ...errors,
      [fieldName]: [
        ...errors[fieldName].slice(0, fieldIndex),
        ...errors[fieldName].slice(fieldIndex + 1)
      ] }
  }
  // remove simple field error
  if (errors[field]) {
    delete errors[field]
    return { ...errors }
  }
  // return original errors
  return errors
}
