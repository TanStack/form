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

function hasStringMessage(err: unknown): err is { message: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as Record<string, unknown>).message === 'string'
  )
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

  if (!err || typeof err !== 'object') {
    return { fields: {}, form: fallbackFormMessage }
  }

  const result: MappedServerErrors = { fields: {} }

  if (isZodError(err)) {
    for (const issue of err.issues) {
      if (issue.path && issue.message && Array.isArray(issue.path)) {
        try {
          const path = pathMapper(issue.path.join('.'))
          if (path && typeof issue.message === 'string') {
            if (!result.fields[path]) result.fields[path] = []
            result.fields[path].push(issue.message)
          }
        } catch {
          // Skip invalid issue
        }
      }
    }
    return result
  }

  if (isRailsError(err)) {
    try {
      for (const [key, value] of Object.entries(err.errors)) {
        if (typeof key === 'string') {
          const path = pathMapper(key)
          if (path) {
            const messages = Array.isArray(value) ? value : [value]
            const validMessages = messages.filter(
              (msg) => typeof msg === 'string' && msg.length > 0,
            )
            if (validMessages.length > 0) {
              result.fields[path] = validMessages
            }
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
        if (
          typeof item === 'object' &&
          item &&
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
    } catch {
      // Skip invalid NestJS error format
    }
    return result
  }

  if (isCustomFieldError(err)) {
    try {
      for (const fieldError of err.fieldErrors) {
        if (
          fieldError?.path &&
          fieldError?.message &&
          typeof fieldError.path === 'string' &&
          typeof fieldError.message === 'string' &&
          fieldError.message.length > 0
        ) {
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
    if (typeof err.message === 'string' && err.message.length > 0) {
      result.form = err.message
    }
  }

  if (Object.keys(result.fields).length === 0 && !result.form) {
    result.form = fallbackFormMessage
  }

  return result
}

export function applyServerErrors<TFormApi>(
  form: TFormApi,
  mapped: MappedServerErrors,
  opts?: ApplyErrorsOptions,
): void {
  if (!form || !mapped || typeof mapped !== 'object') {
    return
  }

  const multipleMessages = opts?.multipleMessages || 'first'
  const separator = opts?.separator || '; '

  if (mapped.fields && typeof mapped.fields === 'object') {
    for (const [path, messages] of Object.entries(mapped.fields)) {
      if (
        messages &&
        Array.isArray(messages) &&
        messages.length > 0 &&
        typeof path === 'string'
      ) {
        let errorMessage: string | string[]

        switch (multipleMessages) {
          case 'join': {
            errorMessage = messages
              .filter((msg) => typeof msg === 'string' && msg.length > 0)
              .join(separator)
            break
          }
          case 'array': {
            errorMessage = messages.filter(
              (msg) => typeof msg === 'string' && msg.length > 0,
            )
            break
          }
          default: {
            const firstValid = messages.find(
              (msg) => typeof msg === 'string' && msg.length > 0,
            )
            errorMessage = firstValid || ''
            break
          }
        }

        if (
          errorMessage &&
          'setFieldMeta' in form &&
          typeof form.setFieldMeta === 'function'
        ) {
          try {
            form.setFieldMeta(path, (prev: unknown) => {
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

  if (
    mapped.form &&
    typeof mapped.form === 'string' &&
    mapped.form.length > 0
  ) {
    if ('setFormMeta' in form && typeof form.setFormMeta === 'function') {
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
  TResult = unknown,
>(
  form: TFormApi,
  result: TResult,
  opts?: SuccessOptions<TResult>,
): Promise<void> {
  if (!form || typeof form !== 'object') {
    return
  }

  const {
    resetStrategy = 'none',
    flash,
    after,
    storeResult = false,
  } = opts || {}

  if (
    storeResult &&
    'setFormMeta' in form &&
    typeof form.setFormMeta === 'function'
  ) {
    try {
      form.setFormMeta((prev: unknown) => {
        const prevMeta = (prev as Record<string, unknown>) || {}
        return {
          ...prevMeta,
          _serverResponse: result,
        }
      })
    } catch {
      // Skip if setFormMeta fails
    }
  }

  if (
    resetStrategy !== 'none' &&
    'reset' in form &&
    typeof form.reset === 'function'
  ) {
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
