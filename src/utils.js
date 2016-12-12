export default {
  assign,
  find,
  clone,
  get,
  set,
  mapValues,
  makePathArray,
  pickBy,
  isObject,
  isArray
}

function assign (target) {
  if (Object.assign) {
    return Object.assign.apply(this, arguments)
  }
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object')
  }
  const to = Object(target)
  for (var index = 1; index < arguments.length; index++) {
    const nextSource = arguments[index]
    if (nextSource != null) {
      for (var nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey]
        }
      }
    }
  }
  return to
}

function find (target, predicate) {
  if (Array.prototype.find) {
    return target.find(predicate)
  }
  'use strict'
  if (target == null) {
    throw new TypeError('Array.prototype.find called on null or undefined')
  }
  if (typeof predicate !== 'function') {
    throw new TypeError('predicate must be a function')
  }
  const list = Object(target)
  const length = list.length >>> 0
  for (var i = 0; i < length; i++) {
    const value = list[i]
    if (predicate(value, i, list)) {
      return value
    }
  }
  return undefined
}

function clone (a) {
  try {
    return JSON.parse(JSON.stringify(a, (key, value) => {
      if (typeof value === 'function') {
        return value.toString()
      }
      return value
    }))
  } catch (e) {
    return a
  }
}

function get (obj, path, def) {
  if (!path) {
    return obj
  }
  const pathObj = makePathArray(path)
  let val
  try {
    val = pathObj.reduce((current, pathPart) => current[pathPart], obj)
  } catch (e) {}
  return typeof val !== 'undefined' ? val : def
}

function set (obj = {}, path, value) {
  const keys = makePathArray(path)
  let keyPart

  if (isStringValidNumber(keys[0]) && !isArray(obj)) {
    obj = []
  }
  if (!isStringValidNumber(keys[0]) && !isObject(obj)) {
    obj = {}
  }

  let cursor = obj

  while ((keyPart = keys.shift()) && keys.length) {
    if (isStringValidNumber(keys[0]) && !isArray(cursor[keyPart])) {
      cursor[keyPart] = []
    }
    if (!isStringValidNumber(keys[0]) && !isObject(cursor[keyPart])) {
      cursor[keyPart] = {}
    }
    cursor = cursor[keyPart]
  }
  cursor[keyPart] = value
  return obj
}

function mapValues (obj, cb) {
  const newObj = {}
  for (var key in obj) {
    newObj[key] = cb(obj[key], key)
  }
  return newObj
}

function makePathArray (obj) {
  return flattenDeep(obj)
      .join('.')
      .replace('[', '.')
      .replace(']', '')
      .split('.')
}

function pickBy (obj, cb) {
  const newObj = {}
  for (var key in obj) {
    if (cb(obj[key], key)) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

function flattenDeep (arr, newArr = []) {
  if (!isArray(arr)) {
    newArr.push(arr)
  } else {
    for (var i = 0; i < arr.length; i++) {
      flattenDeep(arr[i], newArr)
    }
  }
  return newArr
}

function isArray (a) {
  return Array.isArray(a)
}

function isObject (a) {
  return !Array.isArray(a) && typeof a === 'object' && a !== null
}

function isStringValidNumber (str) {
  return !isNaN(str)
}
