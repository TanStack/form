function isArray(a) {
  return Array.isArray(a);
}

function isObject(a) {
  return !Array.isArray(a) && typeof a === 'object' && a !== null;
}

function isStringValidNumber(str) {
  return !isNaN(str);
}

function flattenDeep(arr, newArr = []) {
  if (!isArray(arr)) {
    newArr.push(arr);
  } else {
    for (let i = 0; i < arr.length; i++) {
      flattenDeep(arr[i], newArr);
    }
  }
  return newArr;
}

function makePathArray(obj) {
  return flattenDeep(obj)
    .join('.')
    .replace('[', '.')
    .replace(']', '')
    .split('.');
}

function set(obj = {}, path, value) {
  const keys = makePathArray(path);
  let keyPart;

  if (isStringValidNumber(keys[0]) && !isArray(obj)) {
    obj = [];
  }
  if (!isStringValidNumber(keys[0]) && !isObject(obj)) {
    obj = {};
  }

  let cursor = obj

  while ((keyPart = keys.shift()) && keys.length) {
    if (isStringValidNumber(keys[0]) && !isArray(cursor[keyPart])) {
      cursor[keyPart] = [];
    }
    if (!isStringValidNumber(keys[0]) && !isObject(cursor[keyPart])) {
      cursor[keyPart] = {};
    }
    cursor = cursor[keyPart];
  }
  cursor[keyPart] = value;
  return obj;
}

function get(obj, path, def) {
  if (!path) {
    return obj;
  }
  const pathObj = makePathArray(path);
  let val;
  try {
    val = pathObj.reduce((current, pathPart) => current[pathPart], obj);
  } catch (e) {}
  return typeof val !== 'undefined' ? val : def;
}

function isShallowEqual(obj1, obj2) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (var prop in obj1) {
    if (obj1[prop] !== obj2[prop]) {
      return false;
    }
  }
  return true;
}

export default {
  get,
  set,
  isObject,
  isArray,
  isShallowEqual
};
