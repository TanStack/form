export type ServerFieldError = {
  path: string
  message: string
  code?: string
}

export type ServerFormError = {
  message: string
  code?: string
}

export type MappedServerErrors = {
  fields: Record<string, string[]>
  form?: string
}

export type ApplyErrorsOptions = {
  multipleMessages?: 'first' | 'join' | 'array'
  separator?: string
}

export type SuccessOptions<TResult = unknown> = {
  resetStrategy?: 'none' | 'values' | 'all'
  flash?: { set: (msg: string) => void; message?: string }
  after?: (result: TResult) => void | Promise<void>
  storeResult?: boolean
  onRedirect?: (response: TResult) => void | Promise<void>
}

function isZodError(
  err: unknown,
): err is { issues: Array<{ path: (string | number)[]; message: string }> } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'issues' in err &&
    Array.isArray((err as Record<string, unknown>).issues)
  )
}

function isRailsError(
  err: unknown,
): err is { errors: Record<string, string | string[]> } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'errors' in err &&
    typeof (err as Record<string, unknown>).errors === 'object' &&
    (err as Record<string, unknown>).errors !== null
  )
}

function isNestJSError(
  err: unknown,
): err is { message: Array<{ field: string; message: string }> } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    Array.isArray((err as Record<string, unknown>).message)
  )
}

function isCustomFieldError(
  err: unknown,
): err is { fieldErrors: ServerFieldError[] } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'fieldErrors' in err &&
    Array.isArray((err as Record<string, unknown>).fieldErrors)
  )
}

function isCustomFormError(
  err: unknown,
): err is { formError: ServerFormError } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'formError' in err &&
    typeof (err as Record<string, unknown>).formError === 'object'
  )
}

function isStandardSchemaError(
  err: unknown,
): err is { issues: Array<{ path: (string | number)[]; message: string }> } {
  if (typeof err !== 'object' || err === null || !('issues' in err)) {
    return false
  }
  
  const issues = (err as Record<string, unknown>).issues
  if (!Array.isArray(issues) || issues.length === 0) {
    return false
  }
  
  return issues.every((issue: unknown) =>
    typeof issue === 'object' &&
    issue !== null &&
    'path' in issue &&
    'message' in issue &&
    Array.isArray((issue as Record<string, unknown>).path) &&
    typeof (issue as Record<string, unknown>).message === 'string' &&
    (issue as Record<string, unknown>).message !== ''
  )
}

function hasStringMessage(err: unknown): err is { message: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as Record<string, unknown>).message === 'string'
  )
}

function defaultPathMapper(serverPath: string): string {
  if (typeof serverPath !== 'string') {
    return ''
  }
  
  return serverPath
    .replace(/\[(\d+)\]/g, '.$1')
    .replace(/\[([^\]]+)\]/g, '.$1')
    .replace(/^\./, '')
}

export function mapServerErrors(
  err: unknown,
  opts?: {
    pathMapper?: (serverPath: string) => string
    fallbackFormMessage?: string
  },
): MappedServerErrors {
  const pathMapper = opts?.pathMapper || defaultPathMapper
  const fallbackFormMessage = opts?.fallbackFormMessage || 'An error occurred'
  
  const result: MappedServerErrors = {
    fields: {},
    form: undefined
  }

  if (!err || typeof err !== 'object') {
    return { fields: {}, form: fallbackFormMessage }
  }

  if (isStandardSchemaError(err)) {
    for (const issue of err.issues) {
      const path = Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path)
      const mappedPath = pathMapper(path)
      if (mappedPath) {
        if (!result.fields[mappedPath]) {
          result.fields[mappedPath] = []
        }
        result.fields[mappedPath].push(issue.message)
      }
    }
    return result
  }

  if (isZodError(err)) {
    for (const issue of err.issues) {
      const path = Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path)
      const mappedPath = pathMapper(path)
      if (mappedPath) {
        if (!result.fields[mappedPath]) {
          result.fields[mappedPath] = []
        }
        result.fields[mappedPath].push(issue.message)
      }
    }
    return result
  }

  if (isRailsError(err)) {
    for (const [key, value] of Object.entries(err.errors)) {
      if (typeof key === 'string') {
        const path = pathMapper(key)
        if (path) {
          const messages = Array.isArray(value) ? value : [value]
          const validMessages = messages.filter(msg => typeof msg === 'string' && msg.length > 0)
          if (validMessages.length > 0) {
            result.fields[path] = validMessages
          }
        }
      }
    }
    return result
  }

  if (isNestJSError(err)) {
    for (const item of err.message) {
      if (
        typeof item === 'object' &&
        'field' in item &&
        'message' in item
      ) {
        const field = item.field
        const message = item.message
        if (
          typeof field === 'string' &&
          typeof message === 'string' &&
          message.length > 0
        ) {
          const path = pathMapper(field)
          if (path) {
            if (!result.fields[path]) result.fields[path] = []
            result.fields[path].push(message)
          }
        }
      }
    }
    return result
  }

  if (isCustomFieldError(err)) {
    for (const fieldError of err.fieldErrors) {
      if (fieldError.path && fieldError.message && 
          typeof fieldError.path === 'string' && typeof fieldError.message === 'string' &&
          fieldError.message.length > 0) {
        const path = pathMapper(fieldError.path)
        if (path) {
          if (!result.fields[path]) result.fields[path] = []
          result.fields[path].push(fieldError.message)
        }
      }
    }

    if (isCustomFormError(err)) {
      if (
        typeof err.formError.message === 'string' &&
        err.formError.message.length > 0
      ) {
        result.form = err.formError.message
      }
    }

    return result
  }

  if (isCustomFormError(err)) {
    if (
      typeof err.formError.message === 'string' &&
      err.formError.message.length > 0
    ) {
      result.form = err.formError.message
    }
  } else if (hasStringMessage(err)) {
    result.form = err.message
    return result
  }

  result.form = fallbackFormMessage
  return result
}

export function applyServerErrors<TFormApi extends Record<string, unknown>>(
  form: TFormApi,
  mapped: MappedServerErrors,
  opts?: ApplyErrorsOptions,
): void {
  const { multipleMessages = 'first', separator = '; ' } = opts || {}

  for (const [path, messages] of Object.entries(mapped.fields)) {
    if (Array.isArray(messages) && messages.length > 0) {
        let errorMessage: string | string[]
        
        switch (multipleMessages) {
          case 'join': {
            errorMessage = messages.filter(msg => typeof msg === 'string' && msg.length > 0).join(separator)
            break
          }
          case 'array': {
            errorMessage = messages.filter(msg => typeof msg === 'string' && msg.length > 0)
            break
          }
          default: {
            const firstValid = messages.find(msg => typeof msg === 'string' && msg.length > 0)
            errorMessage = firstValid || ''
            break
          }
        }

        if (errorMessage && 'setFieldMeta' in form && typeof form.setFieldMeta === 'function') {
          form.setFieldMeta(path, (prev: unknown) => {
            const prevMeta = (prev as Record<string, unknown>)
            return {
              ...prevMeta,
              errorMap: {
                ...(prevMeta.errorMap as Record<string, unknown>),
                onServer: errorMessage,
              },
              errorSourceMap: {
                ...(prevMeta.errorSourceMap as Record<string, unknown>),
                onServer: 'server',
              },
            }
          })
        }
    }
  }

  if (mapped.form && typeof mapped.form === 'string' && mapped.form.length > 0) {
    if ('setFormMeta' in form && typeof form.setFormMeta === 'function') {
      form.setFormMeta((prev: unknown) => {
        const prevMeta = (prev as Record<string, unknown>)
        return {
          ...prevMeta,
          errorMap: {
            ...(prevMeta.errorMap as Record<string, unknown>),
            onServer: mapped.form,
          },
          errorSourceMap: {
            ...(prevMeta.errorSourceMap as Record<string, unknown>),
            onServer: 'server',
          },
        }
      })
    }
  }
}

export async function onServerSuccess<
  TFormApi extends {
    reset?: (options?: { resetValidation?: boolean }) => void
    setFormMeta?: (updater: (prev: unknown) => unknown) => void
  },
  TResult = unknown,
>(
  form: TFormApi,
  result: TResult,
  opts?: SuccessOptions<TResult>,
): Promise<void> {
  if (typeof form !== 'object') {
    return
  }

  const {
    resetStrategy = 'none',
    flash,
    after,
    storeResult = false,
  } = opts || {}

  if (storeResult && 'setFormMeta' in form && typeof form.setFormMeta === 'function') {
    form.setFormMeta((prev: unknown) => {
      const prevMeta = (prev as Record<string, unknown>)
      return {
        ...prevMeta,
        _serverResponse: result,
        _serverFormError: '',
      }
    })
  }

  if (resetStrategy !== 'none' && 'reset' in form && typeof form.reset === 'function') {
    if (resetStrategy === 'values') {
      form.reset({ resetValidation: false })
    } else {
      form.reset()
    }
  }

  if (flash?.set && flash.message && typeof flash.set === 'function') {
    flash.set(flash.message)
  }

  if (after && typeof after === 'function') {
    await after(result)
  }
}

export const selectServerResponse = <T = unknown>(
  store: unknown,
): T | undefined => {
  if (store && typeof store === 'object' && '_serverResponse' in store) {
    return (store as Record<string, unknown>)._serverResponse as T
  }
  return undefined
}

export const selectServerFormError = (store: unknown): string | undefined => {
  if (store && typeof store === 'object' && '_serverFormError' in store) {
    return (store as Record<string, unknown>)._serverFormError as string
  }
  return undefined
}

export function createServerErrorResponse(
  error: unknown,
  opts?: {
    pathMapper?: (serverPath: string) => string
    fallbackFormMessage?: string
  }
): { 
  success: false
  errors: MappedServerErrors 
} {
  return {
    success: false,
    errors: mapServerErrors(error, opts)
  }
}

export function createServerSuccessResponse<T = unknown>(
  data: T
): { 
  success: true
  data: T 
} {
  return {
    success: true,
    data
  }
}

export function getFormError(mapped: MappedServerErrors): string | undefined {
  return mapped.form
}

export function hasFieldErrors(mapped: MappedServerErrors): boolean {
  return Object.keys(mapped.fields).length > 0
}

export function getAllErrorMessages(mapped: MappedServerErrors): string[] {
  const messages: string[] = []
  
  for (const fieldErrors of Object.values(mapped.fields)) {
    messages.push(...fieldErrors)
  }
  
  if (mapped.form) {
    messages.push(mapped.form)
  }
  
  return messages
}
