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
}

function isZodError(err: unknown): err is { issues: Array<{ path: (string | number)[]; message: string }> } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'issues' in err &&
    Array.isArray((err as Record<string, unknown>).issues)
  )
}

function isRailsError(err: unknown): err is { errors: Record<string, string | string[]> } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'errors' in err &&
    typeof (err as Record<string, unknown>).errors === 'object' &&
    (err as Record<string, unknown>).errors !== null
  )
}

function isNestJSError(err: unknown): err is { message: Array<{ field: string; message: string }> } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    Array.isArray((err as Record<string, unknown>).message)
  )
}

function isCustomFieldError(err: unknown): err is { fieldErrors: ServerFieldError[] } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'fieldErrors' in err &&
    Array.isArray((err as Record<string, unknown>).fieldErrors)
  )
}

function isCustomFormError(err: unknown): err is { formError: ServerFormError } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'formError' in err &&
    typeof (err as Record<string, unknown>).formError === 'object'
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
  
  try {
    return serverPath
      .replace(/\[(\d+)\]/g, '.$1')
      .replace(/\[([^\]]+)\]/g, '.$1')
      .replace(/^\./, '')
  } catch {
    return serverPath
  }
}


export function mapServerErrors(
  err: unknown,
  opts?: { 
    pathMapper?: (serverPath: string) => string
    fallbackFormMessage?: string 
  }
): MappedServerErrors {
  const pathMapper = opts?.pathMapper || defaultPathMapper
  const fallbackFormMessage = opts?.fallbackFormMessage || 'An error occurred'
  
  const result: MappedServerErrors = {
    fields: {},
    form: undefined
  }

  if (!err) {
    result.form = fallbackFormMessage
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
    try {
      for (const [field, messages] of Object.entries(err.errors)) {
        const mappedPath = pathMapper(field)
        if (mappedPath) {
          if (Array.isArray(messages)) {
            result.fields[mappedPath] = messages.filter(msg => typeof msg === 'string' && msg.trim())
          } else if (typeof messages === 'string' && messages.trim()) {
            result.fields[mappedPath] = [messages]
          }
        }
      }
    } catch {
      // Skip invalid Rails error format
    }
    return result
  }

  if (isNestJSError(err)) {
    try {
      for (const item of err.message) {
        if (typeof item === 'object' && item && 'field' in item && 'message' in item) {
          const field = item.field
          const message = item.message
          if (typeof field === 'string' && typeof message === 'string' && message.length > 0) {
            const path = pathMapper(field)
            if (path) {
              if (!result.fields[path]) result.fields[path] = []
              result.fields[path].push(message)
            }
          }
        }
      }
    } catch {
      // Skip invalid NestJS error format
    }
    return result
  }

  if (isCustomFieldError(err)) {
    try {
      for (const fieldError of err.fieldErrors) {
        if (fieldError && fieldError.path && fieldError.message && 
            typeof fieldError.path === 'string' && typeof fieldError.message === 'string' &&
            fieldError.message.length > 0) {
          const path = pathMapper(fieldError.path)
          if (path) {
            if (!result.fields[path]) result.fields[path] = []
            result.fields[path].push(fieldError.message)
          }
        }
      }
    } catch {
      // Skip invalid custom field error format
    }
    
    if (isCustomFormError(err)) {
      if (typeof err.formError.message === 'string' && err.formError.message.length > 0) {
        result.form = err.formError.message
      }
    }
    
    return result
  }

  if (isCustomFormError(err)) {
    if (typeof err.formError.message === 'string' && err.formError.message.length > 0) {
      result.form = err.formError.message
    }
  } else if (hasStringMessage(err)) {
    result.form = err.message
    return result
  }

  result.form = fallbackFormMessage
  return result
}

export function applyServerErrors<TFormApi>(
  form: TFormApi,
  mapped: MappedServerErrors,
  opts?: ApplyErrorsOptions
): void {
  const { multipleMessages = 'first', separator = '; ' } = opts || {}

  if (form && typeof form === 'object' && 'setFieldMeta' in form && typeof form.setFieldMeta === 'function') {
    for (const [fieldPath, messages] of Object.entries(mapped.fields)) {
      if (Array.isArray(messages) && messages.length > 0) {
        const validMessages = messages.filter(msg => typeof msg === 'string' && msg.trim())
        if (validMessages.length > 0) {
          let errorMessage: string | string[]

          if (multipleMessages === 'first') {
            errorMessage = validMessages[0] || ''
          } else if (multipleMessages === 'join') {
            errorMessage = validMessages.join(separator)
          } else {
            errorMessage = validMessages
          }

          try {
            form.setFieldMeta(fieldPath, (prev: unknown) => {
              const prevMeta = (prev as Record<string, unknown>) || {}
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
          } catch {
            // Skip if setFieldMeta fails
          }
        }
      }
    }
  }

  if (mapped.form && typeof mapped.form === 'string' && mapped.form.length > 0) {
    if (form && typeof form === 'object' && 'setFormMeta' in form && typeof form.setFormMeta === 'function') {
      try {
        form.setFormMeta((prev: unknown) => {
          const prevMeta = (prev as Record<string, unknown>) || {}
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
      } catch {
        // Skip if setFormMeta fails
      }
    }
  }
}

export async function onServerSuccess<
  TFormApi extends { 
    reset?: (options?: { resetValidation?: boolean }) => void
    setFormMeta?: (updater: (prev: unknown) => unknown) => void
  },
  TResult = unknown
>(
  form: TFormApi,
  result: TResult,
  opts?: SuccessOptions<TResult>
): Promise<void> {
  if (!form || typeof form !== 'object') {
    return
  }

  const { resetStrategy = 'none', flash, after, storeResult = false } = opts || {}

  if (storeResult && form && typeof form === 'object' && 'setFormMeta' in form && typeof form.setFormMeta === 'function') {
    try {
      form.setFormMeta((prev: unknown) => {
        const prevMeta = (prev as Record<string, unknown>) || {}
        return {
          ...prevMeta,
          _serverResponse: result,
          _serverFormError: '',
        }
      })
    } catch {
      // Skip if setFormMeta fails
    }
  }

  if (resetStrategy !== 'none' && form && typeof form === 'object' && 'reset' in form && typeof form.reset === 'function') {
    try {
      if (resetStrategy === 'values') {
        form.reset({ resetValidation: false })
      } else {
        form.reset()
      }
    } catch {
      // Skip if reset fails
    }
  }

  if (flash?.set && flash.message && typeof flash.set === 'function') {
    try {
      flash.set(flash.message)
    } catch {
      // Skip if flash.set fails
    }
  }

  if (after && typeof after === 'function') {
    try {
      await after(result)
    } catch {
      // Skip if after callback fails
    }
  }
}

export const selectServerResponse = <T = unknown>(store: unknown): T | undefined => {
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
