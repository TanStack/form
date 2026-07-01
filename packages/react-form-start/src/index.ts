import { decode } from 'decode-formdata'
import { validateServerValues } from '@tanstack/form-core'
import { getFormData } from './getFormData'
import { setInternalTanStackCookie } from './utils'
import type {
  DeepKeysWhereValueIncludes,
  FormOptions,
  FormValidators,
  ServerFormState,
  ServerValidateFailure,
  ServerValidateResult,
  ServerValidateSuccess,
} from '@tanstack/form-core'
import type { FormDataInfo } from 'decode-formdata'

export { getFormData }

export type TypedFormDataInfo<TFormData> = Omit<FormDataInfo, 'numbers'> & {
  numbers?: Array<DeepKeysWhereValueIncludes<TFormData, number>>
}

export interface StartServerValidateContext<TFormData = any> {
  formData: FormData
  info?: TypedFormDataInfo<TFormData>
}

export type StartServerValidateResult<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TOnInvalidReturn = never,
  TOnValidReturn = never,
> =
  | ServerValidateResult<TFormData, TFormValidators>
  | TOnInvalidReturn
  | TOnValidReturn

export interface StartServerValidateOptions<
  TOnInvalidReturn = never,
  TOnValidReturn = never,
> {
  info?: FormDataInfo
  onInvalid?: (args: {
    result: ServerValidateFailure<any, any>
    serverState: ServerFormState<any, any>
  }) => TOnInvalidReturn | Promise<TOnInvalidReturn>
  onValid?: (args: {
    result: ServerValidateSuccess<any, any>
  }) => TOnValidReturn | Promise<TOnValidReturn>
}

export interface StartCreateServerValidateOptions<TFormData> {
  info?: TypedFormDataInfo<TFormData>
  inferFormDataInfo?: boolean
}

export type StartServerValidateAction<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TOnInvalidReturn = never,
  TOnValidReturn = never,
> = {
  (
    context: StartServerValidateContext<TFormData>,
  ): Promise<
    StartServerValidateResult<
      TFormData,
      TFormValidators,
      TOnInvalidReturn,
      TOnValidReturn
    >
  >
  getFormData: () => Promise<ServerFormState<TFormData, TFormValidators>>
}

export type StartCreateServerValidate<
  TOnInvalidReturn = never,
  TOnValidReturn = never,
> = <
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  formOptions: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  options?: StartCreateServerValidateOptions<TFormData>,
) => StartServerValidateAction<
  TFormData,
  TFormValidators,
  TOnInvalidReturn,
  TOnValidReturn
>

function decodeFormData<TFormData>(
  formData: FormData,
  info: FormDataInfo | undefined,
): TFormData {
  return (info ? decode(formData, info) : decode(formData)) as TFormData
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function inferFormDataInfo(defaultValues: unknown): FormDataInfo | undefined {
  const numbers: Array<string> = []

  const visit = (value: unknown, path: string) => {
    if (typeof value === 'number') {
      if (path) numbers.push(path)
      return
    }

    if (!isPlainObject(value)) return

    for (const [key, child] of Object.entries(value)) {
      visit(child, path ? `${path}.${key}` : key)
    }
  }

  visit(defaultValues, '')

  return numbers.length ? { numbers } : undefined
}

function mergeFormDataInfo(
  ...infos: Array<FormDataInfo | undefined>
): FormDataInfo | undefined {
  let result: Record<string, unknown> | undefined

  for (const info of infos) {
    if (!info) continue

    for (const [key, value] of Object.entries(info)) {
      if (value === undefined) continue

      result ??= {}

      const previous = result[key]
      if (Array.isArray(previous) && Array.isArray(value)) {
        result[key] = Array.from(new Set([...previous, ...value]))
      } else if (Array.isArray(value)) {
        result[key] = Array.from(new Set(value))
      } else {
        result[key] = value
      }
    }
  }

  return result
}

export function start<TOnInvalidReturn = never, TOnValidReturn = never>(
  options: StartServerValidateOptions<TOnInvalidReturn, TOnValidReturn> = {},
) {
  const createServerValidate = <
    TFormData,
    const TFormValidators extends FormValidators<TFormData>,
    TSubmitReturn,
  >(
    formOptions: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
    formValidateOptions?: StartCreateServerValidateOptions<TFormData>,
  ): StartServerValidateAction<
    TFormData,
    TFormValidators,
    TOnInvalidReturn,
    TOnValidReturn
  > => {
    const inferredInfo =
      formValidateOptions?.inferFormDataInfo === false
        ? undefined
        : inferFormDataInfo(formOptions.defaultValues)

    const validate = async (
      context: StartServerValidateContext<TFormData>,
    ): Promise<
      StartServerValidateResult<
        TFormData,
        TFormValidators,
        TOnInvalidReturn,
        TOnValidReturn
      >
    > => {
      const values = decodeFormData<TFormData>(
        context.formData,
        mergeFormDataInfo(
          inferredInfo,
          options.info,
          formValidateOptions?.info,
          context.info,
        ),
      )

      const result = await validateServerValues(formOptions, values)

      if (result.success) {
        return options.onValid ? options.onValid({ result }) : result
      }

      setInternalTanStackCookie(result.serverState)

      return options.onInvalid
        ? options.onInvalid({
            result,
            serverState: result.serverState,
          })
        : result
    }

    return Object.assign(validate, {
      getFormData: getFormData as () => Promise<
        ServerFormState<TFormData, TFormValidators>
      >,
    })
  }

  return {
    id: 'react-form-start' as const,
    createServerValidate,
    getFormData,
  }
}
