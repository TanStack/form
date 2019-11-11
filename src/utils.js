export function splitFormProps({
  field,
  defaultValue,
  defaultIsTouched,
  defaultError,
  defaultMeta,
  validatePristine,
  validate,
  onSubmit,
  defaultValues,
  filterValue,
  debugForm,
  ...rest
}) {
  return [
    field,
    {
      defaultValue,
      defaultIsTouched,
      defaultError,
      defaultMeta,
      validatePristine,
      validate,
      onSubmit,
      defaultValues,
      filterValue,
      debugForm,
    },
    rest,
  ]
}

// Utils

export function getBy(obj, path) {
  if (!path) {
    throw new Error('A path string is required to use getBy')
  }
  const pathArray = makePathArray(path)
  const pathObj = pathArray
  return pathObj.reduce((current, pathPart) => {
    if (typeof current !== 'undefined') {
      return current[pathPart]
    }
    return undefined
  }, obj)
}

export function setBy(obj, path, updater) {
  path = makePathArray(path)

  function doSet(parent) {
    if (!path.length) {
      return typeof updater === 'function' ? updater(parent) : updater
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

export function getFieldID(str) {
  return makePathArray(str).join('_')
}

const reFindNumbers0 = /^(\d*)$/gm
const reFindNumbers1 = /\.(\d*)\./gm
const reFindNumbers2 = /^(\d*)\./gm
const reFindNumbers3 = /\.(\d*$)/gm
const reFindMultiplePeriods = /\.{2,}/gm

function makePathArray(str) {
  return str
    .replace('[', '.')
    .replace(']', '')
    .replace(reFindNumbers0, '__int__$1')
    .replace(reFindNumbers1, '.__int__$1.')
    .replace(reFindNumbers2, '__int__$1.')
    .replace(reFindNumbers3, '.__int__$1')
    .replace(reFindMultiplePeriods, '.')
    .split('.')
    .map(d => {
      if (d.indexOf('__int__') === 0) {
        return parseInt(d.substring('__int__'.length), 10)
      }
      return d
    })
}

function loopObject(obj, fn, callback) {
  Object.keys(obj).forEach(key => {
    callback(fn(obj[key], key), key)
  })
}

export function someObject(obj, fn) {
  let found = false

  loopObject(obj, fn, (result, key) => {
    if (found) {
      return
    }
    if (result) {
      found = true
    }
  })

  return found
}
