import React from 'react'

export default {
  clone,
  get,
  set,
  mapValues,
  makePathArray,
  pickBy,
  isObject,
  isArray,
  normalizeComponent
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

function normalizeComponent (Comp, params = {}, fallback = Comp) {
  return typeof Comp === 'function' ? (
    Object.getPrototypeOf(Comp).isReactComponent ? (
      <Comp
        {...params}
      />
    ) : Comp(params)
  ) : fallback
}
