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

export type SuccessOptions = {
  resetStrategy?: 'none' | 'values' | 'all'
  flash?: { set: (msg: string) => void; message?: string }
  after?: () => void | Promise<void>
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
  
  if (!err || typeof err !== 'object') {
    return { fields: {}, form: fallbackFormMessage }
  }

  const result: MappedServerErrors = { fields: {} }

  if ('issues' in err && Array.isArray((err as Record<string, unknown>).issues)) {
    const issues = (err as Record<string, unknown>).issues as Array<{ path: (string | number)[]; message: string }>
    for (const issue of issues) {
      const path = pathMapper(issue.path.join('.'))
      if (!result.fields[path]) result.fields[path] = []
      result.fields[path].push(issue.message)
    }
    return result
  }

  if ('errors' in err && typeof (err as Record<string, unknown>).errors === 'object') {
    const errors = (err as Record<string, unknown>).errors as Record<string, string | string[]>
    for (const [key, value] of Object.entries(errors)) {
      const path = pathMapper(key)
      const messages = Array.isArray(value) ? value : [value]
      result.fields[path] = messages
    }
    return result
  }

  if ('message' in err && Array.isArray((err as Record<string, unknown>).message)) {
    const messages = (err as Record<string, unknown>).message as Array<{ field: string; message: string }>
    for (const item of messages) {
      if (typeof item === 'object' && 'field' in item && 'message' in item) {
        const path = pathMapper(item.field)
        if (!result.fields[path]) result.fields[path] = []
        result.fields[path].push(item.message)
      }
    }
    return result
  }

  if ('fieldErrors' in err && Array.isArray((err as Record<string, unknown>).fieldErrors)) {
    const fieldErrors = (err as Record<string, unknown>).fieldErrors as ServerFieldError[]
    for (const fieldError of fieldErrors) {
      const path = pathMapper(fieldError.path)
      if (!result.fields[path]) result.fields[path] = []
      result.fields[path].push(fieldError.message)
    }
  }

  if ('formError' in err && typeof (err as Record<string, unknown>).formError === 'object') {
    const formError = (err as Record<string, unknown>).formError as ServerFormError
    result.form = formError.message
  } else if ('message' in err && typeof (err as Record<string, unknown>).message === 'string') {
    result.form = (err as Record<string, unknown>).message as string
  }

  if (Object.keys(result.fields).length === 0 && !result.form) {
    result.form = fallbackFormMessage
  }

  return result
}

export function applyServerErrors<TFormApi extends { setFieldMeta: (path: string, updater: (prev: unknown) => unknown) => void; setFormMeta: (updater: (prev: unknown) => unknown) => void }>(
  form: TFormApi,
  mapped: MappedServerErrors
): void {
  for (const [fieldPath, messages] of Object.entries(mapped.fields)) {
    if (messages.length > 0) {
      form.setFieldMeta(fieldPath, (prev: unknown) => {
        const prevMeta = (prev as Record<string, unknown>) || {}
        return {
          ...prevMeta,
          errorMap: {
            ...(prevMeta.errorMap as Record<string, unknown>),
            onServer: messages[0],
          },
          errorSourceMap: {
            ...(prevMeta.errorSourceMap as Record<string, unknown>),
            onServer: 'server',
          },
        }
      })
    }
  }

  if (mapped.form) {
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
  }
}

export async function onServerSuccess<TFormApi extends { reset?: (options?: { resetValidation?: boolean }) => void }>(
  form: TFormApi,
  _result: unknown,
  opts?: SuccessOptions
): Promise<void> {
  const { resetStrategy = 'none', flash, after } = opts || {}

  if (resetStrategy !== 'none' && form.reset) {
    if (resetStrategy === 'values') {
      form.reset({ resetValidation: false })
    } else {
      form.reset()
    }
  }

  if (flash?.set && flash.message) {
    flash.set(flash.message)
  }

  if (after) {
    await after()
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

function defaultPathMapper(serverPath: string): string {
  return serverPath
    .replace(/\[(\d+)\]/g, '.$1')
    .replace(/\[([^\]]+)\]/g, '.$1')
    .replace(/^\./, '')
}
