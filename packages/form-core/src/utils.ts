import type { ValidationCause } from './types'
import type { FormValidators } from './FormApi'
import type { FieldValidators } from './FieldApi'

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

/**
 * Get a value from an object using a path, including dot notation.
 */
export function getBy(obj: any, path: any) {
  const pathObj = makePathArray(path)
  return pathObj.reduce((current: any, pathPart: any) => {
    if (current === null) return null
    if (typeof current !== 'undefined') {
      return current[pathPart]
    }
    return undefined
  }, obj)
}

/**
 * Set a value on an object using a path, including dot notation.
 */
export function setBy(obj: any, _path: any, updater: Updater<any>) {
  const path = makePathArray(_path)

  function doSet(parent?: any): any {
    if (!path.length) {
      return functionalUpdate(updater, parent)
    }

    const key = path.shift()

    if (typeof key === 'string') {
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

    if (Array.isArray(parent) && key !== undefined) {
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

/**
 * Delete a field on an object using a path, including dot notation.
 */
export function deleteBy(obj: any, _path: any) {
  const path = makePathArray(_path)

  function doDelete(parent: any): any {
    if (!parent) return
    if (path.length === 1) {
      const finalPath = path[0]!
      if (Array.isArray(parent) && typeof finalPath === 'number') {
        return parent.filter((_, i) => i !== finalPath)
      }
      const { [finalPath]: remove, ...rest } = parent
      return rest
    }

    const key = path.shift()

    if (typeof key === 'string') {
      if (typeof parent === 'object') {
        return {
          ...parent,
          [key]: doDelete(parent[key]),
        }
      }
    }

    if (typeof key === 'number') {
      if (Array.isArray(parent)) {
        if (key >= parent.length) {
          return parent
        }
        const prefix = parent.slice(0, key)
        return [
          ...(prefix.length ? prefix : new Array(key)),
          doDelete(parent[key]),
          ...parent.slice(key + 1),
        ]
      }
    }

    throw new Error('It seems we have created an infinite loop in deleteBy. ')
  }

  return doDelete(obj)
}

const reFindNumbers0 = /^(\d*)$/gm
const reFindNumbers1 = /\.(\d*)\./gm
const reFindNumbers2 = /^(\d*)\./gm
const reFindNumbers3 = /\.(\d*$)/gm
const reFindMultiplePeriods = /\.{2,}/gm

const intPrefix = '__int__'
const intReplace = `${intPrefix}$1`

export function makePathArray(str: string) {
  if (typeof str !== 'string') {
    throw new Error('Path must be a string.')
  }

  return str
    .replaceAll('[', '.')
    .replaceAll(']', '')
    .replace(reFindNumbers0, intReplace)
    .replace(reFindNumbers1, `.${intReplace}.`)
    .replace(reFindNumbers2, `${intReplace}.`)
    .replace(reFindNumbers3, `.${intReplace}`)
    .replace(reFindMultiplePeriods, '.')
    .split('.')
    .map((d) => {
      if (d.indexOf(intPrefix) === 0) {
        return parseInt(d.substring(intPrefix.length), 10)
      }
      return d
    })
}

export function isNonEmptyArray(obj: any) {
  return !(Array.isArray(obj) && obj.length === 0)
}

interface AsyncValidatorArrayPartialOptions<T> {
  validators?: T
  asyncDebounceMs?: number
}

export interface AsyncValidator<T> {
  cause: ValidationCause
  validate: T
  debounceMs: number
}

export function getAsyncValidatorArray<T>(
  cause: ValidationCause,
  options: AsyncValidatorArrayPartialOptions<T>,
): T extends FieldValidators<any, any>
  ? Array<
      AsyncValidator<T['onChangeAsync'] | T['onBlurAsync'] | T['onSubmitAsync']>
    >
  : T extends FormValidators<any, any>
    ? Array<
        AsyncValidator<
          T['onChangeAsync'] | T['onBlurAsync'] | T['onSubmitAsync']
        >
      >
    : never {
  const { asyncDebounceMs } = options
  const {
    onChangeAsync,
    onBlurAsync,
    onSubmitAsync,
    onBlurAsyncDebounceMs,
    onChangeAsyncDebounceMs,
  } = (options.validators || {}) as
    | FieldValidators<any, any>
    | FormValidators<any, any>

  const defaultDebounceMs = asyncDebounceMs ?? 0

  const changeValidator = {
    cause: 'change',
    validate: onChangeAsync,
    debounceMs: onChangeAsyncDebounceMs ?? defaultDebounceMs,
  } as const

  const blurValidator = {
    cause: 'blur',
    validate: onBlurAsync,
    debounceMs: onBlurAsyncDebounceMs ?? defaultDebounceMs,
  } as const

  const submitValidator = {
    cause: 'submit',
    validate: onSubmitAsync,
    debounceMs: 0,
  } as const

  const noopValidator = (
    validator:
      | typeof changeValidator
      | typeof blurValidator
      | typeof submitValidator,
  ) => ({ ...validator, debounceMs: 0 }) as const

  switch (cause) {
    case 'submit':
      return [
        noopValidator(changeValidator),
        noopValidator(blurValidator),
        submitValidator,
      ] as never
    case 'blur':
      return [blurValidator] as never
    case 'change':
      return [changeValidator] as never
    case 'server':
    default:
      return [] as never
  }
}

interface SyncValidatorArrayPartialOptions<T> {
  validators?: T
}

export interface SyncValidator<T> {
  cause: ValidationCause
  validate: T
}

export function getSyncValidatorArray<T>(
  cause: ValidationCause,
  options: SyncValidatorArrayPartialOptions<T>,
): T extends FieldValidators<any, any>
  ? Array<SyncValidator<T['onChange'] | T['onBlur'] | T['onSubmit']>>
  : T extends FormValidators<any, any>
    ? Array<SyncValidator<T['onChange'] | T['onBlur'] | T['onSubmit']>>
    : never {
  const { onChange, onBlur, onSubmit } = (options.validators || {}) as
    | FieldValidators<any, any>
    | FormValidators<any, any>

  const changeValidator = { cause: 'change', validate: onChange } as const
  const blurValidator = { cause: 'blur', validate: onBlur } as const
  const submitValidator = { cause: 'submit', validate: onSubmit } as const

  // Allows us to clear onServer errors
  const serverValidator = {
    cause: 'server',
    validate: () => undefined,
  } as const

  switch (cause) {
    case 'submit':
      return [
        changeValidator,
        blurValidator,
        submitValidator,
        serverValidator,
      ] as never
    case 'server':
      return [serverValidator] as never
    case 'blur':
      return [blurValidator, serverValidator] as never
    case 'change':
    default:
      return [changeValidator, serverValidator] as never
  }
}
